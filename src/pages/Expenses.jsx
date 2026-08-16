import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Mic, Trash2, MicOff, Download, Wallet, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e?.preventDefault();
    if (!amount) return;
    try {
      await api.post('/expenses', {
        amount: parseFloat(amount),
        description,
        category: '' // Logic on backend handles auto-categorization
      });
      setAmount('');
      setDescription('');
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return alert("No expenses to export!");
    const headers = ['Date', 'Description', 'Category', 'Amount(INR)'];
    const csvRows = [headers.join(',')];
    expenses.forEach(exp => {
      const date = format(new Date(exp.date), 'dd/MM/yyyy HH:mm');
      const desc = exp.description ? exp.description.replace(/,/g, '') : '';
      csvRows.push(`${date},${desc},${exp.category},${exp.amount}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const numbers = transcript.match(/\d+/);
      const exactAmount = numbers ? numbers[0] : null;

      if (exactAmount) {
        setAmount(exactAmount);
        let cleanDesc = transcript.replace(exactAmount, '').replace(/spent|on|for|rupees|dollars/gi, '').trim();
        setDescription(cleanDesc);
      } else {
        setDescription(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Expenses</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center">
              <Wallet size={14} className="mr-2" /> Transaction History
          </p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center px-6 py-3 bg-white text-slate-700 rounded-2xl border border-slate-100 font-black shadow-soft hover:bg-slate-50 transition-all active:scale-95">
          <Download className="w-5 h-5 mr-2 text-primary-600" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center">
                <Plus className="mr-3 text-primary-600" /> Add New Record
            </h2>
            <button 
                type="button" 
                onClick={startVoiceInput}
                className={`flex items-center px-6 py-3 text-sm font-black rounded-2xl transition-all shadow-xl ${
                isListening ? 'bg-red-500 text-white animate-pulse shadow-red-200' : 'bg-primary-50 text-primary-700 hover:bg-primary-100 shadow-primary-50'
                }`}
            >
                {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                {isListening ? 'Listening...' : 'Dictate Expense'}
            </button>
        </div>
        
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Amount (₹)</label>
            <input 
              type="number" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-black text-slate-900"
              value={amount} onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">What did you buy?</label>
            <input 
              type="text" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-black text-slate-900"
              value={description} onChange={(e) => setDescription(e.target.value)} 
              placeholder="E.g., Dinner at Blue Bay"
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95 text-lg">
             Add Expense
          </button>
        </form>
        <div className="mt-6 flex items-center text-slate-400 bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
            <Info size={16} className="mr-3 text-primary-500" strokeWidth={2.5}/>
            <p className="text-xs font-bold uppercase tracking-wide">AI will automatically categorize this transaction for you based on the description.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Description</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6 text-right">Amount</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-900">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-400">
                    {format(new Date(exp.date), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-8 py-6 font-black text-lg capitalize">{exp.description || '-'}</td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                      {exp.category}
                      {exp.isAutoDetected && <span className="ml-2 opacity-50 text-[9px]">(AI)</span>}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-right text-xl">₹{exp.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => handleDelete(exp.id)} className="text-slate-300 hover:text-red-500 transition-all p-3 rounded-2xl hover:bg-red-50 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                      <img src="https://illustrations.popsy.co/emerald/clueless.svg" alt="empty" className="w-48 mx-auto mb-6 opacity-80" />
                      <p className="font-black text-xl text-slate-800">Your wallet is clean!</p>
                      <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Add your first expense to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
