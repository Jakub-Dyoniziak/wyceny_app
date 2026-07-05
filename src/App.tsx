import { useEffect, useState } from "react";
import './styles/App.css';
import './styles/App_tablet.css';
import './styles/App_desktop.css';
import './styles/fonts.css';
import './styles/color_pallet.css';
import { generateQuotePdf } from "./pdf/generateQuotePdf";
import { saveData, loadData } from "./storage/storage";

type QuoteItem = {
  description: string;
  price: string;
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

  const savedData = loadData();

  const [quoteNumber, setQuoteNumber] = useState(
  savedData?.quoteNumber ?? "");

  const [quoteTitle, setQuoteTitle] = useState(
  savedData?.quoteTitle ?? "");

  const [quoteAddress, setQuoteAddress] = useState(
  savedData?.quoteAddress ?? "");

  const [quoteData, setQuoteData] = useState(
  savedData?.quoteData ?? "");

  const [contractor, setContractor] = useState<Contractor>(
  savedData?.contractor ?? {
    name: "Adam Nowak",
    address: "23, Dmowskiego",
    address2: "60-222 Poznan",
    phone: "888192383",
    email: "jakubdyoniziak@gmail.com",
  });

  const [client, setClient] = useState<Client>(
  savedData?.client ?? {
    name: "",
    address: "",
    address2: "",
  });

  const [sections, setSections] = useState<QuoteSection[]>(
  savedData?.sections ?? []
);

  function clearForm() {

    const confirmClear = window.confirm(
      "Czy na pewno rozpocząć nową wycenę? Wszystkie dane bieżącej wyceny zostaną usunięte."
    );

    if (!confirmClear) {
      return;
    }

    setQuoteNumber("");
    setQuoteTitle("");
    setQuoteAddress("");
    setQuoteData("");

    setClient({
      name: "",
      address: "",
      address2: "",
    });

    setSections([]);
  };
  
  const total = sections.reduce(
    (sectionSum, section) =>
      sectionSum + section.items.reduce(
        (itemSum, item) =>
          itemSum + Number(item.price || 0),
        0
      ),
    0
  );

  useEffect(() => {
    saveData({
      quoteNumber,
      quoteTitle,
      quoteAddress,
      quoteData,
      contractor,
      client,
      sections,
    });
  },[
    quoteNumber,
    quoteTitle,
    quoteAddress,
    quoteData,
    contractor,
    client,
    sections,
    ]);
  return (
    <div className="app">
      <div id="logotype">
        <img src="/logo_wyceny.png" alt="logo_aplikacji" id="logo_img"/>
      
        <h1>Generator wycen</h1>
      </div>

      <div id="wycena_form">
        <div className="input_group">
          <input
            id="QuoteNumber"
            value={quoteNumber}
            onChange={(e) => setQuoteNumber(e.target.value)}
            required />

          <label htmlFor="QuoteNumber">Numer wyceny</label>
        </div>

        <div className="input_group">
          <input
            id="QuoteTitle"
            value={quoteTitle}
            onChange={(e) => setQuoteTitle(e.target.value)}
            required />

          <label htmlFor="QuoteTitle">Tytuł wyceny</label>
        </div>

        <div className="input_group">
          <input
          id="QuoteAddress"
          value={quoteAddress}
          onChange={(e) => setQuoteAddress(e.target.value)}
          required />

          <label htmlFor="QuoteAddress">Adres wyceny</label>
        </div>

        <div className="input_group">
          <input
          id="QuoteData"
          value={quoteData}
          onChange={(e) => setQuoteData(e.target.value)}
          required />

          <label htmlFor="QuoteData">Data wyceny</label>
        </div>
      </div>

      <div id="wykonawca_form">

        <h2>Wykonawca</h2>

        <div className="input_group">
          <input 
          id="wyk_name"
          value={contractor.name}
          onChange={(e) =>
            setContractor({
              ...contractor,
              name: e.target.value,
            })}
          required/>

          <label htmlFor="wyk_name">Imię i nazwisko</label>
        </div>

        <div className="input_group">
          <input 
          id="wyk_address_1"
          value={contractor.address}
          onChange={(e) =>
            setContractor({
              ...contractor,
              address: e.target.value,
            })}
          required/>

          <label htmlFor="wyk_address_1">Adres 1</label>
        </div>

        <div className="input_group">
          <input 
          id="wyk_address_2"
          value={contractor.address2}
          onChange={(e) =>
            setContractor({
              ...contractor,
              address2: e.target.value,
            })}
          required/>

          <label htmlFor="wyk_address_2">Adres 2</label>
        </div>

        <div className="input_group">
          <input 
          id="wyk_number"
          value={contractor.phone}
          onChange={(e) =>
            setContractor({
              ...contractor,
              phone: e.target.value,
            })}
          required/>

          <label htmlFor="wyk_number">Numer tel.</label>
        </div>

        <div className="input_group">
          <input 
          id="wyk_email"
          value={contractor.email}
          onChange={(e) =>
            setContractor({
              ...contractor,
              email: e.target.value,
            })}
          required/>

          <label htmlFor="wyk_email">E-mail</label>
        </div>
      </div>

      <div id="klient_form">
        
        <h2>Klient</h2>

        <div className="input_group">
          <input 
          id="kli_name"
          value={client.name}
          onChange={(e) =>
            setClient({
              ...client,
              name: e.target.value,
            })}
          required/>

          <label htmlFor="kli_name">Imie i nazwisko</label>
        </div>

        <div className="input_group">
          <input 
          id="kli_address_1"
          value={client.address}
          onChange={(e) =>
            setClient({
              ...client,
              address: e.target.value,
            })}
          required/>

          <label htmlFor="kli_address_1">Adres 1</label>
        </div>

        <div className="input_group">
          <input 
          id="kli_address_2"
          value={client.address2}
          onChange={(e) =>
            setClient({
              ...client,
              address2: e.target.value,
            })}
          required/>

          <label htmlFor="kli_address_2">Adres 2</label>
        </div>
      </div>

      <div className="section_container">
        <h2>Sekcje wyceny</h2>
        
        {sections.map((section, sectionIndex) => (
          
          <div key={sectionIndex} className="section_card">
            <div className="section_header">
              <h3>
                Sekcja {sectionIndex + 1}
              </h3>

              <button className="button_usuniecie_sekcja"
                onClick={() => {
                  setSections(
                    sections.filter(
                      (_, i) => i !== sectionIndex
                    )
                  );
                }}>Usuń sekcję</button>
            </div>

            <div className="section_group">
              <input
              id="section_name"
              value={section.title}
              onChange={(e) => {
              const updated = [...sections];

              updated[sectionIndex].title = 
                e.target.value;

              setSections(updated);
              }}
              required/>

              <label htmlFor="section_name">Nazwa sekcji</label>
            </div>

              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="item_row">
                  <div className="item_opis">
                    <input
                    id="item_opis_input"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...sections];

                      updated[sectionIndex]
                      .items[itemIndex]
                      .description = e.target.value;

                      setSections(updated);
                    }}
                    required/>

                    <label htmlFor="item_opis_input">Opis</label>
                  </div>

                  <div className="item_cena">
                    <input
                    id="item_cena_input"
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updated = [...sections];

                      updated[sectionIndex]
                        .items[itemIndex]
                        .price = e.target.value;

                      setSections(updated);
                    }}
                    required/>

                    <label htmlFor="item_cena_input">Cena</label>
                  </div>

                  <button className="button_usuniecie_pozycja"
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

              <div className="add_item_button">
                <button className="button_dodanie_pozycja"
                  onClick={() => {
                  const updated = [...sections];

                  updated[sectionIndex].items.push({
                    description: "",
                    price: "",
                  });

                  setSections(updated);
                  }}>Dodaj pozycję
                </button>
              </div>
          </div>
        ))}
      </div>

      <div>
        <button className="button_dodanie_sekcja"
          onClick={() =>
            setSections([
              ...sections,
              {
                title: "",
                items: [],
              },])}> Dodaj sekcję
        </button>
      </div>

      <div id="total">
        <h2>
        Razem: {total.toFixed(2)} €
        </h2>
      </div>

      <div className="przyciski_footer">
        <button className="button_pdf"
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

        <button className="button_nowa_wycena"
          onClick={clearForm}>
            Nowa wycena
        </button>
      </div>
    </div>
  )}