import { useState } from "react";
import './index.css';
import { generateQuotePdf } from "./pdf/generateQuotePdf";
type QuoteItem = {
  description: string;
  price: number;
};

type QuoteSection = {
  title: string;
  items: QuoteItem[];
};

type Contractor = {
  name: string;
  address: string;
  address2: string;
  phone: string;
  email: string;
};

type Client = {
  name: string;
  address: string;
  address2: string;
};

export default function App() {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("");
  const [quoteAddress, setQuoteAddress] = useState("");
  const [quoteData, setQuoteData] = useState("");
  const [contractor, setContractor] = useState<Contractor>({
    name: "Adam Nowak",
    address: "23, Dmowskiego",
    address2: "60-222 Poznań",
    phone: "888192383",
    email: "jakubdyoniziak@gmail.com",
  });
  const [client, setClient] = useState<Client>({
    name: "Jan Kowal",
    address: "15, Pleszewska",
    address2: "61-136 Poznań",
  });

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
      <br />
      <br />

      <input 
        value={quoteAddress}
        onChange={(e) => setQuoteAddress(e.target.value)}
        placeholder="Adres wyceny" />
      <br /><br />

      <input 
        value={quoteData}
        onChange={(e) => setQuoteData(e.target.value)}
        placeholder="Data wyceny" />
      <br /><br />

      <h2>Wykonawca</h2>
      <input 
        placeholder="Imie i nazwisko"
        value={contractor.name}
        onChange={(e) =>
          setContractor({
            ...contractor,
            name: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Adres"
        value={contractor.address}
        onChange={(e) =>
          setContractor({
            ...contractor,
            address: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Adres 2"
        value={contractor.address2}
        onChange={(e) =>
          setContractor({
            ...contractor,
            address2: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Numer"
        value={contractor.phone}
        onChange={(e) =>
          setContractor({
            ...contractor,
            phone: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Email"
        value={contractor.email}
        onChange={(e) =>
          setContractor({
            ...contractor,
            email: e.target.value,
          })
        }/>

      <h2>Klient</h2>
      <input 
        placeholder="Imie i nazwisko"
        value={client.name}
        onChange={(e) =>
          setClient({
            ...client,
            name: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Adres"
        value={client.address}
        onChange={(e) =>
          setClient({
            ...client,
            address: e.target.value,
          })
        }/>
      <br /><br />
      <input 
        placeholder="Adres 2"
        value={client.address2}
        onChange={(e) =>
          setClient({
            ...client,
            address2: e.target.value,
          })
        }/>
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

      <button
        onClick={() =>
          generateQuotePdf({
            quoteNumber,
            quoteTitle,
            quoteAddress,
            quoteData,
            contractor,
            client,
            sections,
          })
        }>Generuj PDF
      </button>
    </div>
  )}