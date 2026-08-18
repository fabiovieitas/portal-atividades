import os
import sys

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"

try:
    import fitz  # PyMuPDF
    doc = fitz.open(pdf_path)
    print(f"Total pages: {len(doc)}")
    
    img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"
    os.makedirs(img_dir, exist_ok=True)
    
    img_count = 0
    for page_num in range(len(doc)):
        page = doc[page_num]
        print(f"\n--- PAGE {page_num + 1} ---")
        print(page.get_text())
        
        # Extract images
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            img_filename = f"q_img_p{page_num + 1}_{img_index + 1}.{image_ext}"
            img_filepath = os.path.join(img_dir, img_filename)
            with open(img_filepath, "wb") as f:
                f.write(image_bytes)
            img_count += 1
            print(f"Saved image: {img_filename}")

    print(f"\nExtracted {img_count} images to {img_dir}")

except Exception as e:
    print(f"PyMuPDF error: {e}")
    # Fallback try pypdf or pdfplumber
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        print(f"Total pages via pypdf: {len(reader.pages)}")
        for i, page in enumerate(reader.pages):
            print(f"\n--- PAGE {i+1} ---")
            print(page.extract_text())
    except Exception as e2:
        print(f"pypdf error: {e2}")
