import React, { useState, useEffect } from 'react';
import api from '../api';
import { Target, Plus, Trash2, TrendingUp, CheckCircle, Wallet, Flame, AlertTriangle } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', { title, targetAmount: parseFloat(targetAmount), deadline });
      setTitle('');
      setTargetAmount('');
      setDeadline('');
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSavings = async (id) => {
    const amount = prompt("How much would you like to contribute to this goal?");
    if (!amount || isNaN(amount)) return;
    try {
      await api.put(`/goals/${id}/add-savings?amount=${amount}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <style>{`
        @keyframes glow {
          0% { filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.2)); }
          50% { filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.5)); }
          100% { filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.2)); }
        }
        .flame-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Savings Goals</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center">
            <Target size={14} className="mr-2" /> Plan for your future
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
        <h2 className="text-xl font-black mb-8 text-slate-800 flex items-center">
          <Plus className="mr-3 text-blue-600" /> Start a New Goal
        </h2>
        
        <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-1 space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Goal Name</label>
            <input 
              type="text" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all font-black text-slate-900 placeholder:text-slate-300"
              value={title} onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Dream House"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Target Amount (₹)</label>
            <input 
              type="number" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all font-black text-slate-900 placeholder:text-slate-300"
              value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} 
              placeholder="50000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Deadline Date</label>
            <input 
              type="date" required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all font-black text-slate-900"
              value={deadline} onChange={(e) => setDeadline(e.target.value)} 
            />
          </div>
          <div className="md:col-span-3 flex justify-end mt-4">
            <button type="submit" className="w-full md:w-auto px-10 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95 text-lg">
               Create Milestone
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {goals.map(goal => {
          const progress = Math.min(((goal.savedAmount || 0) / goal.targetAmount) * 100, 100);
          const isComplete = progress >= 100;
          const today = new Date().toISOString().split('T')[0];
          const hasContributedToday = goal.lastContributionDate === today;
          const streak = goal.streak || 0;

          const getMotivationalText = (streak) => {
            if (streak >= 7) return "Weekly Streak Completed 🎉";
            if (streak >= 5) return "You’re on fire! 🔥";
            if (streak > 0) return "Keep the streak alive!";
            return "Start your first streak today!";
          };

          const weeklyDots = [6, 5, 4, 3, 2, 1, 0].map(daysBack => {
              const date = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
              const contributed = goal.history?.includes(date);
              return contributed;
          });

          return (
            <div key={goal.id} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-[420px]">
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col space-y-4">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm border ${isComplete ? 'bg-green-100 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {isComplete ? <CheckCircle size={32} strokeWidth={2.5} /> : <Target size={32} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 capitalize leading-tight mb-1">{goal.title}</h3>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Due {format(new Date(goal.deadline), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                    {streak > 0 && (
                        <div className="bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl flex items-center shadow-sm">
                            <Flame size={18} className="text-orange-500 flame-glow mr-1.5" strokeWidth={2.5} />
                            <span className="text-lg font-black text-slate-900">{streak}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 ml-1.5">Day Streak</span>
                        </div>
                    )}
                    <button onClick={() => handleDelete(goal.id)} className="text-slate-300 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-red-50 opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>

              <div className="space-y-6 pt-6 relative z-10">
                {!hasContributedToday && !isComplete && (
                    <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center space-x-3 text-red-500 animate-pulse">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">Add funds today to keep your streak!</span>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{getMotivationalText(streak)}</span>
                        <div className="flex space-x-1.5">
                            {weeklyDots.map((contributed, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${contributed ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.2)]' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saved So Far</span>
                            <span className="text-2xl font-black text-blue-600">₹{(goal.savedAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target</span>
                            <span className="text-lg font-black text-slate-800">₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner flex relative">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.2)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)]'}`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{Math.round(progress)}% Complete</span>
                  {!isComplete ? (
                    <button onClick={() => handleAddSavings(goal.id)} className="text-sm flex items-center font-black text-blue-600 hover:text-blue-700 transition-colors px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm active:scale-95">
                      <TrendingUp size={16} className="mr-2" /> Add Funds
                    </button>
                  ) : (
                    <span className="text-xs font-black text-green-600 flex items-center uppercase tracking-widest"><CheckCircle size={14} className="mr-2"/> Goal Met</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full p-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-500 bg-white/50 shadow-soft">
            <img src="https://illustrations.popsy.co/emerald/clueless.svg" alt="empty" className="w-48 mx-auto mb-6 grayscale opacity-80" />
            <p className="font-black text-2xl text-slate-800 mb-2">No active milestones</p>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Transform your dreams into reality by starting a goal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
