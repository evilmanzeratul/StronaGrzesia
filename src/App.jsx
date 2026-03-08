import React from 'react';
import SynastryAnalyzer from "./components/SynastryAnalyzer";
import KosmogramCore from "./components/kosmogram";
import Footer from "./components/Footer";

const App = () => {
  const styles = {
    wrapper: {
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      minHeight: '100vh',
      fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif',
      padding: '40px 20px',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'left',
      borderLeft: '5px solid #2563eb', // Niebieski akcent "techniczny"
      paddingLeft: '20px',
      marginBottom: '40px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      letterSpacing: '-0.5px',
      margin: '0 0 10px 0',
      color: '#111827',
    },
    description: {
      fontSize: '16px',
      color: '#4b5563',
      margin: 0,
      lineHeight: '1.5',
    },
    sectionBox: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '25px',
      marginBottom: '30px',
    },
    label: {
      display: 'inline-block',
      backgroundColor: '#e2e8f0',
      color: '#475569',
      fontSize: '12px',
      fontWeight: '700',
      padding: '4px 8px',
      borderRadius: '4px',
      marginBottom: '15px',
      textTransform: 'uppercase',
    },
    divider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      border: 'none',
      margin: '40px 0',
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <h1 style={styles.title}>System Weryfikacji Relacji</h1>
          <p style={styles.description}>
            Obiektywna analiza zgodności międzyosobowej na podstawie parametrów astronomicznych. 
            Narzędzie do oceny potencjału trwałej przyjaźni i stabilności relacji.
          </p>
        </header>

        <main>
          <div style={styles.sectionBox}>
            <SynastryAnalyzer />
          </div>

          <hr style={styles.divider} />

          <div style={styles.sectionBox}>
            <KosmogramCore />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;