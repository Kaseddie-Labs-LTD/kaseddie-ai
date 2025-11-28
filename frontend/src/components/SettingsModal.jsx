import { useState, useEffect } from 'react';

function SettingsModal({ onClose }) {
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  
  // Action States
  const [updateStatus, setUpdateStatus] = useState('idle'); // idle, checking, updated
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle, sending, sent
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('feature');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAutoTrade = localStorage.getItem('setting_autoTrade');
    const savedRiskLevel = localStorage.getItem('setting_riskLevel');
    const savedNotifications = localStorage.getItem('setting_notifications');
    const savedSound = localStorage.getItem('setting_sound');
    const savedApiKey = localStorage.getItem('setting_apiKey');

    if (savedAutoTrade !== null) setAutoTrade(JSON.parse(savedAutoTrade));
    if (savedRiskLevel) setRiskLevel(savedRiskLevel);
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
    if (savedSound !== null) setSound(JSON.parse(savedSound));
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('setting_autoTrade', JSON.stringify(autoTrade));
    localStorage.setItem('setting_riskLevel', riskLevel);
    localStorage.setItem('setting_notifications', JSON.stringify(notifications));
    localStorage.setItem('setting_sound', JSON.stringify(sound));
    localStorage.setItem('setting_apiKey', apiKey);
  }, [autoTrade, riskLevel, notifications, sound, apiKey]);


  // --- Actions ---
  
  const handleCleanCache = () => {
    if (confirm('⚠️ Are you sure? This will log you out and reset all local data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleCheckUpdates = async () => {
    setUpdateStatus('checking');
    // Simulate network request
    await new Promise(r => setTimeout(r, 2000));
    setUpdateStatus('updated');
    setTimeout(() => setUpdateStatus('idle'), 3000);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    
    setFeedbackStatus('sending');
    // Simulate network request
    await new Promise(r => setTimeout(r, 1500));
    
    setFeedbackStatus('sent');
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackStatus('idle');
    }, 2000);
  };

  return (
    // 1. FIXED LAYOUT: Full-screen overlay with right-side drawer
    <div className="fixed inset-0 z-[100] flex justify-end">
      
      {/* Backdrop (Click to close) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* The Drawer Panel - Wider (max-w-md), Darker, Clearer */}
      <div className="relative z-10 w-full max-w-md h-full bg-slate-950 border-l border-neon-purple shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">⚙️</span> System Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors text-xl font-bold w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content - Increased padding and spacing */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Section 1: Trading Preferences */}
          <section className="space-y-4">
            <h3 className="text-neon-green font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2">
              Trading Preferences
            </h3>
            
            {/* Auto-Trade Toggle */}
            <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-800 hover:border-neon-purple/50 transition-all shadow-lg">
              <div>
                <div className="text-white font-bold text-lg">Auto-Trading</div>
                <div className="text-slate-400 text-sm mt-1">Allow AI to execute without confirmation</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTrade}
                  onChange={(e) => setAutoTrade(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-neon-green"></div>
              </label>
            </div>

            {/* Risk Level */}
            <div className="space-y-2">
              <label className="text-white font-medium text-base">Risk Tolerance Level</label>
              <select 
                value={riskLevel} 
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:border-neon-green outline-none text-base cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <option value="low">🛡️ Low (Conservative - 1% Risk)</option>
                <option value="medium">⚖️ Medium (Balanced - 2% Risk)</option>
                <option value="high">🚀 High (Aggressive - 5% Risk)</option>
              </select>
            </div>

             {/* Sound Toggle */}
             <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <span className="text-slate-200 font-medium">🔊 Sound Effects</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sound}
                    onChange={(e) => setSound(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
                </label>
             </div>
          </section>

          {/* Section 2: API Configuration */}
          <section className="space-y-4">
            <h3 className="text-neon-purple font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2">
              API Configuration
            </h3>
            
            <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                <span className="text-xl">⚠️</span>
                <p className="text-yellow-200 text-sm leading-tight">API keys are stored locally in your browser for security. Clear cache to remove them.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-bold">Binance API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API Key..."
                  className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:border-neon-purple outline-none font-mono tracking-wide"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Maintenance */}
          <section className="space-y-4">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2">
              System Maintenance
            </h3>

            <button 
              onClick={handleCheckUpdates}
              disabled={updateStatus !== 'idle'}
              className="w-full p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group transition-all"
            >
              <span className="text-white font-medium text-base">Check for Updates</span>
              <span className={`text-sm font-mono px-3 py-1 rounded ${
                updateStatus === 'updated' ? 'bg-neon-green text-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {updateStatus === 'idle' && 'v1.0.0'}
                {updateStatus === 'checking' && 'Checking...'}
                {updateStatus === 'updated' && '✅ Latest'}
              </span>
            </button>

            <button 
              onClick={handleCleanCache}
              className="w-full p-4 bg-red-900/10 hover:bg-red-900/20 border border-red-900/30 hover:border-red-500 rounded-xl flex items-center justify-center gap-3 transition-all text-red-400 hover:text-red-300 font-bold text-base"
            >
              <span>🗑️</span> Clear Application Cache
            </button>
          </section>

          {/* Section 4: Feedback */}
          <section className="space-y-4">
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm border-b border-slate-800 pb-2">
              Feedback
            </h3>
            
            <form onSubmit={handleSendFeedback} className="space-y-3">
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Report a bug or request a feature..."
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:border-neon-green outline-none h-32 resize-none text-base"
              />
              <button 
                type="submit"
                disabled={!feedbackMessage || feedbackStatus !== 'idle'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  feedbackStatus === 'sent' 
                    ? 'bg-neon-green text-black'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 hover:border-white'
                }`}
              >
                {feedbackStatus === 'idle' && 'Submit Feedback'}
                {feedbackStatus === 'sending' && 'Sending...'}
                {feedbackStatus === 'sent' && '✅ Sent Successfully!'}
              </button>
            </form>
          </section>
          
          {/* Extra padding at bottom for scrolling */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;