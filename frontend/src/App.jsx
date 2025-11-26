import { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import CryptoPulse from './components/CryptoPulse';
import SummonAgent from './components/SummonAgent';
import TradeGraveyard from './components/TradeGraveyard';
import UserVault from './components/UserVault';
import StrategyGrid from './components/StrategyGrid';
import KnowledgeTerminal from './components/KnowledgeTerminal';
import Footer from './components/Footer';
import { getApiUrl } from './config';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Debug: Log the API URL being used
    console.log('🔗 Frontend API URL:', getApiUrl('/api/test'));
    
    // Check for user data in URL (from WorkOS redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log('User data from URL:', userData);
        
        // Store in localStorage
        localStorage.setItem('kaseddie_user', JSON.stringify(userData));
        setUser(userData);
        
        // Clean up URL by removing the user parameter
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('user');
        window.history.replaceState({}, '', newUrl.pathname + newUrl.search);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('userUpdated'));
        
        return; // Exit early since we found user in URL
      } catch (error) {
        console.error('Error parsing user from URL:', error);
      }
    }

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Professional Navigation Bar */}
      <NavigationBar />
      
      {/* Crypto Pulse Ticker */}
      <CryptoPulse />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent animate-pulse-glow">
            🎃 Kaseddie AI
          </h1>
          <p className="text-xl text-slate-400">
            Autonomous Crypto Trading Agent from the Crypt
          </p>
        </div>

        {/* AI Knowledge Terminal */}
        <KnowledgeTerminal />

        {/* User Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <UserVault user={user} setUser={setUser} />
          <SummonAgent />
        </div>

        {/* Strategy Grid - Only visible for verified users */}
        <StrategyGrid user={user} />
        
        {/* Trade History */}
        <TradeGraveyard />
      </main>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}

export default App;
