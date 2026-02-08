import React, { useState, useEffect } from "react";

const MAXORB = 600;
const HiGHORB = 200;

const ASPECTS = [
  { name: "Koniunkcja", angle: 0, orb: MAXORB, points: 10, color: "#4caf50", icon: "☌" },
  { name: "Opozycja", angle: 18000, orb: MAXORB, points: -10, color: "#f44336", icon: "☍" },
  { name: "Trygon", angle: 12000, orb: MAXORB, points: 10, color: "#2196f3", icon: "△" },
  { name: "Kwadratura", angle: 9000, orb: MAXORB, points: -10, color: "#ff9800", icon: "□" },
  { name: "Sekstyl", angle: 6000, orb: MAXORB, points: 10, color: "#00bcd4", icon: "✱" },
];

const CAT_MAP = {
  sex: [
    ["Mars", "Wenus"], ["Mars", "Mars"], ["Wenus", "Pluton"], 
    ["Mars", "Pluton"], ["Mars", "Księżyc"], ["Wenus", "Uran"],
    ["Mars", "ASC"], ["Wenus", "ASC"], ["Słońce", "Mars"], ["Pluton", "ASC"]
  ],
  talk: [
    ["Merkury", "Merkury"], ["Merkury", "Słońce"], ["Merkury", "Księżyc"], 
    ["Merkury", "Uran"], ["Słońce", "Uran"], ["Merkury", "Saturn"], 
    ["Merkury", "Pluton"], ["Merkury", "Jowisz"], ["Merkury", "Wenus"],
    ["Merkury", "ASC"], ["Merkury", "MC"], ["Słońce", "MC"]
  ],
  emotions: [
    ["Księżyc", "Księżyc"], ["Księżyc", "Słońce"], ["Księżyc", "Wenus"], 
    ["Księżyc", "Saturn"], ["Wenus", "Saturn"], ["Księżyc", "Neptun"], 
    ["Wenus", "Neptun"], ["Księżyc", "Jowisz"], ["Wenus", "Wenus"],
    ["Słońce", "Wenus"], ["Księżyc", "ASC"], ["Wenus", "MC"], ["Księżyc", "MC"]
  ]
};

const LIGHTS = ["Słońce", "Księżyc"];
const PERSONAL = ["Merkury", "Wenus", "Mars"];
const SOCIAL_OUTER = ["Jowisz", "Saturn", "Uran", "Neptun", "Pluton"];

const getPlanetColor = (name) => {
  if (LIGHTS.includes(name)) return "#d4af37"; 
  if (PERSONAL.includes(name)) return "#e53935"; 
  if (SOCIAL_OUTER.includes(name) && ["Jowisz", "Saturn"].includes(name)) return "#43a047"; 
  if (SOCIAL_OUTER.includes(name)) return "#1e88e5"; 
  return "#757575";
};

const calculateOrbStrength = (diff, aspectAngle) => {
  const x = Math.abs(diff - aspectAngle);
  if (x <= HiGHORB) return 1;
  if (x > MAXORB) return 0;
  return 1 - (x - HiGHORB) / (MAXORB - HiGHORB);
};

const diffTotal = (v1, v2) => {
  let diff = Math.abs(v1 - v2) % 36000;
  if (diff > 18000) diff = 36000 - diff;
  return diff;
};

