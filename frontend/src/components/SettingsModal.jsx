import { useState, useEffect } from 'react';
import { getApiUrl } from '../config';

function SettingsModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('preferences');
  const [settings, setSettings] = useState({
    autoTrade: false,
    riskLevel: 'MEDIUM',
    notifications: true,
    soundEffects: true,
    theme: 'dark',
    apiKey: '',
    apiSecret: '',
  });
  const [updateStatus, setUpdateStatus] = useState('idle'); // idle, checking, updated
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle, sending, sent
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('kaseddie_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        console.log('✅ Settings loaded from localStorage');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kaseddie_settings', JSON.stringify(settings));
    console.log('💾 Settings saved to localStorage');
  }, [settings]);

  const sections = [
    { id: 'preferences', label: 'Trade Preferences', icon: '⚙️' },
    { id: 'api', label: 'API Settings', icon: '🔑' },
    { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
    { id: 'cache', label: 'Clean Cache', icon: '🧹' },
    { id: 'updates', label: 'Updates', icon: '🔄' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
  ];

  const handleSave = () => {
    localStorage.setItem('kaseddie_settings', JSON.stringify(settings));
    alert('✅ Settings saved successfully!');
    onClose();
  };

  const handleClearCache = () => {
    if (confirm('⚠️ Are you sure you want to clear all cached data? This will log you out and remove all settings.')) {
      localStorage.clear();
      alert('✅ Cache cleared! Reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleCheckUpdates = async () => {
    setUpdateStatus('checking');
    
    // Simulate checking for updates
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUpdateStatus('updated');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setUpdateStatus('idle');
    }, 3000);
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) {
      alert('⚠️ Please enter a message before sending feedback.');
      return;
    }

    setFeedbackStatus('sending');
    
    // Simulate sending feedback
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFeedbackStatus('sent');
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackType('bug');
      setFeedbackStatus('idle');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-xl border border-neon-purple/30 max-w-4xl w-full my-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neon-purple">⚙️ System Settings</h2>
            <p className="text-sm text-slate-400 mt-1">Configure your Kaseddie AI experience</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800/50 border-r border-slate-700 p-4 overflow-y-auto flex-shrink-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeSection === section.id
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Trade Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
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
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg">
                    <label className="block mb-2 font-semibold text-white">Risk Level</label>
                    <select
                      value={settings.riskLevel}
                      onChange={(e) => setSettings({ ...settings, riskLevel: e.target.value })}
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    >
                      <option value="LOW">🛡️ Low Risk (Conservative)</option>
                      <option value="MEDIUM">⚖️ Medium Risk (Balanced)</option>
                      <option value="HIGH">🚀 High Risk (Aggressive)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Notifications</p>
                      <p className="text-sm text-slate-400">Trade alerts and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Sound Effects</p>
                      <p className="text-sm text-slate-400">Voice responses and alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={(e) => setSettings({ ...settings, soundEffects: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">🔑 API Settings</h3>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ <strong>Security Warning:</strong> Never share your API keys. They provide full access to your trading account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold text-white">Binance API Key</label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      placeholder="Enter your Binance API Key"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-white">Binance API Secret</label>
                    <input
                      type="password"
                      value={settings.apiSecret}
                      onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
                      placeholder="Enter your Binance API Secret"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    />
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">How to get API Keys:</h4>
                    <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                      <li>Log in to your Binance account</li>
                      <li>Go to API Management</li>
                      <li>Create a new API key</li>
                      <li>Enable "Spot & Margin Trading"</li>
                      <li>Copy and paste keys here</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">⌨️ Keyboard Shortcuts</h3>
                
                <div className="space-y-3">
                  {[
                    { keys: ['Ctrl', 'K'], action: 'Open Knowledge Terminal' },
                    { keys: ['Ctrl', 'T'], action: 'Quick Trade' },
                    { keys: ['Ctrl', 'S'], action: 'Open Settings' },
                    { keys: ['Ctrl', 'M'], action: 'View Markets' },
                    { keys: ['Ctrl', 'H'], action: 'Trade History' },
                    { keys: ['Esc'], action: 'Close Modal' },
                  ].map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">{shortcut.action}</span>
                      <div className="flex gap-2">
                        {shortcut.keys.map((key, i) => (
                          <kbd key={i} className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm font-mono text-neon-green">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'cache' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">🧹 Clean Cache</h3>
                
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-4">🗑️</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Clear All Cached Data</h4>
                  <p className="text-slate-400 mb-6">
                    This will remove all stored settings, trade history, and user data from your browser.
                  </p>
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
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">🔄 System Updates</h3>
                
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">
                      {updateStatus === 'checking' ? '⏳' : updateStatus === 'updated' ? '✅' : '🔄'}
                    </div>
                    <div>
                      <h4 className={`text-lg font-semibold ${updateStatus === 'updated' ? 'text-neon-green' : 'text-white'}`}>
                        {updateStatus === 'checking' ? 'Checking for updates...' : 
                         updateStatus === 'updated' ? "You're up to date!" : 
                         'Kaseddie AI v1.0.0'}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {updateStatus === 'checking' ? 'Please wait...' : 'Latest version installed'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckUpdates}
                    disabled={updateStatus === 'checking'}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      updateStatus === 'checking'
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : updateStatus === 'updated'
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                        : 'bg-neon-purple hover:bg-neon-purple/80 text-white'
                    }`}
                  >
                    {updateStatus === 'checking' ? '⏳ Checking...' : 
                     updateStatus === 'updated' ? '✅ Up to Date' : 
                     '🔄 Check for Updates'}
                  </button>
                  
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <h5 className="font-semibold text-white mb-2">Latest Updates:</h5>
                    <ul className="text-sm text-slate-400 space-y-2">
                      <li>✨ Added Smart Risk Buttons</li>
                      <li>🧠 Hybrid Brain with instant answers</li>
                      <li>🔑 API Settings configuration</li>
                      <li>⚙️ Global Settings System</li>
                      <li>📊 Professional Navigation Bar</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'feedback' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">💬 Send Feedback</h3>
                
                {feedbackStatus === 'sent' && (
                  <div className="bg-neon-green/20 border border-neon-green/50 rounded-lg p-4 mb-4">
                    <p className="text-neon-green font-semibold">✅ Feedback sent successfully! Thank you!</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold text-white">Feedback Type</label>
                    <select 
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                      disabled={feedbackStatus === 'sending'}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple disabled:opacity-50"
                    >
                      <option value="bug">🐛 Bug Report</option>
                      <option value="feature">💡 Feature Request</option>
                      <option value="general">⭐ General Feedback</option>
                      <option value="question">❓ Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-white">Your Message</label>
                    <textarea
                      rows="6"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      disabled={feedbackStatus === 'sending'}
                      placeholder="Tell us what you think..."
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple resize-none disabled:opacity-50"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleSendFeedback}
                    disabled={feedbackStatus === 'sending'}
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-all ${
                      feedbackStatus === 'sending'
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-neon-purple hover:bg-neon-purple/80 text-white'
                    }`}
                  >
                    {feedbackStatus === 'sending' ? '⏳ Sending...' : '📤 Send Feedback'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-neon-green hover:bg-neon-green/80 text-slate-900 font-bold rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
