import { useState } from "react";
type QuoteItem = {
  description: string;
  price: number;
};

type QuoteSection = {
  title: string;
  items: QuoteItem[];
};

export default function App() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("");
  const [sections, setSections] = useState<QuoteSection[]>([]);
  const total = sections.reduce(
    (sectionSum, section) =>
      sectionSum + section.items.reduce(
        (itemSum, item) =>
          itemSum + item.price,
        0
      ),
    0
  );
  return (
    <div style={{ padding: "30px" }}>
      <h1>Generator wycen</h1>

      <input 
        value={quoteNumber}
        onChange={(e) => setQuoteNumber(e.target.value)}
        placeholder="Numer wyceny" />
      <br />
      <br />

      <input 
        value={quoteTitle}
        onChange={(e) => setQuoteTitle(e.target.value)}
        placeholder="Tytuł wyceny" />

      <h2>Wykonawca</h2>
      <input placeholder="Imie i nazwisko" />
      <br /><br />
      <input placeholder="Adres" />
      <br /><br />
      <input placeholder="Email" />

      <h2>Klient</h2>
      <input placeholder="Imie i nazwisko" />
      <br /><br />
      <input placeholder="Adres" />
      <br /><br />
      <input placeholder="Email" />
      <br /><br />

      {sections.map((section, sectionIndex) => (
        
        <div
          key={sectionIndex}
          style={{
            border: "1 px solid gray",
            padding: "15px",
            marginTop: "20px",
          }}>
            <h3>
              Sekcja {sectionIndex + 1}
            </h3>

            <input
              value={section.title}
              placeholder="Nazwa sekcji"
              onChange={(e) => {
              const updated = [...sections];

              updated[sectionIndex].title = 
                e.target.value;

              setSections(updated);
            }}/>

            <button
              onClick={() => {
                setSections(
                  sections.filter(
                    (_, i) => i !== sectionIndex
                  )
                );
              }}>Usuń sekcję</button>

            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                style={{
                  marginTop: "10px",
                }}
              >

                <input
                  value={item.description}
                  placeholder="Opis"
                  onChange={(e) => {
                    const updated = [...sections];

                    updated[sectionIndex]
                    .items[itemIndex]
                    .description = e.target.value;

                    setSections(updated);
                  }}
                />

                <input
                  type="number"
                  value={item.price}
                  placeholder="Cena"
                  onChange={(e) => {
                    const updated = [...sections];

                    updated[sectionIndex]
                      .items[itemIndex]
                      .price = Number(e.target.value);

                    setSections(updated);
                  }}
                />

                <button
                  onClick={() => {
                  const updated = [...sections];

                  updated[sectionIndex].items =
                  updated[sectionIndex].items.filter(
                    (_, i) => i !== itemIndex
                  );

                  setSections(updated);
                  }}>Usuń
                </button>
              </div>
            ))}

            <button
              onClick={() => {
              const updated = [...sections];

              updated[sectionIndex].items.push({
                description: "",
                price: 0,
              });

              setSections(updated);
              }}>Dodaj pozycję
            </button>
        </div>
      ))}

      <button
        onClick={() =>
          setSections([
            ...sections,
            {
              title: "",
              items: [],
            },
          ])
        }
      > Dodaj sekcję
      </button>

      <h2>
      Razem: {total.toFixed(2)} €
      </h2>
    </div>
  )}