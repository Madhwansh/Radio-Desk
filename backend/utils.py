import io
from PIL import Image
import numpy as np
import pydicom

ALLOWED_DICOM_EXT = {".dic", ".dicom", ".dcm"}

def process_file(upload_file, output_path, target_size=1024):
    filename = upload_file.filename.lower()
    ext = "." + filename.split(".")[-1]

    try:
        if ext in ALLOWED_DICOM_EXT:
            # Read file bytes and process as DICOM
            file_bytes = upload_file.file.read()
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            
            # Handle windowing using RescaleSlope and RescaleIntercept if available
            if hasattr(ds, 'RescaleSlope') and hasattr(ds, 'RescaleIntercept'):
                pixel_array = ds.pixel_array * ds.RescaleSlope + ds.RescaleIntercept
            else:
                pixel_array = ds.pixel_array

            # Normalize pixel values for 8-bit image conversion
            pixel_array = np.clip((pixel_array - np.min(pixel_array)) / (np.max(pixel_array) - np.min(pixel_array)) * 255, 0, 255).astype(np.uint8)
            
            # Convert to grayscale image
            image = Image.fromarray(pixel_array).convert("L")
        else:
            # Process as a standard image (e.g., .png, .jpg)
            image = Image.open(upload_file.file)

        # Resize image while maintaining aspect ratio (longest side = target_size)
        image.thumbnail((target_size, target_size))

        # Save the processed image as PNG
        image.save(output_path, format="PNG")
        print(f"File processed and saved to {output_path}")
    
    except Exception as e:
        print(f"Error processing file: {e}")
