export async function extractTextFromFile(
  file: File,
  filename: string
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  switch (ext) {
    case "pdf": {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";
      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const parts: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        parts.push(content.items.map((item: any) => item.str).join(" "));
      }
      doc.destroy();
      return parts.join("\n");
    }
    case "docx": {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || "";
    }
    case "txt":
      return await file.text();
    default:
      throw new Error(
        `Unsupported format: .${ext}. Please upload PDF, DOCX, or TXT.`
      );
  }
}
