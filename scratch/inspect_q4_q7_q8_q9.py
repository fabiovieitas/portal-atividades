import fitz

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"
doc = fitz.open(pdf_path)

print("=== PAGE 4 ===")
print(doc[3].get_text())

print("=== PAGE 5 ===")
print(doc[4].get_text())

print("=== PAGE 6 ===")
print(doc[5].get_text())

print("=== PAGE 7 ===")
print(doc[6].get_text())
