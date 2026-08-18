import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"
output_img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"
os.makedirs(output_img_dir, exist_ok=True)

doc = fitz.open(pdf_path)

full_text = []

for page_index in range(len(doc)):
    page = doc[page_index]
    text = page.get_text()
    full_text.append(f"==================== PAGE {page_index + 1} ====================\n")
    full_text.append(text)
    full_text.append("\n\n")

    # Render full page as high resolution image
    pix = page.get_pixmap(dpi=150)
    page_img_path = os.path.join(output_img_dir, f"simulado_pagina_{page_index + 1}.png")
    pix.save(page_img_path)

    # Extract embedded images
    image_list = page.get_images(full=True)
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        img_name = f"simulado_img_p{page_index + 1}_{img_idx + 1}.{image_ext}"
        with open(os.path.join(output_img_dir, img_name), "wb") as f:
            f.write(image_bytes)

# Write full text dump
with open(r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\scratch\simulado_pdf_full_text.txt", "w", encoding="utf-8") as f:
    f.writelines(full_text)

print(f"Extraction complete! {len(doc)} pages rendered and saved to {output_img_dir}")
