import pymupdf

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"
doc = pymupdf.open(pdf_path)

print("=== WORDS ON PAGE 5 ===")
for w in doc[4].get_text("words"):
    print(w[4], end=" ")
print("\n")

print("=== WORDS ON PAGE 6 ===")
for w in doc[5].get_text("words"):
    print(w[4], end=" ")
print("\n")
