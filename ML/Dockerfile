# Use Python 3.9 slim as the base
FROM python:3.9-slim

# Install system dependencies for OpenCV and Tesseract OCR
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Set up a working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your project files
COPY . .

# Create the uploads folder with correct permissions
RUN mkdir -p uploads && chmod 777 uploads

# Run using Gunicorn (much more stable than flask.run)
# Port 7860 is mandatory for Hugging Face Spaces
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]