const SynastryAnalyzer = () => {
  const [horoscopes, setHoroscopes] = useState([]);
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("horoscopes")) || [];
    setHoroscopes(stored);
  }, []);

  const calculateAspects = () => {
    if (!selected1 || !selected2) return;

    let allAspects = [];
    const initStat = () => ({ score: 0, plus: 0, minus: 0, weightSum: 0 });
    const initInfluence = () => ({ sex: 0, talk: 0, emotions: 0, total: 0 });

    let stats = { core: initStat(), outer: initStat(), asc: initStat(), mc: initStat(), sex: initStat(), talk: initStat(), emotions: initStat() };
    let influence = { a_on_b: initInfluence(), b_on_a: initInfluence() };

    const b1 = selected1.data;
    const b2 = selected2.data;
    const isCore = (p) => [...LIGHTS, ...PERSONAL].includes(p);
    
    const checkInCat = (p1, p2, catArray) => catArray.some(pair => (pair[0] === p1 && pair[1] === p2) || (pair[0] === p2 && pair[1] === p1));

    // Zastąp pętle b1 i b2 tym kodem:

b1.forEach(p1 => {
  b2.forEach(p2 => {
    const diff = diffTotal(p1.totalValue, p2.totalValue);
    ASPECTS.forEach(asp => {
      const orbDist = Math.abs(diff - asp.angle);
      if (orbDist <= 600) {
        const strength = calculateOrbStrength(diff, asp.angle);
        const weightedPoints = asp.points * strength;

        // 1. Ogólne statystyki (bez zmian)
        const update = (s) => {
          s.score += weightedPoints;
          s.weightSum += strength;
          if (weightedPoints > 0) s.plus++;
          if (weightedPoints < 0) s.minus++;
        };

        if (isCore(p1.name) && isCore(p2.name)) update(stats.core);
        else if (p1.name === "ASC" || p2.name === "ASC") update(stats.asc);
        else if (p1.name === "MC" || p2.name === "MC") update(stats.mc);
        else update(stats.outer);

        // 2. KATEGORIE I WPŁYW ASYMETRYCZNY
        const categories = Object.keys(CAT_MAP);
        categories.forEach(cat => {
          if (checkInCat(p1.name, p2.name, CAT_MAP[cat])) {
            update(stats[cat]);

            // Kto na kogo? 
            // Sprawdzamy "ważność" planety w tej kategorii
            // Jeśli p1 to Mars (w sex), a p2 to ASC -> Osoba A ma ogromny wpływ na B.
            
            // Definiujemy planety "aktywne" dla kategorii
            const activePlanets = {
              sex: ["Mars", "Pluton", "Słońce"],
              talk: ["Merkury", "Uran", "Jowisz"],
              emotions: ["Księżyc", "Wenus", "Neptun"]
            };

            let weightA = 1;
            let weightB = 1;

            if (activePlanets[cat]?.includes(p1.name)) weightA = 1.5;
            if (activePlanets[cat]?.includes(p2.name)) weightB = 1.5;
            if (["ASC", "MC"].includes(p1.name)) weightA = 0.5;
            if (["ASC", "MC"].includes(p2.name)) weightB = 0.5;

            influence.a_on_b[cat] += weightedPoints * weightA;
            influence.b_on_a[cat] += weightedPoints * weightB;
          }
        });

        allAspects.push({
          p1Name: p1.name, p2Name: p2.name, aspect: asp.name, icon: asp.icon,
          orb: (orbDist / 100).toFixed(2), strength, points: weightedPoints,
          color: asp.color, isCorePair: isCore(p1.name) && isCore(p2.name)
        });
      }
    });
  });
});
    setResults({ aspects: allAspects, stats, influence });
  };

  const InfluenceBar = ({ label, valA, valB, color }) => {
    const total = Math.abs(valA) + Math.abs(valB) || 1;
    const percA = Math.max(10, (Math.abs(valA) / total) * 100);
    return (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                <span>{selected1?.name}: {valA.toFixed(1)}</span>
                <span style={{ color: '#888' }}>{label}</span>
                <span>{selected2?.name}: {valB.toFixed(1)}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: `${percA}%`, backgroundColor: color, borderRight: '2px solid #fff' }} />
                <div style={{ flex: 1, backgroundColor: color, opacity: 0.3 }} />
            </div>
        </div>
    );
  };

  const renderMiniStat = (stat) => (
    <div style={{ fontSize: '12px', marginTop: '10px', color: '#666', borderTop: '1px solid #eee', paddingTop: '8px' }}>
      <div>Poz: <strong>{stat.plus}</strong> | Neg: <strong>{stat.minus}</strong></div>
      <div style={{ marginTop: '3px' }}>
        Średnia: <strong>{stat.weightSum > 0 ? (stat.score / stat.weightSum).toFixed(2) : "0.00"}</strong>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Analiza Synastrii</h2>
      <p style={styles.info}>Kalkulator oddziaływania energii między planetami. </p>
      <p style={styles.info}>jak nie widać zapisanych osób odświerz stronę </p>

      <div style={styles.selectors}>
        <div style={styles.selectGroup}>
          <label style={styles.label}>Osoba A:</label>
          <select style={styles.select} onChange={e => setSelected1(horoscopes.find(h => h.name === e.target.value))}>
            <option value="">Wybierz...</option>
            {horoscopes.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
          </select>
        </div>
        <div style={styles.selectGroup}>
          <label style={styles.label}>Osoba B:</label>
          <select style={styles.select} onChange={e => setSelected2(horoscopes.find(h => h.name === e.target.value))}>
            <option value="">Wybierz...</option>
            {horoscopes.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
          </select>
        </div>
        <button style={styles.button} onClick={calculateAspects}>Analizuj</button>
      </div>

      {results && (
        <div style={styles.resultsContainer}>
          
          {/* SEKCJA WPŁYWU OSOBISTEGO */}
          <div style={{ ...styles.mainScoreCard, backgroundColor: '#fdfdfd', textAlign: 'left' }}>
            <h3 style={{ ...styles.sectionHeading, marginBottom: '25px' }}>⚖️ Balans Wpływu (Kto na kogo działa)</h3>
            <InfluenceBar label="CHEMIA / ŁUŻKO" valA={results.influence.a_on_b.sex} valB={results.influence.b_on_a.sex} color="#e91e63" />
            <InfluenceBar label="MENTAL / ROZMOWA" valA={results.influence.a_on_b.talk} valB={results.influence.b_on_a.talk} color="#2196f3" />
            <InfluenceBar label="EMOCJE / WIĘŹ" valA={results.influence.a_on_b.emotions} valB={results.influence.b_on_a.emotions} color="#4caf50" />
            <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>* Wyższa wartość oznacza osobę, która bardziej "wnosi" daną energię do związku.</p>
          </div>

          <div style={styles.mainScoreCard}>
            <span style={styles.cardLabel}>Wynik Core (Światła + Osobiste)</span>
            <span style={styles.cardValue}>{results.stats.core.score.toFixed(1)}</span>
            <small style={{color: '#888'}}>Główne spoiwo relacji - jeśli tu jest nisko, reszta może nie wystarczyć.</small>
            {renderMiniStat(results.stats.core)}
          </div>

          <h3 style={styles.sectionHeading}>Potencjał Relacji</h3>
          <div style={{ ...styles.secondaryGrid, marginBottom: '30px' }}>
            <div style={{ ...styles.miniCard, borderTop: '4px solid #e91e63' }}>
              <span style={styles.miniLabel}>🔥 ŁÓŻKO / CHEMIA</span>
              <strong style={styles.miniValue}>{results.stats.sex.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.sex)}
            </div>
            <div style={{ ...styles.miniCard, borderTop: '4px solid #2196f3' }}>
              <span style={styles.miniLabel}>🗣️ ROZMOWA / MENTAL</span>
              <strong style={styles.miniValue}>{results.stats.talk.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.talk)}
            </div>
            <div style={{ ...styles.miniCard, borderTop: '4px solid #4caf50' }}>
              <span style={styles.miniLabel}>💗 EMOCJE / WIĘŹ</span>
              <strong style={styles.miniValue}>{results.stats.emotions.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.emotions)}
            </div>
          </div>

          <h3 style={styles.sectionHeading}>Fundamenty</h3>
          <div style={styles.secondaryGrid}>
            <div style={styles.miniCard}>
              <span style={styles.miniLabel}>PRZYSZŁOŚĆ / ROZWÓJ</span>
              <strong style={styles.miniValue}>{results.stats.outer.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.outer)}
            </div>
            <div style={styles.miniCard}>
              <span style={styles.miniLabel}>START / KONTAKT (ASC)</span>
              <strong style={styles.miniValue}>{results.stats.asc.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.asc)}
            </div>
            <div style={styles.miniCard}>
              <span style={styles.miniLabel}>CELE / STATUS (MC)</span>
              <strong style={styles.miniValue}>{results.stats.mc.score.toFixed(1)}</strong>
              {renderMiniStat(results.stats.mc)}
            </div>
          </div>

          <h4 style={styles.listTitle}>Analiza szczegółowa:</h4>
          <div style={styles.aspectList}>
            {results.aspects.sort((a, b) => b.isCorePair - a.isCorePair).map((a, i) => (
              <div key={i} style={{
                ...styles.aspectItem,
                borderLeft: `5px solid ${a.color}`,
                backgroundColor: a.isCorePair ? "#fff9fa" : "#fff",
              }}>
                <div style={{ flex: 1.5 }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    <span style={{ color: getPlanetColor(a.p1Name) }}>{a.p1Name}</span>
                    <span style={{ margin: '0 8px', color: '#ccc' }}>↔</span>
                    <span style={{ color: getPlanetColor(a.p2Name) }}>{a.p2Name}</span>
                  </div>
                  {a.isCorePair && <span style={styles.coreBadge}>Osobiste</span>}
                </div>

                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{ color: a.color, fontWeight: 'bold', fontSize: '14px' }}>{a.icon} {a.aspect}</span>
                  <div style={{ fontSize: '11px', color: '#999' }}>Orb: {a.orb}°</div>
                </div>

                <div style={{ flex: 0.8, textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: a.points >= 0 ? '#4caf50' : '#f44336' }}>
                  {a.points > 0 ? `+${a.points.toFixed(1)}` : a.points.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ... (style pozostają te same, dodałem tylko style do InfluenceBar wewnątrz komponentu)
const styles = {
    container: { padding: '40px 20px', fontFamily: "'Inter', 'Segoe UI', sans-serif", maxWidth: '850px', margin: '0 auto', backgroundColor: '#fcfcfc', color: '#333' },
    title: { textAlign: 'center', color: '#1a237e', marginBottom: '10px', fontSize: '28px', fontWeight: '800' },
    info: { textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '30px' },
    selectors: { display: 'flex', gap: '15px', marginBottom: '40px', padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', alignItems: 'flex-end' },
    selectGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    label: { fontSize: '12px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '14px', outline: 'none' },
    button: { padding: '12px 30px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    mainScoreCard: { padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee', marginBottom: '30px', textAlign: 'center' },
    cardLabel: { fontSize: '12px', textTransform: 'uppercase', color: '#777', fontWeight: 'bold', display: 'block' },
    cardValue: { fontSize: '54px', fontWeight: '900', color: '#1a237e', margin: '10px 0', display: 'block' },
    sectionHeading: { fontSize: '14px', color: '#1a237e', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' },
    secondaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    miniCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid #eee' },
    miniLabel: { fontSize: '10px', fontWeight: 'bold', color: '#888', display: 'block', marginBottom: '10px', minHeight: '30px' },
    miniValue: { fontSize: '28px', color: '#333', fontWeight: '800' },
    listTitle: { marginTop: '40px', marginBottom: '20px', color: '#1a237e', borderBottom: '2px solid #eee', paddingBottom: '10px' },
    aspectList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    aspectItem: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderRadius: '12px', alignItems: 'center', border: '1px solid #f0f0f0' },
    coreBadge: { fontSize: '9px', backgroundColor: '#e91e63', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '5px', display: 'inline-block' }
  };

export default SynastryAnalyzer;