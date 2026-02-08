
import SynastryAnalyzer from "./components/SynastryAnalyzer";
import KosmogramCore from "./components/kosmogram";
import Footer from "./components/Footer";
const App = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Horoskop porównawczy </h1>
      
      <hr style={{ margin: "40px 0" }} />
      <SynastryAnalyzer />
      <KosmogramCore />
      <Footer/>
    </div>

  );
};

export default App;
