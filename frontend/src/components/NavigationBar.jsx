import { useState } from 'react';
import SettingsModal from './SettingsModal';

function NavigationBar() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'markets', label: 'Markets', icon: '📊' },
    { id: 'trade', label: 'Trade', icon: '💱', hasDropdown: true },
    { id: 'news', label: 'News', icon: '📰' },
  ];

  const handleNavigation = (itemId) => {
    setActiveTab(itemId);
    
    // Simulate navigation with alerts for demo
    switch(itemId) {
      case 'dashboard':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'markets':
        alert('📊 Navigating to Markets... (Coming Soon)');
        break;
      case 'trade':
        alert('💱 Opening Trade Menu... (Spot/Futures/Convert)');
        break;
      case 'news':
        alert('📰 Navigating to News Feed... (Coming Soon)');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-neon-purple/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎃</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-neon-green to-neon-purple bg-clip-text text-transparent">
                  Kaseddie AI
                </h1>
                <p className="text-xs text-slate-500">Autonomous Trading</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.hasDropdown && <span className="text-xs">▼</span>}
                </button>
              ))}
            </div>

            {/* Settings Icon */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 hover:border-neon-purple/50"
              title="Settings"
            >
              <span className="text-xl">⚙️</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap text-sm ${
                  activeTab === item.id
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                    : 'text-slate-400 bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default NavigationBar;
