import requests
import json

# The access token we obtained earlier
access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MDAzMjI0LCJpYXQiOjE3NTUwMDE0MjQsImp0aSI6ImY5OGU2ZWE5MWUzODRlNmM5ZDU1NGQ4ZDZlYjI2ZGFjIiwidXNlcl9pZCI6MX0.sTihiTzH40WAZPfGDD8mEF0r6MHywyPXm-XV40l4ODE'

# The URL for the user profile endpoint
url = 'http://127.0.0.1:8000/api/v1/auth/me/'

# Set up the headers with the access token
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

try:
    # Make the GET request
    response = requests.get(url, headers=headers)
    
    # Print the response status code and content
    print(f'Status Code: {response.status_code}')
    print('Response:')
    print(json.dumps(response.json(), indent=2))
    
except requests.exceptions.RequestException as e:
    # Handle any errors that occurred during the request
    print(f'An error occurred: {e}')
