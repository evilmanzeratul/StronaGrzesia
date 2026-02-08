import React, { useState, useEffect } from "react";

// Aspekty w setkach stopni
const ASPECTS = [
  { name: "Koniunkcja", angle: 0, orb: 300 },
  { name: "Opozycja", angle: 18000, orb: 300 },
  { name: "Trygon", angle: 12000, orb: 300 },
  { name: "Kwadratura", angle: 9000, orb: 300 },
  { name: "Sekstyl", angle: 6000, orb: 300 },
];

// Funkcja licząca różnicę między totalValue w setkach stopni
const diffTotal = (v1, v2) => {
  let diff = Math.abs(v1 - v2) % 36000; // 360° * 100 = 36000
  if (diff > 18000) diff = 36000 - diff; // zamiana >180° na mniejszy kąt
  return diff;
};

// Sprawdza jaki aspekt jest między dwoma planetami
const getAspect = (v1, v2) => {
  const diff = diffTotal(v1, v2);
  for (let asp of ASPECTS) {
    if (Math.abs(diff - asp.angle) <= asp.orb) return asp.name;
  }
  return null;
};

const SynastryAnalyzer = () => {
  const [horoscopes, setHoroscopes] = useState([]);
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);
  const [aspects, setAspects] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("horoscopes")) || [];
    setHoroscopes(stored);
  }, []);

  const calculateAspects = () => {
    if (!selected1 || !selected2) return;

    const aspectsResult = [];

    selected1.data.forEach((p1) => {
      selected2.data.forEach((p2) => {
        const aspect = getAspect(p1.totalValue, p2.totalValue);
        if (aspect) {
          aspectsResult.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect,
          });
        }
      });
    });

    setAspects(aspectsResult);
    console.log("Aspekty partnerskie:", aspectsResult);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Synastria – aspekty partnerskie</h2>

      <div>
        <label>
          Horoskop 1:
          <select
            onChange={(e) =>
              setSelected1(horoscopes.find((h) => h.name === e.target.value))
            }
          >
            <option value="">Wybierz</option>
            {horoscopes.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: 20 }}>
          Horoskop 2:
          <select
            onChange={(e) =>
              setSelected2(horoscopes.find((h) => h.name === e.target.value))
            }
          >
            <option value="">Wybierz</option>
            {horoscopes.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </label>

        <button onClick={calculateAspects} style={{ marginLeft: 10 }}>
          Oblicz aspekty
        </button>
      </div>

      <h3>Wyniki:</h3>
      {aspects.length === 0 && <p>Brak wykrytych aspektów.</p>}
      <ul>
        {aspects.map((a, i) => (
          <li key={i}>
            {a.planet1} ↔ {a.planet2} : <strong>{a.aspect}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SynastryAnalyzer;
