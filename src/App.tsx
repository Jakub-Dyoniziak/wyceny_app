import { useState } from "react";
type QuoteItem = {
  description: string;
  price: number;
};

export default function App() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  )
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

      <button
        onClick={() =>
          setItems([
            ...items,
          {
            description: "",
            price: 0,
          },
        ])}>Dodaj pozycję
      </button>

      {items.map((item, index) => (
        <div key={index}>
          <input
            placeholder="Opis"
            value={item.description}
            onChange={(e) => {
              const updated = [...items];

              updated[index].description =
                e.target.value;

              setItems(updated);
            }}
          />

          <input
            placeholder="Cena"
            type="number"
            value={item.price}
            onChange={(e) => {
              const updated = [...items];

              updated[index].price =
              Number(e.target.value);

            setItems(updated);
            }}
          />
        </div>
      ))}

      <h2> Suma: {total} €</h2>
    </div>
  );
}