import os
from PIL import Image

# Check pages 4, 5, 6, 7 png renders
img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"

for page_num in range(1, 9):
    img_path = os.path.join(img_dir, f"simulado_pagina_{page_num}.png")
    if os.path.exists(img_path):
        img = Image.open(img_path)
        print(f"Page {page_num} size: {img.size}")

# Let's crop question 7, 8, 9 from pages 5, 6 and save them to inspect
p5 = Image.open(os.path.join(img_dir, "simulado_pagina_5.png"))
p6 = Image.open(os.path.join(img_dir, "simulado_pagina_6.png"))
p7 = Image.open(os.path.join(img_dir, "simulado_pagina_7.png"))

# Save crops
p5.crop((0, 0, p5.width, int(p5.height * 0.9))).save(os.path.join(img_dir, "crop_p5_q7.png"))
p6.crop((0, 0, p6.width, int(p6.height * 0.9))).save(os.path.join(img_dir, "crop_p6_q8_q9.png"))

print("Cropped page images saved for inspection!")
