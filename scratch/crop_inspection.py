from PIL import Image
import os

img_dir = r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\public\img\simulado"

# Page 4 crop (Q4 & Q5)
p4 = Image.open(os.path.join(img_dir, "simulado_pagina_4.png"))
p4.crop((0, 0, p4.width, int(p4.height * 0.55))).save(os.path.join(img_dir, "inspect_q4.png"))

# Page 5 crop (Q7 & Q6)
p5 = Image.open(os.path.join(img_dir, "simulado_pagina_5.png"))
p5.crop((0, int(p5.height * 0.45), p5.width, p5.height)).save(os.path.join(img_dir, "inspect_q7.png"))

# Page 6 crop (Q8 & Q9)
p6 = Image.open(os.path.join(img_dir, "simulado_pagina_6.png"))
p6.crop((0, 0, p6.width, int(p6.height * 0.6))).save(os.path.join(img_dir, "inspect_q8.png"))
p6.crop((0, int(p6.height * 0.5), p6.width, p6.height)).save(os.path.join(img_dir, "inspect_q9.png"))

print("Cropped inspection images created successfully!")
