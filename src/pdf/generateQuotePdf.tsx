import {
  PDFDocument,
  StandardFonts,
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

export async function generateQuotePdf(
    data: QuoteData
) {
    let y = 680;

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage();

    const font =
        await pdfDoc.embedFont(
        StandardFonts.Helvetica
        );

//NUMER WYCENY//
page.drawText(
  `${data.quoteNumber}`,
  {
    x: 50,
    y: 750,
    size: 14,
    font,
  }
);

//TYTUŁ WYCENY//
page.drawText(
  `${data.quoteTitle}`,
  {
    x: 50,
    y: 730,
    size: 12,
    font,
  }
);

//ADRES WYCENY//
page.drawText(
  `${data.quoteAddress}`,
  {
    x: 400,
    y: 730,
    size: 12,
    font,
  }
);

//DATA WYCENY//
page.drawText(
  `${data.quoteData}`,
  {
    x: 450,
    y: 730,
    size: 12,
    font,
  }
);

//SEKCJE I POZYCJE WYCEN//
data.sections.forEach((section, sectionIndex) => {
    page.drawText(
        `${sectionIndex + 1}. ${section.title}`,
        {
            x: 50,
            y,
            size: 13,
            font,
        }
    );

    y -= 25;

    section.items.forEach((item) => {
        page.drawText(
            `- ${item.description}`,
            {
                x: 70,
                y,
                size: 11,
                font,
            }
        );

        page.drawText(
            `${item.price} €`,
            {
                x: 450,
                y,
                size: 11,
                font,
            }
        );

        y -= 10;
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

page.drawText(
    `TOTAL: ${total} €`,
    {
        x: 400,
        y: 50,
        size: 16,
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

  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.quoteNumber}-${data.client.name}.pdf`;
  link.click();
}