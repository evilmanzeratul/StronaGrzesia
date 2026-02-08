import React, { useState, useEffect } from "react";
import SwissEPH from "sweph-wasm";

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
  { name: "Pluton", id: 9 },
];

const ZODIAC = [
  "Baran", "Byk", "Bliźnięta", "Rak", "Lew", "Panna",
  "Waga", "Skorpion", "Strzelec", "Koziorożec", "Wodnik", "Ryby"
];

const POLISH_CITIES = [
  { name: "Warszawa", latitude: 52.2297, longitude: 21.0122 },
  { name: "Kraków", latitude: 50.0647, longitude: 19.9450 },
  { name: "Łódź", latitude: 51.7592, longitude: 19.4560 },
  { name: "Wrocław", latitude: 51.1079, longitude: 17.0385 },
  { name: "Poznań", latitude: 52.4064, longitude: 16.9252 },
  { name: "Gdańsk", latitude: 54.3520, longitude: 18.6466 },
  { name: "Szczecin", latitude: 53.4285, longitude: 14.5528 },
  { name: "Bydgoszcz", latitude: 53.1235, longitude: 18.0084 },
  { name: "Lublin", latitude: 51.2465, longitude: 22.5684 },
  { name: "Białystok", latitude: 53.1324, longitude: 23.1688 },
  { name: "Katowice", latitude: 50.2649, longitude: 19.0238 },
  { name: "Gdynia", latitude: 54.5189, longitude: 18.5305 },
  { name: "Częstochowa", latitude: 50.8118, longitude: 19.1203 },
  { name: "Radom", latitude: 51.4027, longitude: 21.1471 },
  { name: "Sosnowiec", latitude: 50.2863, longitude: 19.1044 },
  { name: "Toruń", latitude: 53.0138, longitude: 18.5984 },
  { name: "Kielce", latitude: 50.8661, longitude: 20.6286 },
  { name: "Rzeszów", latitude: 50.0413, longitude: 21.9990 },
  { name: "Gliwice", latitude: 50.2945, longitude: 18.6714 },
  { name: "Zabrze", latitude: 50.3240, longitude: 18.7858 },
  { name: "Olsztyn", latitude: 53.7784, longitude: 20.4801 },
  { name: "Bielsko-Biała", latitude: 49.8221, longitude: 19.0449 },
  { name: "Bytom", latitude: 50.3484, longitude: 18.9325 },
  { name: "Rybnik", latitude: 50.1000, longitude: 18.5500 },
  { name: "Ruda Śląska", latitude: 50.2740, longitude: 18.8566 },
  { name: "Tychy", latitude: 50.1520, longitude: 18.9742 },
  { name: "Gorzów Wielkopolski", latitude: 52.7368, longitude: 15.2288 },
  { name: "Dąbrowa Górnicza", latitude: 50.3333, longitude: 19.2500 },
  { name: "Płock", latitude: 52.5468, longitude: 19.7064 },
  { name: "Elbląg", latitude: 54.1522, longitude: 19.4088 },
  { name: "Opole", latitude: 50.6751, longitude: 17.9213 },
  { name: "Wałbrzych", latitude: 50.7714, longitude: 16.2843 },
  { name: "Zielona Góra", latitude: 51.9355, longitude: 15.5064 },
  { name: "Tarnów", latitude: 50.0121, longitude: 20.9867 },
  { name: "Chorzów", latitude: 50.3000, longitude: 18.9500 },
  { name: "Koszalin", latitude: 54.1944, longitude: 16.1722 },
  { name: "Kalisz", latitude: 51.7611, longitude: 18.0917 },
  { name: "Legnica", latitude: 51.2100, longitude: 16.1550 },
  { name: "Grudziądz", latitude: 53.4842, longitude: 18.7532 },
  { name: "Jaworzno", latitude: 50.2045, longitude: 19.2740 },
  { name: "Słupsk", latitude: 54.4641, longitude: 17.0287 },
  { name: "Jastrzębie-Zdrój", latitude: 49.9500, longitude: 18.5833 },
  { name: "Nowy Sącz", latitude: 49.6217, longitude: 20.6971 },
  { name: "Jelenia Góra", latitude: 50.9044, longitude: 15.7275 },
  { name: "Siedlce", latitude: 52.1670, longitude: 22.2900 },
  { name: "Mysłowice", latitude: 50.2415, longitude: 19.1350 },
  { name: "Konin", latitude: 52.2234, longitude: 18.2511 },
  { name: "Piła", latitude: 53.1511, longitude: 16.7378 },
  { name: "Piotrków Trybunalski", latitude: 51.4052, longitude: 19.7032 },
  { name: "Inowrocław", latitude: 52.7981, longitude: 18.2611 },
  { name: "Lubin", latitude: 51.3964, longitude: 16.2000 },
  { name: "Ostrów Wielkopolski", latitude: 51.6483, longitude: 17.8117 },
  { name: "Suwałki", latitude: 54.1119, longitude: 22.9308 },
  { name: "Stargard", latitude: 53.3386, longitude: 15.0447 },
  { name: "Gniezno", latitude: 52.5342, longitude: 17.6008 },
  { name: "Ostrowiec Świętokrzyski", latitude: 50.9297, longitude: 21.3853 },
  { name: "Siemianowice Śląskie", latitude: 50.3014, longitude: 19.0353 },
  { name: "Głogów", latitude: 51.6636, longitude: 16.0844 },
  { name: "Pabianice", latitude: 51.6643, longitude: 19.3540 },
  { name: "Leszno", latitude: 51.8403, longitude: 16.5749 },
  { name: "Żory", latitude: 50.0450, longitude: 18.6920 },
  { name: "Zamość", latitude: 50.7174, longitude: 23.2520 },
  { name: "Pruszków", latitude: 52.1700, longitude: 20.8100 },
  { name: "Łomża", latitude: 53.1781, longitude: 22.0594 },
  { name: "Ełk", latitude: 53.8283, longitude: 22.3592 },
  { name: "Tarnowskie Góry", latitude: 50.4439, longitude: 18.8564 },
  { name: "Tomaszów Mazowiecki", latitude: 51.5225, longitude: 20.0078 },
  { name: "Chełm", latitude: 51.1431, longitude: 23.4718 },
  { name: "Mielec", latitude: 50.2903, longitude: 21.4236 },
  { name: "Kędzierzyn-Koźle", latitude: 50.3472, longitude: 18.2000 },
  { name: "Przemyśl", latitude: 49.7833, longitude: 22.7833 },
  { name: "Stalowa Wola", latitude: 50.5786, longitude: 22.0536 },
  { name: "Tczew", latitude: 54.0875, longitude: 18.7850 },
  { name: "Biała Podlaska", latitude: 52.0333, longitude: 23.1167 },
  { name: "Bełchatów", latitude: 51.3686, longitude: 19.3567 },
  { name: "Świdnica", latitude: 50.8420, longitude: 16.4880 },
  { name: "Będzin", latitude: 50.3253, longitude: 19.1294 },
  { name: "Zgierz", latitude: 51.8550, longitude: 19.4060 },
  { name: "Piekary Śląskie", latitude: 50.3610, longitude: 18.9757 },
  { name: "Racibórz", latitude: 50.0919, longitude: 18.2192 },
  { name: "Legionowo", latitude: 52.4000, longitude: 20.9333 },
  { name: "Ostrołęka", latitude: 53.0845, longitude: 21.5758 },
  { name: "Świętochłowice", latitude: 50.2922, longitude: 18.9197 },
  { name: "Zawiercie", latitude: 50.4878, longitude: 19.4167 },
  { name: "Wejherowo", latitude: 54.6000, longitude: 18.2333 },
  { name: "Starogard Gdański", latitude: 53.9633, longitude: 18.5267 },
  { name: "Wodzisław Śląski", latitude: 50.0000, longitude: 18.4667 },
  { name: "Puławy", latitude: 51.4167, longitude: 21.9667 },
  { name: "Skierniewice", latitude: 51.9556, longitude: 20.1444 },
  { name: "Starachowice", latitude: 51.0369, longitude: 21.0732 },
  { name: "Tarnobrzeg", latitude: 50.5667, longitude: 21.6833 },
  { name: "Krosno", latitude: 49.6833, longitude: 21.7500 },
  { name: "Kołobrzeg", latitude: 54.1750, longitude: 15.5830 },
  { name: "Dębica", latitude: 50.0500, longitude: 21.7667 },
  { name: "Kutno", latitude: 52.2333, longitude: 19.3667 },
  { name: "Nysa", latitude: 50.4750, longitude: 17.3333 },
  { name: "Ciechanów", latitude: 52.8833, longitude: 20.6167 },
  { name: "Otwock", latitude: 52.1000, longitude: 21.2667 },
  { name: "Sieradz", latitude: 51.5964, longitude: 18.7303 },
  { name: "Zduńska Wola", latitude: 51.6000, longitude: 18.9333 },
  { name: "Świnoujście", latitude: 53.9167, longitude: 14.2500 },
  { name: "Żyrardów", latitude: 52.0500, longitude: 20.4333 },
  { name: "Bolesławiec", latitude: 51.2667, longitude: 15.5667 },
  { name: "Nowa Sól", latitude: 51.8000, longitude: 15.7167 },
  { name: "Knurów", latitude: 50.2167, longitude: 18.6500 },
  { name: "Malbork", latitude: 54.0333, longitude: 19.0333 },
  { name: "Sanok", latitude: 49.5608, longitude: 22.2036 },
  { name: "Jarosław", latitude: 50.0167, longitude: 22.6833 },
  { name: "Kwidzyn", latitude: 53.7333, longitude: 18.9333 },
  { name: "Chojnice", latitude: 53.7000, longitude: 17.5500 },
  { name: "Oświęcim", latitude: 50.0340, longitude: 19.2050 },
  { name: "Oleśnica", latitude: 51.2167, longitude: 17.3833 },
  { name: "Brzeg", latitude: 50.8667, longitude: 17.4667 },
  { name: "Dzierżoniów", latitude: 50.7285, longitude: 16.6494 },
  { name: "Cieszyn", latitude: 49.7513, longitude: 18.6321 },
  { name: "Czechowice-Dziedzice", latitude: 49.9135, longitude: 19.0048 },
  { name: "Iława", latitude: 53.5962, longitude: 19.5656 },
  { name: "Augustów", latitude: 53.8433, longitude: 22.9794 },
  { name: "Zgorzelec", latitude: 51.1500, longitude: 15.0083 },
  { name: "Grodzisk Mazowiecki", latitude: 52.1039, longitude: 20.6331 },
  { name: "Piaseczno", latitude: 52.0733, longitude: 21.0275 },
  { name: "Ostróda", latitude: 53.7039, longitude: 19.9644 },
  { name: "Lębork", latitude: 54.5392, longitude: 17.7503 },
  { name: "Sopot", latitude: 54.4414, longitude: 18.5601 },
  { name: "Police", latitude: 53.5521, longitude: 14.5714 },
  { name: "Krotoszyn", latitude: 51.6931, longitude: 17.4367 },
  { name: "Września", latitude: 52.3239, longitude: 17.5651 },
  { name: "Bielsk Podlaski", latitude: 52.7661, longitude: 23.1878 },
  { name: "Brodnica", latitude: 53.2592, longitude: 19.3958 },
  { name: "Łowicz", latitude: 52.1075, longitude: 19.9469 },
  { name: "Kętrzyn", latitude: 54.0736, longitude: 21.3739 },
  { name: "Czerwionka-Leszczyny", latitude: 50.1500, longitude: 18.6833 },
  { name: "Kłodzko", latitude: 50.4381, longitude: 16.6547 },
  { name: "Żary", latitude: 51.6421, longitude: 15.1378 },
  { name: "Biała Rawska", latitude: 51.8075, longitude: 20.4722 },
  { name: "Działdowo", latitude: 53.2356, longitude: 20.1772 },
  { name: "Biłgoraj", latitude: 50.5408, longitude: 22.7214 },
  { name: "Szczecinek", latitude: 53.7075, longitude: 16.6992 },
  { name: "Śrem", latitude: 52.0886, longitude: 17.0150 },
  { name: "Kluczbork", latitude: 50.9725, longitude: 18.2192 },
  { name: "Jawor", latitude: 51.0506, longitude: 16.1936 },
  { name: "Wieluń", latitude: 51.2203, longitude: 18.5703 },
  { name: "Lubartów", latitude: 51.4625, longitude: 22.6078 },
  { name: "Skawina", latitude: 49.9753, longitude: 19.8278 },
  { name: "Kościan", latitude: 52.0833, longitude: 16.6500 },
  { name: "Wieliczka", latitude: 49.9875, longitude: 20.0647 },
  { name: "Świecie", latitude: 53.4097, longitude: 18.4472 },
  { name: "Sandomierz", latitude: 50.6822, longitude: 21.7489 },
  { name: "Mława", latitude: 53.1114, longitude: 20.3814 },
  { name: "Jasło", latitude: 49.7450, longitude: 21.4725 },
  { name: "Olkusz", latitude: 50.2786, longitude: 19.5583 },
  { name: "Nowy Tomyśl", latitude: 52.3167, longitude: 16.1333 },
  { name: "Bieruń", latitude: 50.0881, longitude: 19.0911 },
  { name: "Pszczyna", latitude: 49.9778, longitude: 18.9419 },
  { name: "Kraśnik", latitude: 50.9239, longitude: 22.2217 },
  { name: "Końskie", latitude: 51.1894, longitude: 20.4078 },
  { name: "Grajewo", latitude: 53.6472, longitude: 22.4550 },
  { name: "Środa Wielkopolska", latitude: 52.2294, longitude: 17.2750 },
  { name: "Łaziska Górne", latitude: 50.1500, longitude: 18.8500 },
  { name: "Płońsk", latitude: 52.6230, longitude: 20.3750 },
  { name: "Rawicz", latitude: 51.6094, longitude: 16.8586 },
  { name: "Żagań", latitude: 51.6167, longitude: 15.3167 },
  { name: "Opoczno", latitude: 51.3775, longitude: 20.2861 },
  { name: "Lubań", latitude: 51.1167, longitude: 15.2833 },
  { name: "Lubliniec", latitude: 50.6686, longitude: 18.6833 },
  { name: "Grodzisk Wielkopolski", latitude: 52.2272, longitude: 16.3653 },
  { name: "Mrągowo", latitude: 53.8644, longitude: 21.3056 },
  { name: "Radomska", latitude: 51.0667, longitude: 19.4444 },
  { name: "Rypin", latitude: 53.0667, longitude: 19.4000 },
  { name: "Złotów", latitude: 53.3614, longitude: 17.0400 },
  { name: "Hajnówka", latitude: 52.7433, longitude: 23.5811 },
  { name: "Kozienice", latitude: 51.5833, longitude: 21.5500 },
  { name: "Pionki", latitude: 51.4833, longitude: 21.4500 },
  { name: "Gostynin", latitude: 52.4292, longitude: 19.4625 },
  { name: "Sierpc", latitude: 52.8533, longitude: 19.6667 },
  { name: "Turem", latitude: 52.0167, longitude: 18.5000 },
  { name: "Wągrowiec", latitude: 52.8081, longitude: 17.2006 },
  { name: "Gostyń", latitude: 51.8833, longitude: 17.0167 },
  { name: "Przasnysz", latitude: 53.0167, longitude: 20.8833 },
  { name: "Sokołów Podlaski", latitude: 52.4042, longitude: 22.2472 },
  { name: "Sochaczew", latitude: 52.2289, longitude: 20.2389 },
  { name: "Sulejówek", latitude: 52.2333, longitude: 21.2833 },
  { name: "Józefów", latitude: 52.1333, longitude: 21.2333 },
  { name: "Kobyłka", latitude: 52.3333, longitude: 21.2000 },
  { name: "Zielonka", latitude: 52.3044, longitude: 21.1611 },
  { name: "Marki", latitude: 52.3333, longitude: 21.1000 },
  { name: "Ząbki", latitude: 52.2922, longitude: 21.1122 },
  { name: "Konstancin-Jeziorna", latitude: 52.0833, longitude: 21.1167 },
  { name: "Milanówek", latitude: 52.1167, longitude: 20.6667 },
  { name: "Łomianki", latitude: 52.3333, longitude: 20.8833 },
  { name: "Grójec", latitude: 51.8647, longitude: 20.8653 },
  { name: "Busko-Zdrój", latitude: 50.4692, longitude: 20.7189 },
  { name: "Jędrzejów", latitude: 50.6406, longitude: 20.3042 },
  { name: "Staszów", latitude: 50.5639, longitude: 21.1692 },
  { name: "Pińczów", latitude: 50.5206, longitude: 20.5214 },
  { name: "Skarżysko-Kamienna", latitude: 51.1161, longitude: 20.8717 },
  { name: "Bochnia", latitude: 49.9689, longitude: 20.4303 },
  { name: "Gorlice", latitude: 49.6550, longitude: 21.1560 },
  { name: "Zakopane", latitude: 49.2992, longitude: 19.9494 },
  { name: "Andrychów", latitude: 49.8544, longitude: 19.3361 },
  { name: "Trzebinia", latitude: 50.1594, longitude: 19.4706 },
  { name: "Libiąż", latitude: 50.1039, longitude: 19.3147 },
  { name: "Brzesko", latitude: 49.9692, longitude: 20.6061 },
  { name: "Myślenice", latitude: 49.8328, longitude: 19.9408 },
  { name: "Wadowice", latitude: 49.8831, longitude: 19.4939 },
  { name: "Kęty", latitude: 49.8767, longitude: 19.2222 },
  { name: "Ustroń", latitude: 49.7214, longitude: 18.8025 },
  { name: "Wisła", latitude: 49.6558, longitude: 18.8594 },
  { name: "Skoczów", latitude: 49.8000, longitude: 18.7889 },
  { name: "Gryfino", latitude: 53.2536, longitude: 14.4883 },
  { name: "Świdwin", latitude: 53.7747, longitude: 15.7761 },
  { name: "Barlinek", latitude: 52.9903, longitude: 15.2039 },
  { name: "Dębno", latitude: 52.7317, longitude: 14.6983 }
];

