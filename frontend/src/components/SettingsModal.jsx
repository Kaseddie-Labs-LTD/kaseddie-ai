import { useState, useEffect } from 'react';

function SettingsModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('preferences');
  const [settings, setSettings] = useState({
    autoTrade: false,
    riskLevel: 'MEDIUM',
    notifications: true,
    soundEffects: true,
    apiKey: '',
    apiSecret: '',
  });
  const [updateStatus, setUpdateStatus] = useState('idle');
  const [feedbackStatus, setFeedbackStatus] = useState('idle');
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('kaseddie_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kaseddie_settings', JSON.stringify(settings));
  }, [settings]);

  const sections = [
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'api', label: 'API', icon: '🔑' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
    { id: 'cache', label: 'Cache', icon: '🧹' },
    { id: 'updates', label: 'Updates', icon: '🔄' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
  ];

  const handleClearCache = () => {
    if (confirm('⚠️ Clear all data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleCheckUpdates = async () => {
    setUpdateStatus('checking');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUpdateStatus('updated');
    setTimeout(() => setUpdateStatus('idle'), 3000);
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) {
      alert('⚠️ Please enter a message.');
      return;
    }
    setFeedbackStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFeedbackStatus('sent');
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackStatus('idle');
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-950 border-l border-neon-purple/30 shadow-2xl z-[101] flex flex-col">
        
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neon-purple">⚙️ Settings</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
          </div>
          <p className="text-sm text-slate-400">Configure Kaseddie AI</p>
        </div>

        <div className="flex overflow-x-auto border-b border-slate-800 flex-shrink-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-all border-b-2 ${
                activeSection === section.id
                  ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>{section.icon}</span>
              <span className="text-sm font-medium hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeSection === 'preferences' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Trade Preferences</h3>
              
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <p className="font-semibold text-white">Auto-Trading</p>
                  <p className="text-sm text-slate-400">Enable autonomous trading</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoTrade}
                    onChange={(e) => setSettings({ ...settings, autoTrade: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                </label>
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                <label className="block mb-2 font-semibold text-white">Risk Level</label>
                <select
                  value={settings.riskLevel}
                  onChange={(e) => setSettings({ ...settings, riskLevel: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                >
                  <option value="LOW">🛡️ Low Risk</option>
                  <option value="MEDIUM">⚖️ Medium Risk</option>
                  <option value="HIGH">🚀 High Risk</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <p className="font-semibold text-white">Notifications</p>
                  <p className="text-sm text-slate-400">Trade alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                <div>
                  <p className="font-semibold text-white">Sound Effects</p>
                  <p className="text-sm text-slate-400">Voice responses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) => setSettings({ ...settings, soundEffects: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">🔑 API Settings</h3>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">⚠️ Never share your API keys</p>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-white">Binance API Key</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Enter API Key"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple border border-slate-800"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-white">Binance API Secret</label>
                <input
                  type="password"
                  value={settings.apiSecret}
                  onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
                  placeholder="Enter API Secret"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple border border-slate-800"
                />
              </div>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">⌨️ Shortcuts</h3>
              
              {[
                { keys: ['Ctrl', 'K'], action: 'Knowledge Terminal' },
                { keys: ['Ctrl', 'T'], action: 'Quick Trade' },
                { keys: ['Ctrl', 'S'], action: 'Settings' },
                { keys: ['Esc'], action: 'Close Modal' },
              ].map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-300 text-sm">{shortcut.action}</span>
                  <div className="flex gap-2">
                    {shortcut.keys.map((key, i) => (
                      <kbd key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-neon-green">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'cache' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">🧹 Clean Cache</h3>
              
              <div className="bg-slate-900 rounded-lg p-6 text-center border border-slate-800">
                <div className="text-6xl mb-4">🗑️</div>
                <h4 className="text-lg font-semibold text-white mb-2">Clear All Data</h4>
                <p className="text-slate-400 mb-6 text-sm">Remove all stored settings and data</p>
                <button
                  onClick={handleClearCache}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          )}

          {activeSection === 'updates' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">🔄 Updates</h3>
              
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">
                    {updateStatus === 'checking' ? '⏳' : updateStatus === 'updated' ? '✅' : '🔄'}
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${updateStatus === 'updated' ? 'text-neon-green' : 'text-white'}`}>
                      {updateStatus === 'checking' ? 'Checking...' : 
                       updateStatus === 'updated' ? "Up to date!" : 
                       'v1.0.0'}
                    </h4>
                    <p className="text-slate-400 text-sm">Latest version</p>
                  </div>
                </div>

                <button
                  onClick={handleCheckUpdates}
                  disabled={updateStatus === 'checking'}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    updateStatus === 'checking'
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : updateStatus === 'updated'
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                      : 'bg-neon-purple hover:bg-neon-purple/80 text-white'
                  }`}
                >
                  {updateStatus === 'checking' ? '⏳ Checking...' : 
                   updateStatus === 'updated' ? '✅ Up to Date' : 
                   '🔄 Check Updates'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'feedback' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">💬 Feedback</h3>
              
              {feedbackStatus === 'sent' && (
                <div className="bg-neon-green/20 border border-neon-green/50 rounded-lg p-4">
                  <p className="text-neon-green font-semibold text-sm">✅ Feedback sent!</p>
                </div>
              )}

              <div>
                <label className="block mb-2 font-semibold text-white">Type</label>
                <select 
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  disabled={feedbackStatus === 'sending'}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple border border-slate-800"
                >
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature">💡 Feature Request</option>
                  <option value="general">⭐ General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-white">Message</label>
                <textarea
                  rows="6"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  disabled={feedbackStatus === 'sending'}
                  placeholder="Tell us what you think..."
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple resize-none border border-slate-800"
                ></textarea>
              </div>

              <button 
                onClick={handleSendFeedback}
                disabled={feedbackStatus === 'sending'}
                className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${
                  feedbackStatus === 'sending'
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-neon-purple hover:bg-neon-purple/80 text-white'
                }`}
              >
                {feedbackStatus === 'sending' ? '⏳ Sending...' : '📤 Send Feedback'}
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default SettingsModal;
