import { useState } from 'react';
import { getApiUrl } from '../config';

function ManualTrade({ user }) {
  const [symbol, setSymbol] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const executeManualTrade = async (action) => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      // Get userId
      let userId = user?.id || 'bd09bc8c-e725-4f3f-aa2c-075b074aabb9';
      const storedUser = localStorage.getItem('kaseddie_user');
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          if (userObj.id) {
            userId = userObj.id;
          }
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e);
        }
      }

      const response = await fetch(getApiUrl('/api/trading/manual'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          symbol: symbol.toUpperCase(),
          action: action,
          amount: parseFloat(amount),
          stopLoss: stopLoss ? parseFloat(stopLoss) : null,
          takeProfit: takeProfit ? parseFloat(takeProfit) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = data.message || `Manual ${action} Order Executed`;
        setMessage(`✅ ${successMessage}`);
        
        // Speak the confirmation
        try {
          const audioRes = await fetch(getApiUrl('/api/ai/speak'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: successMessage })
          });
          
          if (audioRes.ok) {
            const audioBlob = await audioRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            
            // Clean up the URL after playing
            audio.onended = () => URL.revokeObjectURL(audioUrl);
          }
        } catch (audioErr) {
          console.error('Failed to play audio:', audioErr);
        }

        // Clear form
        setAmount('');
        setStopLoss('');
        setTakeProfit('');
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`❌ ${data.error || 'Trade failed'}`);
      }
    } catch (err) {
      console.error('Manual trade error:', err);
      setMessage('❌ Failed to execute trade');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl border border-neon-purple/30 backdrop-blur-lg">
      <h3 className="text-2xl font-bold mb-4 text-neon-purple">
        🎯 Manual Trading
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTC"
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple font-bold text-lg"
            disabled={processing}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple font-bold text-lg"
            disabled={processing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Stop Loss ($)</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Optional"
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              disabled={processing}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Take Profit ($)</label>
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Optional"
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green text-sm"
              disabled={processing}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => executeManualTrade('BUY')}
            disabled={processing}
            className="bg-neon-green text-slate-900 font-bold py-4 px-6 rounded-lg hover:bg-neon-green/80 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {processing ? '⏳' : '📈'} BUY
          </button>

          <button
            onClick={() => executeManualTrade('SELL')}
            disabled={processing}
            className="bg-red-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {processing ? '⏳' : '📉'} SELL
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-center font-semibold ${
            message.includes('✅') 
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualTrade;
