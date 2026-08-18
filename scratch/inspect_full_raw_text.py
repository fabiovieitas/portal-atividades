import pymupdf

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"
doc = pymupdf.open(pdf_path)

for p_num in [4, 5, 6]:
    page = doc[p_num - 1]
    print(f"\n==================== PAGE {p_num} RAW LINES ====================")
    text = page.get_text("text")
    for line in text.splitlines():
        if line.strip():
            print(line.strip())
