import React from 'react';

const Footer = () => {
  // Definicje stylów jako obiekty JS
  const styles = {
    footer: {
      width: '100%',
      padding: '40px 20px',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#64748b'
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #cbd5e1',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    mainText: {
      fontSize: '15px',
      color: '#334155',
      marginBottom: '16px'
    },
    bold: {
      fontWeight: 'bold',
      color: '#0f172a'
    },
    badge: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: '#94a3b8',
      borderTop: '1px solid #e2e8f0',
      paddingTop: '12px',
      marginTop: '12px',
      display: 'block'
    },
    details: {
      fontSize: '12px',
      lineHeight: '1.6',
      marginTop: '12px',
      color: '#475569'
    },
    link: {
      color: '#2563eb',
      textDecoration: 'underline',
      fontWeight: '500'
    },
    bottomText: {
      marginTop: '24px',
      fontSize: '11px',
      color: '#94a3b8',
      fontStyle: 'italic'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.mainText}>
            Dane astronomiczne i obliczenia pozycji planet oparte są na oprogramowaniu 
            <span style={styles.bold}> Swiss Ephemeris</span>.
          </p>

          <span style={styles.badge}>Informacja licencyjna</span>

          <p style={styles.details}>
            The Swiss Ephemeris Free Edition is a professional-standard library for astrological calculations. 
            It is licensed under the <strong>GNU Affero General Public License (AGPL v3)</strong>. <br />
            Copyright &copy; by <a 
              href="https://www.astro.com/swisseph/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.link}
            >
              Astrodienst AG, Switzerland
            </a>. 
            Wszelkie prawa do baz danych i algorytmów należą do ich twórców.
          </p>

          <p style={styles.details}>
            This project uses the Swiss Ephemeris Free Edition under AGPL v3. The source code is available 
            <a 
              href="https://github.com/evilmanzeratul/StronaGrzesia" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.link}
            > tutaj </a> 
            w celu zachowania zgodności z licencją.
          </p>
        </div>

        <p style={styles.bottomText}>
          Strona została stworzona w celach edukacyjnych i rozrywkowych. <br />
          Dane wygenerowane przy pomocy narzędzi Open Source.
        </p>
      </div>
    </footer>
  );
};

export default Footer;