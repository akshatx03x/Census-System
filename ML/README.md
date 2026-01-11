# Census Aadhar ML Service

A machine learning service for extracting and verifying Aadhar card information using OCR technology.

## Features

- **Aadhar Card OCR**: Extract name, Aadhar number, and other details from Aadhar card images
- **YOLO Object Detection**: Locate and crop Aadhar card regions
- **Multi-OCR Support**: Uses EasyOCR and PaddleOCR for accurate text extraction
- **Blockchain Integration**: Ready to integrate with Supabase for record verification

## API Endpoints

### `POST /extract`

Extract details from an Aadhar card image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file - jpg, png, etc.)

**Response:**
```json
{
  "Name": "John Doe",
  "Aadhaar Number": "1234 5678 9012",
  "DOB": "01/01/1990",
  "Gender": "Male",
  "Address": "123 Main St, City, State - 123456",
  "is_valid_ocr": true
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Local Development

### Prerequisites
- Python 3.9+
- Docker (for containerized development)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ML
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run locally:
```bash
python app.py
```

The service will be available at `http://localhost:7860`

### Testing

```bash
# Test with a sample image
curl -X POST -F "file=@test_aadhar.jpg" http://localhost:7860/extract
```

## Deployment to Hugging Face Spaces

### Option 1: Direct Upload

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces)
2. Select "Docker" as the SDK
3. Upload all files from this directory
4. Hugging Face will automatically build and deploy

### Option 2: GitHub Integration

1. Push this directory to GitHub
2. Create a new Space on Hugging Face
3. Select "GitHub" as the source
4. Connect your repository

### Hardware Requirements

- **CPU (Free Tier)**: Suitable for single image processing
- **GPU**: Optional for faster inference (not required for this use case)

### Environment Variables

No environment variables are required for basic functionality. The service uses:
- Port: `7860` (Hugging Face Spaces requirement)
- Upload folder: `/app/uploads`

## Architecture

```
Input Image
    ↓
YOLO Object Detection (Aadhar card localization)
    ↓
Image Preprocessing
    ↓
OCR (EasyOCR + PaddleOCR)
    ↓
Text Post-processing & Formatting
    ↓
JSON Response
```

## Dependencies

- Flask + Flask-CORS
- EasyOCR
- PaddleOCR
- Ultralytics (YOLOv8)
- OpenCV
- NumPy
- Pillow
- Gunicorn (for production)

## License

MIT License

