import { useState, useEffect } from 'react';
import CryptoPulse from './components/CryptoPulse';
import SummonAgent from './components/SummonAgent';
import TradeGraveyard from './components/TradeGraveyard';
import UserVault from './components/UserVault';
import StrategyGrid from './components/StrategyGrid';
import KnowledgeTerminal from './components/KnowledgeTerminal';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for user changes from localStorage
    const checkUser = () => {
      const storedUser = localStorage.getItem('kaseddie_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkUser();

    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener('storage', checkUser);
    
    // Custom event for same-tab updates
    window.addEventListener('userUpdated', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userUpdated', checkUser);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <CryptoPulse />
      
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent animate-pulse-glow">
            🎃 Kaseddie AI
          </h1>
          <p className="text-xl text-slate-400">
            Autonomous Crypto Trading Agent from the Crypt
          </p>
        </header>

        {/* AI Knowledge Terminal - Right under header */}
        <KnowledgeTerminal />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <UserVault />
          <SummonAgent />
        </div>

        {/* Strategy Grid - Only visible for verified users */}
        <StrategyGrid user={user} />
        
        <TradeGraveyard />
      </main>
    </div>
  );
}

export default App;
