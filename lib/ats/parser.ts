"use server";

export async function extractTextFromFile(
  file: File,
  filename: string
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const bytes = await file.arrayBuffer();

  switch (ext) {
    case "pdf": {
      const { PDFParse } = await import("pdf-parse");
      PDFParse.setWorker(
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs"
      );
      const parser = new PDFParse({ data: new Uint8Array(bytes) });
      try {
        const result = await parser.getText();
        return result.text || "";
      } finally {
        await parser.destroy();
      }
    }
    case "docx": {
      const { default: mammoth } = await import("mammoth");
      const buffer = Buffer.from(bytes);
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    case "txt": {
      return new TextDecoder().decode(bytes);
    }
    default:
      throw new Error(
        `Unsupported file format: .${ext}. Please upload a PDF, DOCX, or TXT file.`
      );
  }
}
