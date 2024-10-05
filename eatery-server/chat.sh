#!/bin/bash

# Set the server URL (change this to the actual endpoint where your chat function is hosted)
SERVER_URL="http://localhost:8000/chat"

# Initialize an empty log array
LOG='[]'

# Function to send a message to the chat endpoint
send_message() {
  local user_message=$1

  # Add the user's message to the log
  LOG=$(echo "$LOG" | jq --arg message "$user_message" '. += [{"role": "user", "content": $message}]')
  if [ $? -ne 0 ]; then
    echo "Error updating the log with the user's message."
    echo "Current LOG: $LOG"
    exit 1
  fi

  # Debugging output
  echo "Updated LOG: $LOG"

  # Send the message to the server endpoint using curl
  payload=$(jq -n --arg message "$user_message" '{"message": $message}')
  echo "Payload: $payload"

  response=$(curl -s -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -d "$payload")

  # Debugging output
  echo "Response from server: $response"
  
  # Check if response is empty or null
  if [ -z "$response" ] || [ "$response" == "null" ]; then
    echo "Error: No response from server"
    exit 1
  fi

  # Extract the assistant's response from the response JSON
  assistant_response=$(echo "$response" | jq -r '.messages | map(select(.role == "assistant"))[-1].content')
  
  # Check if the assistant's response is null or empty
  if [ -z "$assistant_response" ] || [ "$assistant_response" == "null" ]; then
    echo "Error: Invalid response structure or no content in response"
    exit 1
  fi

  LOG=$(echo "$LOG" | jq --arg message "$assistant_response" '. += [{"role": "assistant", "content": $message}]')
  if [ $? -ne 0 ]; then
    echo "Error updating the log with the assistant's message."
    echo "Current LOG: $LOG"
    exit 1
  fi

  # Print the assistant's response
  echo "Assistant: $assistant_response"
}

# Ongoing dialogue loop
echo "Welcome to the chat! Type 'exit' to end the conversation."
while true; do
  read -p "You: " user_message
  if [ "$user_message" == "exit" ]; then
    break
  fi
  send_message "$user_message"
done

echo "Goodbye!"

