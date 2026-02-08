import React, { useState, useEffect } from "react";
import SwissEPH from "sweph-wasm";

// Definicja planet z ich ID w Swiss Ephemeris
const PLANETS_CONFIG = [
  { name: "Słońce", id: 0 },
  { name: "Księżyc", id: 1 },
  { name: "Merkury", id: 2 },
  { name: "Wenus", id: 3 },
  { name: "Mars", id: 4 },
  { name: "Jowisz", id: 5 },
  { name: "Saturn", id: 6 },
  { name: "Uran", id: 7 },
  { name: "Neptun", id: 8 },
  { name: "Pluton", id: 9 }
];

const zodiacSigns = [
  "Baran", "Byk", "Bliźnięta", "Rak", "Lew", "Panna",
  "Waga", "Skorpion", "Strzelec", "Koziorożec", "Wodnik", "Ryby"
];

/**
 * Konwertuje stopnie (0-360) na format: Znak Stopnie Minuty
 */
function formatDegree(deg) {
  const normalized = deg < 0 ? deg + 360 : deg % 360;
  const signIndex = Math.floor(normalized / 30);
  const sign = zodiacSigns[signIndex];
  const inside = normalized % 30;
  const d = Math.floor(inside);
  const m = Math.floor((inside - d) * 60);
  return `${sign} ${String(d).padStart(2, "0")}° ${String(m).padStart(2, "0")}’`;
}

export default function Kosmogram() {
  const [swe, setSwe] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [birth, setBirth] = useState({
    day: "1",
    month: "1",
    year: "2000",
    hour: "12",
    minute: "00",
    timezone: "1",
    latitude: "50.728",
    longitude: "16.651"
  });
  const [result, setResult] = useState(null);

  // 1. Inicjalizacja biblioteki WASM
  useEffect(() => {
    async function initWasm() {
      try {
        console.log("Inicjalizacja SwissEPH WASM...");
        const instance = await SwissEPH.init();
        setSwe(instance);
        setIsReady(true);
        console.log("SwissEPH gotowy do pracy.");
      } catch (err) {
        console.error("Błąd ładowania biblioteki SwissEPH:", err);
      }
    }
    initWasm();
  }, []);

  const handleChange = (e) => {
    setBirth({ ...birth, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    if (!swe || !isReady) return;

    try {
      // Obliczanie czasu UT
      const ut = Number(birth.hour) + Number(birth.minute) / 60 - Number(birth.timezone);

      // Obliczanie Julian Day
      const jd = swe.swe_julday(
        Number(birth.year),
        Number(birth.month),
        Number(birth.day),
        ut,
        1 // SE_GREG_CAL
      );

      const data = {};
      const flag = 2; // SEFLG_MOSEPH (nie wymaga plików zewnętrznych)

      // Obliczanie pozycji każdej planety
      PLANETS_CONFIG.forEach((planet) => {
        // Ważne: swe_calc_ut zwraca tablicę [long, lat, dist, speed_long, ...]
        const res = swe.swe_calc_ut(jd, planet.id, flag);
        if (res && res.length > 0) {
          data[planet.name] = formatDegree(res[0]);
        }
      });

      // Obliczanie domów (ASC/MC)
      // Używamy String.fromCharCode(80), aby uniknąć błędów typu "charToC"
      const systemPlacidus = String.fromCharCode(80); // 'P'
      const houses = swe.swe_houses(
        jd,
        Number(birth.latitude),
        Number(birth.longitude),
        systemPlacidus
      );

      if (houses && houses.ascmc) {
        data.ASC = formatDegree(houses.ascmc[0]);
        data.MC = formatDegree(houses.ascmc[1]);
      }

      setResult(data);
    } catch (err) {
      console.error("Błąd podczas obliczeń horoskopu:", err);
      alert("Błąd obliczeń. Sprawdź konsolę przeglądarki.");
    }
  };

  return (
    <div style={{ 
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", 
      maxWidth: "500px", 
      margin: "20px auto", 
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Kalkulator Kosmogramu</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Sekcja Daty i Czasu */}
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Data i czas:</div>
          <div style={{ display: "flex", gap: "5px" }}>
            <input name="day" onChange={handleChange} value={birth.day} style={{width: "40px"}} />
            <input name="month" onChange={handleChange} value={birth.month} style={{width: "40px"}} />
            <input name="year" onChange={handleChange} value={birth.year} style={{width: "60px"}} />
            <span> o </span>
            <input name="hour" onChange={handleChange} value={birth.hour} style={{width: "40px"}} />
            <span>:</span>
            <input name="minute" onChange={handleChange} value={birth.minute} style={{width: "40px"}} />
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
            Strefa czasowa (GMT): 
            <input name="timezone" onChange={handleChange} value={birth.timezone} style={{width: "40px", marginLeft: "5px"}} />
          </div>
        </div>

        {/* Sekcja Lokalizacji */}
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Lokalizacja:</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <label>Lat: <input name="latitude" onChange={handleChange} value={birth.latitude} style={{width: "80px"}} /></label>
            <label>Lon: <input name="longitude" onChange={handleChange} value={birth.longitude} style={{width: "80px"}} /></label>
          </div>
        </div>

        <button 
          onClick={calculate} 
          disabled={!isReady}
          style={{
            padding: "12px",
            backgroundColor: isReady ? "#4A90E2" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isReady ? "pointer" : "not-allowed",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {isReady ? "Oblicz pozycje planet" : "Ładowanie biblioteki..."}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "25px", animation: "fadeIn 0.5s" }}>
          <h3 style={{ borderBottom: "2px solid #4A90E2", paddingBottom: "5px" }}>Wyniki (MOSEPH):</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "8px" }}>
            {Object.entries(result).map(([key, val]) => (
              <React.Fragment key={key}>
                <div style={{ fontWeight: "bold", color: "#555" }}>{key}:</div>
                <div style={{ textAlign: "right", paddingRight: "10px" }}>{val}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}