import { useState, useEffect } from 'react';

function CryptoPulse() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchPrices = () => {
      fetch('http://localhost:3000/api/market/prices')
        .then(res => res.json())
        .then(data => setCryptoData(data))
        .catch(err => console.error('Failed to fetch crypto pulse:', err));
    };

    // Initial fetch
    fetchPrices();

    // Refresh every 10 seconds
    const interval = setInterval(fetchPrices, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border-b border-neon-green/20 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-4">
        <div className="inline-flex gap-8">
          {cryptoData.concat(cryptoData).map((crypto, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 px-4">
              <span className="text-neon-green font-bold">{crypto.symbol}</span>
              <span className="text-white">${crypto.price?.toLocaleString()}</span>
              <span className={crypto.change >= 0 ? 'text-neon-green' : 'text-red-500'}>
                {crypto.change >= 0 ? '↑' : '↓'} {Math.abs(crypto.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee > div {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default CryptoPulse;
