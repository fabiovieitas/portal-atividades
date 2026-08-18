import easyocr
import os

reader = easyocr.Reader(['pt', 'en'])

img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"

for crop_name in ["inspect_q4.png", "inspect_q7.png", "inspect_q8.png", "inspect_q9.png"]:
    img_path = os.path.join(img_dir, crop_name)
    if os.path.exists(img_path):
        print(f"\n==================== OCR FOR {crop_name} ====================")
        results = reader.readtext(img_path)
        for bbox, text, prob in results:
            print(f"[{prob:.2f}] {text}")