function degToParts(deg) {
  const norm = (deg + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC[signIndex];
  const inside = norm % 30;
  const degree = Math.floor(inside);
  const minute = Math.floor((inside - degree) * 60);
  return { sign, signIndex, degree, minute };
}

function buildNumericStructure(name, deg) {
  const { sign, signIndex, degree, minute } = degToParts(deg);
  const totalValue = Math.round(signIndex * 3000 + degree * 100 + (minute * 100) / 60);
  return { name, sign, degreeValue: degree, minuteValue: minute, totalValue };
}

function getCityName(lat, lon) {
  const city = POLISH_CITIES.find(c => Math.abs(c.latitude - Number(lat)) < 0.001 && Math.abs(c.longitude - Number(lon)) < 0.001);
  return city ? city.name : "Współrzędne własne";
}

export default function KosmogramFull() {
  const [swe, setSwe] = useState(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState({
    day: "1", month: "1", year: "1990",
    hour: "12", minute: "00", timezone: "1",
    latitude: "52.2297", longitude: "21.0122",
  });
  
  const [cityFilter, setCityFilter] = useState("");
  const [result, setResult] = useState(null);
  const [savedHoroscopes, setSavedHoroscopes] = useState([]);

  useEffect(() => {
    SwissEPH.init().then(inst => { setSwe(inst); setReady(true); });
    const saved = localStorage.getItem("horoscopes");
    if (saved) setSavedHoroscopes(JSON.parse(saved));
  }, []);

  const handleChange = e => setBirth({ ...birth, [e.target.name]: e.target.value });

  const handleCitySelect = e => {
    const selectedCityName = e.target.value;
    if (!selectedCityName) return;
    const city = POLISH_CITIES.find(c => c.name === selectedCityName);
    if (city) {
      setBirth({ ...birth, latitude: city.latitude.toString(), longitude: city.longitude.toString() });
      setCityFilter(city.name);
    }
  };

  const calculateAndSave = () => {
    if (!ready || !name.trim()) { alert("Podaj nazwę kosmogramu"); return; }
    const ut = Number(birth.hour) + Number(birth.minute) / 60 - Number(birth.timezone);
    const jd = swe.swe_julday(Number(birth.year), Number(birth.month), Number(birth.day), ut, 1);
    const flag = 2; 
    const data = [];

    PLANETS_CONFIG.forEach(p => {
      const res = swe.swe_calc_ut(jd, p.id, flag);
      if (res?.length) data.push(buildNumericStructure(p.name, res[0]));
    });

    const houses = swe.swe_houses(jd, Number(birth.latitude), Number(birth.longitude), "P");
    if (houses?.ascmc) {
      data.push(buildNumericStructure("ASC", houses.ascmc[0]));
      data.push(buildNumericStructure("MC", houses.ascmc[1]));
    }

    const horoscope = { name, data, cityName: getCityName(birth.latitude, birth.longitude), birthData: { ...birth } };
    const updated = [...savedHoroscopes, horoscope];
    localStorage.setItem("horoscopes", JSON.stringify(updated));
    setSavedHoroscopes(updated);
    setResult(horoscope);
  };

  const deleteHoroscope = nameToDel => {
    const filtered = savedHoroscopes.filter(h => h.name !== nameToDel);
    localStorage.setItem("horoscopes", JSON.stringify(filtered));
    setSavedHoroscopes(filtered);
    if (result?.name === nameToDel) setResult(null);
  };

  const filteredCities = POLISH_CITIES.filter(c => c.name.toLowerCase().includes(cityFilter.toLowerCase()));

  const styles = {
    container: { padding: "30px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f4f7f6", borderRadius: "15px" },
    header: { textAlign: "center", color: "#1a237e", borderBottom: "3px solid #e91e63", paddingBottom: "10px", marginBottom: "30px" },
    section: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "20px" },
    input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "1rem" },
    button: { padding: "15px", background: "linear-gradient(135deg, #e91e63, #c2185b)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%", fontSize: "1rem" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "20px" },
    planetCard: { padding: "15px", backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    list: { listStyle: "none", padding: 0 },
    listItem: { padding: "12px", backgroundColor: "#fff", marginBottom: "8px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" },
    geoBox: { background: "#e8eaed", padding: "15px", borderRadius: "10px", marginTop: "10px", border: "1px dashed #999" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Generator Kosmogramu</h2>

      <section style={styles.section}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input placeholder="Imię i nazwisko" value={name} onChange={e => setName(e.target.value)} style={styles.input} />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              <input name="day" placeholder="DD" value={birth.day} onChange={handleChange} style={{ ...styles.input, width: "55px" }} />
              <input name="month" placeholder="MM" value={birth.month} onChange={handleChange} style={{ ...styles.input, width: "55px" }} />
              <input name="year" placeholder="RRRR" value={birth.year} onChange={handleChange} style={{ ...styles.input, width: "85px" }} />
            </div>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>Czas:</span>
              <input name="hour" value={birth.hour} onChange={handleChange} style={{ ...styles.input, width: "55px" }} />
              <input name="minute" value={birth.minute} onChange={handleChange} style={{ ...styles.input, width: "55px" }} />
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>GMT:</span>
              <input name="timezone" value={birth.timezone} onChange={handleChange} style={{ ...styles.input, width: "55px" }} />
            </div>
          </div>

          <div style={{ backgroundColor: "#f0f2f5", padding: "20px", borderRadius: "10px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Lokalizacja Urodzenia:</label>
            <input 
              placeholder="Wpisz miasto aby przefiltrować..." 
              value={cityFilter} 
              onChange={e => setCityFilter(e.target.value)} 
              style={{ ...styles.input, width: "100%", marginBottom: "10px", boxSizing: "border-box" }}
            />
            <select onChange={handleCitySelect} value="" style={{ ...styles.input, width: "100%", boxSizing: "border-box" }}>
              <option value="">-- Wybierz miasto z listy ({filteredCities.length}) --</option>
              {filteredCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>

            <div style={styles.geoBox}>
              <div style={{ marginBottom: "5px", fontSize: "0.9rem", color: "#444" }}>
                <strong>Współrzędne geograficzne:</strong> (edytuj ręcznie jeśli brak miasta)
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                 <div style={{ flex: 1 }}>
                   <small>Szerokość (Latitude):</small>
                   <input name="latitude" value={birth.latitude} onChange={handleChange} style={{ ...styles.input, width: "100%", marginTop: "5px" }} />
                 </div>
                 <div style={{ flex: 1 }}>
                   <small>Długość (Longitude):</small>
                   <input name="longitude" value={birth.longitude} onChange={handleChange} style={{ ...styles.input, width: "100%", marginTop: "5px" }} />
                 </div>
              </div>
            </div>
          </div>

          <button onClick={calculateAndSave} disabled={!ready} style={styles.button}>
            {ready ? "GENERUJ I ZAPISZ KOSMOGRAM W PAMIĘCI PODRECZNEJ PRZEGLĄDARKI" : "ŁADOWANIE SWISSEPH..."}
          </button>
        </div>
      </section>

      {savedHoroscopes.length > 0 && (
        <section style={styles.section}>
          <h3 style={{ color: "#1a237e", marginTop: 0 }}>Zapisane w pamięci lokalnej</h3>
          <ul style={styles.list}>
            {savedHoroscopes.map((h, i) => (
              <li key={i} style={styles.listItem}>
                <span><strong>{h.name}</strong> <small style={{ color: "#666" }}>({h.cityName})</small></span>
                <div>
                  <button onClick={() => setResult(h)} style={{ marginRight: "8px", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", border: "1px solid #ccc", background: "#fdfdfd" }}>Pokaż dane</button>
                  <button onClick={() => deleteHoroscope(h.name)} style={{ color: "#e91e63", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>Usuń</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result && (
        <section style={{ ...styles.section, borderTop: "5px solid #1a237e" }}>
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h2 style={{ margin: 0, color: "#1a237e" }}>{result.name}</h2>
            <div style={{ color: "#666", marginTop: "10px", fontSize: "1.1rem" }}>
              {result.birthData.day}.{result.birthData.month}.{result.birthData.year} o {result.birthData.hour}:{result.birthData.minute}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#888" }}>{result.cityName} ({result.birthData.latitude}N, {result.birthData.longitude}E)</div>
          </div>

          <div style={styles.grid}>
            {result.data.map((p, i) => (
              <div key={i} style={styles.planetCard}>
                <div style={{ fontWeight: "bold", color: "#c2185b", marginBottom: "5px", textTransform: "uppercase", fontSize: "0.8rem" }}>{p.name}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a237e" }}>{p.sign}</div>
                <div style={{ fontSize: "1.1rem" }}>{p.degreeValue}° {p.minuteValue}'</div>
                <div style={{ fontSize: "0.7rem", color: "#aaa", marginTop: "10px" }}>Wartość: {p.totalValue}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}