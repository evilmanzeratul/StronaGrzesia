import React from 'react';

const Footer = () => {
  return (
<div className="bg-white/50 p-4 rounded-lg border border-gray-300">
  <p className="text-gray-700">
    Dane astronomiczne i obliczenia pozycji planet oparte są na oprogramowaniu 
    <span className="font-bold text-gray-900"> Swiss Ephemeris</span>.
  </p>

  <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
    Informacja licencyjna
  </div>

  <p className="mt-2 text-xs leading-relaxed">
    The Swiss Ephemeris Free Edition is a professional-standard library for astrological calculations. 
    It is licensed under the <span className="font-semibold">GNU Affero General Public License (AGPL v3)</span>. <br />
    Copyright &copy; by <a 
      href="https://www.astro.com/swisseph/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 underline hover:text-blue-800 transition-colors"
    >
      Astrodienst AG, Switzerland
    </a>. 
    Wszelkie prawa do baz danych i algorytmów obliczeniowych należą do ich twórców.
  </p>

  <p className="mt-2 text-xs leading-relaxed">
    This project uses the Swiss Ephemeris Free Edition under AGPL v3. The source code of this project is available <a href="https://github.com/evilmanzeratul/StronaGrzesia" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">here</a> in compliance with AGPL.
  </p>
</div>

  );
};

export default Footer;