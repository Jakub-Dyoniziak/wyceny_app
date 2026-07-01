import {
  PDFDocument,
  StandardFonts,
  PDFPage,
  PDFFont,
} from "pdf-lib";

export type QuoteData = {
    quoteNumber: string;
    quoteTitle: string;
    quoteAddress: string;
    quoteData: string;

    contractor: {
        name: string;
        address: string;
        address2: string;
        phone: string;
        email: string;
    };

    client: {
        name: string;
        address: string;
        address2: string;
    };

    sections: {
        title: string;
        items: {
            description: string;
            price: number;
        }[];
    }[];
};

function drawRightAlignedText(
page: PDFPage,
text: string,
rightX: number,
y: number,
size: number,
font: PDFFont,
){
const width = font.widthOfTextAtSize(text, size);
page.drawText(text, {
x: rightX - width,
y,
size,
font,
});
};

function drawDots(
  page: PDFPage,
  startX: number,
  endX: number,
  y: number,
  font: PDFFont
){
  const dotWidth = font.widthOfTextAtSize(".", 12);

  for (
    let x = startX;
    x < endX;
    x += dotWidth + 1
  ) {
    page.drawText(".", {
      x,
      y,
      size: 11,
      font,
    });
  }
};

function wrapText(
  text: string,
  maxLength: number
) {
  const words =
    text.split(" ");

  const lines: string[] = [];

  let currentLine = "";

  words.forEach((word) => {
    const testLine =
      currentLine +
      word +
      " ";

    if (
      testLine.length >
      maxLength
    ) {
      lines.push(currentLine);

      currentLine =
        word + " ";
    } else {
      currentLine =
        testLine;
    }
  });

  lines.push(currentLine);

  return lines;
}

export async function generateQuotePdf(
    data: QuoteData
) {
    const pdfDoc = await PDFDocument.create();

    let page = pdfDoc.addPage();

    let y = 550;

    const PAGE_TOP = 760;
    const PAGE_BOTTOM = 70;

    const font =
        await pdfDoc.embedFont(
        StandardFonts.Helvetica
        );

    function checkNewPage() {
      if (y > PAGE_BOTTOM) {
        return;
      }

      page = pdfDoc.addPage();

      y = PAGE_TOP;
    }

//NUMER WYCENY//
const pageWidth = page.getWidth();

const quoteNumberWidth =
  font.widthOfTextAtSize(
    data.quoteNumber,
    12
  );

page.drawText(
  data.quoteNumber,
  {
    x: (pageWidth - quoteNumberWidth) / 2,
    y: 600,
    size: 12,
    font,
  }
);

page.drawLine({
  start: {
    x:
      (pageWidth -
        quoteNumberWidth) /
      2,
    y: 599,
  },

  end: {
    x:
      (pageWidth +
        quoteNumberWidth) /
      2,
    y: 599,
  },

  thickness: 0.5,
});

//TYTUŁ WYCENY//
page.drawText(
  `${data.quoteTitle}:`,
  {
    x: 70,
    y: 575,
    size: 12,
    font,
  }
);

//ADRES I DATA WYCENY//
drawRightAlignedText(
page,
`${data.quoteAddress}, ${data.quoteData}`,
525,
760,
11,
font

);

//DANE WYKONAWCY//
page.drawText(
  data.contractor.name,
  {
    x: 70,
    y: 760,
    size: 12,
    font,
  }
);

page.drawText(
  data.contractor.address,
  {
    x: 70,
    y: 743,
    size: 12,
    font,
  }
);

page.drawText(
  data.contractor.address2,
  {
    x: 70,
    y: 726,
    size: 12,
    font,
  }
);

page.drawText(
  data.contractor.phone,
  {
    x: 70,
    y: 709,
    size: 12,
    font,
  }
);

page.drawText(
  data.contractor.email,
  {
    x: 70,
    y: 692,
    size: 12,
    font,
  }
);

//DANE KLIENTA//
drawRightAlignedText(
page,
data.client.name,
525,
670,
11,
font
);

drawRightAlignedText(
page,
data.client.address,
525,
655,
11,
font
);

drawRightAlignedText(
page,
data.client.address2,
525,
640,
11,
font
);

//SEKCJE I POZYCJE WYCEN//
data.sections.forEach((section, sectionIndex) => {
  const sectionLines = wrapText(
  `${sectionIndex + 1}. ${section.title}:`,
  80
  );

  sectionLines.forEach((line) => {

    checkNewPage();

    page.drawText(line, {
      x: 90,
      y,
      size: 12,
      font,
    });
    y -= 18;
  });

  y -= 7;

    section.items.forEach((item) => {

    const lines = wrapText(
        item.description,
        78
    );

    const priceText =
        `${item.price},-`;

    const priceWidth =
        font.widthOfTextAtSize(
            priceText,
            11
        );

    const priceX =
        530 - priceWidth;

    lines.forEach((line, index) => {

      checkNewPage();

      page.drawText(
          line,
          {
              x: 110,
              y,
              size: 12,
              font,
          }
      );

      if (index === lines.length - 1) {

        const lineWidth =
          font.widthOfTextAtSize(
              line,
              12
          );

      drawDots(
          page,
          110 + lineWidth,
          priceX - 5,
          y,
          font
      );

      page.drawText(
          priceText,
          {
              x: priceX,
              y,
              size: 11,
              font,
          }
      )};

        y -= 18;
    });

    y -= 25;
});
});

const total = data.sections.reduce(
    (sum, section) =>
        sum +
    section.items.reduce(
        (s, item) => s + item.price,
        0
    ),
    0
);

if (y < 100) {
  checkNewPage();
}

//CAŁKOWITA KWOTA//
y -= 30;

page.drawText(
    `TOTAL: ${total} €`,
    {
        x: 90,
        y,
        size: 12,
        font,
    }
);

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
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `${data.quoteNumber}-${data.client.name}.pdf`;
//   link.click();
}