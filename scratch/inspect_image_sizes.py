import os
from PIL import Image

img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"

for f in sorted(os.listdir(img_dir)):
    if f.endswith(('.png', '.jpeg', '.jpg')):
        fp = os.path.join(img_dir, f)
        img = Image.open(fp)
        print(f"{f}: {img.size}, mode={img.mode}")
