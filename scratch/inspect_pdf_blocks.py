import pymupdf

pdf_path = r"C:\Users\fabiovieitas\.gemini\antigravity-ide\brain\ba48f903-d1ba-42e0-a8e3-204cc2effca9\media__1787015439702.pdf"
doc = pymupdf.open(pdf_path)

with open(r"c:\Users\fabiovieitas\Desktop\Super Gerador\portal-atividades-lab\scratch\pdf_blocks_dump.txt", "w", encoding="utf-8") as out:
    for page_idx, page in enumerate(doc):
        out.write(f"\n==================== PAGE {page_idx + 1} ====================\n")
        blocks = page.get_text("blocks")
        # Sort blocks by y0 (vertical position), then x0
        blocks_sorted = sorted(blocks, key=lambda b: (b[1], b[0]))
        for b in blocks_sorted:
            text = b[4].strip()
            if text:
                out.write(f"[{b[0]:.1f}, {b[1]:.1f}] {text}\n---\n")

print("Dumped sorted blocks to scratch/pdf_blocks_dump.txt!")
