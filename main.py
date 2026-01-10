import requests
import os

# Supabase configuration
SUPABASE_URL = "https://pgwhbsspiqicpkdjjolp.supabase.co"
SUPABASE_KEY = "sb_publishable_aZatorW9_uithBnZfZL1ZA_JZoqRakF"

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Use the URL your friend sent you (make sure it starts with https://)
NGROK_URL = "https://creamiest-claris-overangry.ngrok-free.dev"

def get_model_response(image_path):
    # Read the image from local file
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
    except FileNotFoundError as e:
        return f"Could not find image file: {e}"

    # Ensure the endpoint matches the @app.route defined in her app.py
    endpoint = f"{NGROK_URL}/predict"

    # Send the image as multipart/form-data
    files = {'file': ('aadhar_image.jpg', image_data, 'image/jpeg')}

    try:
        response = requests.post(endpoint, files=files)

        # This checks if the connection was successful (Status 200)
        if response.status_code == 200:
            return response.json()
        else:
            return f"Error: Server returned status {response.status_code}"

    except requests.exceptions.RequestException as e:
        return f"Could not connect to ngrok: {e}"

def verify_aadhar_with_database(extracted_name, extracted_aadhar_number):
    # Query the aadhar_records table using Supabase REST API
    query_url = f"{SUPABASE_URL}/rest/v1/aadhar_records"
    params = {
        "name": f"eq.{extracted_name}",
        "aadhar_number": f"eq.{extracted_aadhar_number}"
    }

    try:
        response = requests.get(query_url, headers=SUPABASE_HEADERS, params=params)
        if response.status_code == 200:
            data = response.json()
            if data:
                # Match found, update verified to true
                record = data[0]
                update_url = f"{SUPABASE_URL}/rest/v1/aadhar_records"
                update_data = {"verified": True}
                update_response = requests.patch(f"{update_url}?id=eq.{record['id']}", headers=SUPABASE_HEADERS, json=update_data)
                if update_response.status_code == 204:
                    return True
                else:
                    print(f"Failed to update record: {update_response.status_code}")
                    return False
            else:
                return False
        else:
            print(f"Query failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Database query error: {e}")
        return False

# --- Your Prototype Logic ---
if __name__ == "__main__":
    # Use local image file for testing
    image_path = "image 1.png"

    # Get model response
    result = get_model_response(image_path)
    print("Model Output:", result)

    if isinstance(result, dict) and 'name' in result and 'aadhar_number' in result:
        extracted_name = result['name']
        extracted_aadhar_number = result['aadhar_number']

        # Verify with database
        verified = verify_aadhar_with_database(extracted_name, extracted_aadhar_number)
        if verified:
            print("Aadhar verified successfully!")
        else:
            print("Aadhar verification failed - no matching record found.")
    else:
        print("Model did not return expected data format.")
