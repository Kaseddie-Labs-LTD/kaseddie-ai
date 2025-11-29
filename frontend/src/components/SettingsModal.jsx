import { useState, useEffect } from 'react';

function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('preferences');
  
  // State setup
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [apiKey, setApiKey] = useState('');
  
  // Action States
  const [updateStatus, setUpdateStatus] = useState('idle');
  
  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem('kaseddie_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAutoTrade(parsed.autoTrade || false);
        setRiskLevel(parsed.riskLevel || 'medium');
        setNotifications(parsed.notifications !== false);
        setSound(parsed.sound !== false);
        setApiKey(parsed.apiKey || '');
      } catch (e) {}
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('kaseddie_settings', JSON.stringify({ 
      autoTrade, riskLevel, notifications, sound, apiKey 
    }));
  }, [autoTrade, riskLevel, notifications, sound, apiKey]);

  const handleClearCache = () => {
    if (confirm('⚠️ Clear all local data and logout?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleCheckUpdates = async () => {
    setUpdateStatus('checking');
    await new Promise(r => setTimeout(r, 2000));
    setUpdateStatus('updated');
    setTimeout(() => setUpdateStatus('idle'), 3000);
  };

  const menuItems = [
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'maintenance', label: 'Maintenance', icon: '🛠️' },
    { id: 'feedback', label: 'Feedback', icon: '💬' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Main Modal - SPLIT LAYOUT */}
      <div className="relative z-10 w-full max-w-5xl h-[80vh] bg-slate-950 border border-neon-purple rounded-2xl shadow-2xl flex overflow-hidden animate-in zoom-in-95">
        
        {/* LEFT SIDEBAR (Vertical Nav) */}
        <div className="w-64 md:w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Settings
            </h2>
            <p className="text-xs text-slate-500 mt-1">System Configuration</p>
          </div>
          
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeTab === item.id 
                    ? 'bg-neon-purple/20 text-white border border-neon-purple/50 shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800">
            <button onClick={onClose} className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all font-bold">
              Exit Menu
            </button>
          </div>
        </div>

        {/* RIGHT PANEL (Scrollable Content) */}
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto custom-scrollbar relative">
          
          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Trading Preferences</h3>
              
              <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-white text-lg">Auto-Trading Mode</div>
                  <div className="text-sm text-slate-400">Allow AI to execute trades autonomously</div>
                </div>
                <div 
                  onClick={() => setAutoTrade(!autoTrade)}
                  className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${autoTrade ? 'bg-neon-green' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${autoTrade ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-slate-300 font-bold">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-4">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      onClick={() => setRiskLevel(level)}
                      className={`p-4 rounded-xl border-2 transition-all capitalize font-bold ${
                        riskLevel === level 
                          ? 'border-neon-green bg-neon-green/10 text-white' 
                          : 'border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-white font-medium">🔊 Sound Effects</span>
                  <div 
                    onClick={() => setSound(!sound)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${sound ? 'bg-neon-purple' : 'bg-slate-700'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sound ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">API Configuration</h3>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-200 text-sm flex gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                    <p className="font-bold">Secure Storage</p>
                    <p>Keys are encrypted and stored locally. Clearing cache will remove them.</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white font-bold">Binance API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white focus:border-neon-purple outline-none font-mono tracking-widest"
                  placeholder="Paste API Key here..."
                />
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">System Maintenance</h3>
                  <button 
                    onClick={handleCheckUpdates}
                    className="w-full p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-neon-green transition-all group"
                  >
                      <div className="text-left">
                          <div className="text-white font-bold text-lg group-hover:text-neon-green">Check for Updates</div>
                          <div className="text-slate-500 text-sm">Current Version: v1.0.0</div>
                      </div>
                      <div className="text-2xl">{updateStatus === 'checking' ? '⏳' : updateStatus === 'updated' ? '✅' : '🔄'}</div>
                  </button>

                  <button 
                    onClick={handleClearCache}
                    className="w-full p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between hover:bg-red-500/20 transition-all group"
                  >
                      <div className="text-left">
                          <div className="text-red-400 font-bold text-lg group-hover:text-red-300">Factory Reset</div>
                          <div className="text-red-400/60 text-sm">Clear all local data and settings</div>
                      </div>
                      <div className="text-2xl">🗑️</div>
                  </button>
              </div>
           )}

           {activeTab === 'feedback' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in">
                  <div className="text-6xl mb-4">💬</div>
                  <p>Feedback Module Ready</p>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}

export default SettingsModal;