import React, { useState, useEffect } from 'react';
import api from '../api';
import { Bell, Plus, Trash2, CalendarClock, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reminders', { message, date });
      setMessage('');
      setDate('');
      fetchReminders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div></div>;

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reminders</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center">
            <Bell size={14} className="mr-2" /> Stay On Top of Bills
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
        <h2 className="text-xl font-black mb-8 text-slate-800 flex items-center">
          <Plus className="mr-3 text-primary-600" /> New Alert
        </h2>
        
        <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Event / Message</label>
            <input 
              type="text" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-black text-slate-900 placeholder:text-slate-300"
              value={message} onChange={(e) => setMessage(e.target.value)} 
              placeholder="e.g., Electricity Bill Payment"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Date & Time</label>
            <input 
              type="datetime-local" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-black text-slate-900"
              value={date} onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95 text-lg">
             Create Alert
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden card-hover">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="font-black text-slate-900 flex items-center text-xl">
            <CalendarClock className="w-6 h-6 mr-4 text-primary-600" /> Upcoming Alerts
          </h3>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100">
             Sorted by date
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {reminders.map(rem => {
            const isSoon = new Date(rem.date).getTime() - new Date().getTime() < 86400000; // less than 24h
            return (
            <div key={rem.id} className="p-8 flex justify-between items-center hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center space-x-6">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full ${isSoon ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)] animate-pulse' : 'bg-primary-600 shadow-[0_0_12px_rgba(37,99,235,0.2)]'}`}></div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">{rem.message}</h4>
                  <p className={`text-sm font-bold mt-1 uppercase tracking-widest flex items-center ${isSoon ? 'text-orange-600' : 'text-slate-400'}`}>
                    <CalendarClock size={12} className="mr-2" />
                    {isSoon && <span className="mr-2 border-r border-orange-200 pr-2">Urgently Due</span>}
                    {format(new Date(rem.date), 'MMMM dd, hh:mm a')}
                  </p>
                </div>
              </div>
              <button onClick={() => handleDelete(rem.id)} className="text-slate-300 hover:text-red-500 transition-all p-4 rounded-2xl hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            )
          })}
          {reminders.length === 0 && (
            <div className="p-24 text-center">
              <img src="https://illustrations.popsy.co/emerald/customer-care.svg" alt="empty" className="w-48 mx-auto mb-6 opacity-80" />
              <p className="font-black text-2xl text-slate-800 mb-2">You are all caught up!</p>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No upcoming payments detected.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100 flex items-start">
        <Info className="w-6 h-6 text-primary-600 mr-4 mt-0.5" strokeWidth={2.5}/>
        <div>
            <p className="font-black text-primary-900 uppercase tracking-widest text-xs mb-1">Financial Tip</p>
            <p className="text-sm font-bold text-primary-700 leading-relaxed">Setting up reminders for credit card bills at least 3 days before the due date helps maintain a healthy credit score and avoids late fees.</p>
        </div>
      </div>
    </div>
  );
}
