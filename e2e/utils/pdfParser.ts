import * as fs from "fs";
import { PDFParse } from "pdf-parse";

export async function getPdfTextAndDeletePdf(
  response: Buffer<ArrayBufferLike>,
) {
  const pdfPath = `./downloads/downloaded_form_${Date.now()}.pdf`;
  fs.writeFileSync(pdfPath, response);
  const parser = new PDFParse({ data: response });
  const text = (await parser.getText()).text;
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  return text;
}
