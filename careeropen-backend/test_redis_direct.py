import redis

try:
    # Connect to Redis
    r = redis.Redis(host='localhost', port=6379, db=1, socket_connect_timeout=5)
    
    # Test the connection
    r.ping()
    print("Successfully connected to Redis!")
    
    # Set a test key
    r.set('test_key', 'test_value', ex=30)  # ex=30 sets a 30-second expiration
    
    # Get the test key
    value = r.get('test_key')
    print(f"Test value from Redis: {value.decode('utf-8') if value else 'Not found'}")
    
except redis.ConnectionError as e:
    print(f"Could not connect to Redis: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
