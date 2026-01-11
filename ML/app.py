from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from engine import extract_details

app = Flask(__name__)

# CORS configuration for production
# Allow all origins for development, specify in production
CORS(app, resources={
    r"/extract": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            # Add your Vercel frontend URL here after deployment
            # Example: "https://your-project.vercel.app"
            "*"  # Allow all origins for testing - restrict in production
        ]
    }
})

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "ML Backend is Running. Send POST requests to /extract"

@app.route('/extract', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    try:
        data = extract_details(filepath)
        # Check if basic details were found
        data['is_valid_ocr'] = data.get('Name') != "Not Found" and data.get('Aadhaar Number') != "Not Found"
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    # Hugging Face Spaces uses port 7860
    app.run(host='0.0.0.0', port=7860)