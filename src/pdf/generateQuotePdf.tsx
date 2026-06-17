import {
  PDFDocument,
  StandardFonts,
} from "pdf-lib";

export async function generateQuotePdf() {
console.log("PDF CLICKE");

  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();

  const font =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  page.drawText("Generator wycen dziala!", {
    x: 250,
    y: 750,
    size: 20,
    font,
  });

  const pdfBytes =
    await pdfDoc.save();

  const blob = new Blob(
    [new Uint8Array(pdfBytes)],
    {
      type: "application/pdf",
    }
  );

  const url =
    URL.createObjectURL(blob);

  window.open(url);
}