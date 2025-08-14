import http.client
import json

# Create a connection to the server
conn = http.client.HTTPConnection("localhost", 8000)

# Define the login payload
payload = json.dumps({
    "email": "test@example.com",
    "password": "testpassword123"
})

# Define headers
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

print("Sending POST request to /api/auth/login/")
try:
    # Send the POST request
    conn.request("POST", "/api/auth/login/", body=payload, headers=headers)
    
    # Get the response
    response = conn.getresponse()
    
    # Print the status and response
    print(f"Status: {response.status} {response.reason}")
    print("Headers:")
    for header, value in response.getheaders():
        print(f"  {header}: {value}")
    
    # Read and print the response body
    data = response.read()
    print("\nResponse Body:")
    print(data.decode('utf-8'))
    
except Exception as e:
    print(f"An error occurred: {e}")
    
finally:
    # Close the connection
    conn.close()
