import io
from PIL import Image
import pydicom

ALLOWED_DICOM_EXT = {".dic", ".dicom", ".dcm"}

def process_file(upload_file, output_path, target_size=1024):
    filename = upload_file.filename.lower()
    ext = "." + filename.split(".")[-1]
    
    if ext in ALLOWED_DICOM_EXT:
        # Read file bytes and process as DICOM
        file_bytes = upload_file.file.read()
        ds = pydicom.dcmread(io.BytesIO(file_bytes))
        # Normalize pixel data if necessary and convert to grayscale image
        pixel_array = ds.pixel_array
        image = Image.fromarray(pixel_array).convert("L")
    else:
        # Process as a standard image (e.g., .png file)
        image = Image.open(upload_file.file)

    # Resize image while maintaining aspect ratio (longest side = target_size)
    image.thumbnail((target_size, target_size))
    
    # Save the processed image as PNG
    image.save(output_path, format="PNG")
