import React, { useState, useEffect } from "react";

console.log("HoroscopeParser.jsx załadowany");

// ======================
// Stopnie początkowe znaków – klucze "normalizowane" (bez polskich znaków, małe litery)
// ======================
const ZODIAC_DEGREES = {
  baranie: 0,
  byku: 30,
  bliznietach: 60,
  raku: 90,
  lwie: 120,
  pannie: 150,
  wadze: 180,
  skorpionie: 210,
  strzelcu: 240,
  koziorozcu: 270,
  wodniku: 300,
  rybach: 330,
};

// ======================
// Funkcja do usuwania polskich znaków i zamiany na małe litery
// ======================
const normalizeSign = (str) =>
  str
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ż/g, "z")
    .replace(/ź/g, "z");

// ======================
const HoroscopeParser = () => {
  const [inputText, setInputText] = useState("");
  const [horoscopeName, setHoroscopeName] = useState("");
  const [savedHoroscopes, setSavedHoroscopes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadHoroscopes();
  }, []);

  // ======================
  // Parsowanie jednej linii
  // ======================
  const parseLine = (line) => {
    // Poprawiony regex: wyciąga planetę przed " w " i znak po "w"
    const match = line.match(/^(.+?)\s+w\s+(\S+)\s+\((\d+)°\s+(\d+)'\)/);
    if (!match) return null;

    const name = match[1];       // np. "Słońce"
    const rawSign = match[2];    // np. "Koziorożcu"
    const degree = Number(match[3]);
    const minute = Number(match[4]);

    const signKey = normalizeSign(rawSign);
    const signDegree = ZODIAC_DEGREES[signKey];

    if (signDegree === undefined) {
      console.error("Nieznany znak:", rawSign);
      return null;
    }

    const signValue = signDegree * 100;
    const degreePart = degree * 100;
    const minutePart = Math.round((minute * 100) / 60);
    const totalValue = signValue + degreePart + minutePart;

    console.log("LICZENIE PLANETY:", {
      name,
      rawSign,
      signKey,
      signDegree,
      signValue,
      degree,
      degreePart,
      minute,
      minutePart,
      totalValue,
    });

    return {
      name,
      sign: rawSign,       // dokładnie jak w tekście
      degreeValue: degree,
      minuteValue: minute,
      signDegree,
      signValue,
      degreePart,
      minutePart,
      totalValue,
    };
  };

  // ======================
  // Zapis horoskopu
  // ======================
  const saveHoroscope = () => {
    if (!horoscopeName.trim()) {
      alert("Podaj nazwę horoskopu");
      return;
    }

    const lines = inputText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const data = lines.map(parseLine).filter(Boolean);

    const horoscope = { name: horoscopeName, data };

    const updated = [...savedHoroscopes, horoscope];
    localStorage.setItem("horoscopes", JSON.stringify(updated));
    setSavedHoroscopes(updated);
    setSelected(horoscope);

    console.log("ZAPISANO HOROSKOP:", horoscope);
  };

  // ======================
  // Wczytywanie horoskopów
  // ======================
  const loadHoroscopes = () => {
    const stored = JSON.parse(localStorage.getItem("horoscopes")) || [];
    setSavedHoroscopes(stored);
    console.log("LOCAL STORAGE:", stored);
  };

  // ======================
  // Usuwanie horoskopu
  // ======================
  const deleteHoroscope = (name) => {
    const filtered = savedHoroscopes.filter((h) => h.name !== name);
    localStorage.setItem("horoscopes", JSON.stringify(filtered));
    setSavedHoroscopes(filtered);
    setSelected(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Parser horoskopu</h2>

      <input
        placeholder="Nazwa horoskopu"
        value={horoscopeName}
        onChange={(e) => setHoroscopeName(e.target.value)}
      />

      <br /><br />

      <textarea
        rows={10}
        cols={70}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Wklej horoskop..."
      />

      <br /><br />

      <button onClick={saveHoroscope}>Zapisz</button>
      <button onClick={loadHoroscopes} style={{ marginLeft: 10 }}>
        Odśwież
      </button>

      <h3>Zapisane horoskopy</h3>
      <ul>
        {savedHoroscopes.map((h, i) => (
          <li key={i}>
            <strong>{h.name}</strong>{" "}
            <button onClick={() => setSelected(h)}>Pokaż</button>{" "}
            <button onClick={() => deleteHoroscope(h.name)}>Usuń</button>
          </li>
        ))}
      </ul>

      {selected && (
        <>
          <h3>{selected.name}</h3>
          <ul>
            {selected.data.map((p, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>{p.name}</strong> — {p.sign}<br />
                znak: {p.signDegree}° → {p.signValue}<br />
                stopnie: {p.degreeValue}° → {p.degreePart}<br />
                minuty: {p.minuteValue}′ → {p.minutePart}<br />
                <strong>SUMA: {p.totalValue}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default HoroscopeParser;
