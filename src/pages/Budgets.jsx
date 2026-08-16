import React, { useState, useEffect } from 'react';
import api from '../api';
import { Target, Save, TrendingUp, History, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Budgets() {
  const [budget, setBudget] = useState('');
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [expensesAmount, setExpensesAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetRes, expensesRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/expenses')
      ]);
      
      setBudgetHistory(budgetRes.data);
      
      const total = expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);
      setExpensesAmount(total);
    } catch (err) {
      console.error("Error fetching budget data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!budget) return;
    try {
      await api.post('/budgets', { amount: parseFloat(budget) });
      setBudget('');
      fetchData();
    } catch (err) {
      console.error("Error saving budget", err);
    }
  };

  const currentBudget = budgetHistory.length > 0 ? budgetHistory[0].amount : 0;
  const progress = currentBudget > 0 ? Math.min((expensesAmount / currentBudget) * 100, 100) : 0;
  const isOverBudget = expensesAmount > currentBudget && currentBudget > 0;

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div></div>;

  return (
    <div className="w-full space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Budgets</h1>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center">
            <Target size={14} className="mr-2 text-primary-600" /> Set your limits
        </p>
      </div>

      <div className="w-full bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
        <h2 className="text-xl font-black mb-6 sm:mb-8 text-slate-800 flex items-center">
          <Target className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0" /> Set New Budget Limit
        </h2>

        <form onSubmit={handleSaveBudget} className="flex flex-col gap-6 w-full max-w-full">
          <div className="w-full space-y-2 min-w-0">
            <label htmlFor="budget-amount" className="block text-sm font-black text-slate-700 ml-1">Budget Amount (₹)</label>
            <input
              id="budget-amount"
              type="number" required
              className="w-full max-w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 outline-none transition-all text-slate-900 font-black placeholder:text-slate-300"
              value={budget} onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start px-10 bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95 text-lg">
            <Save className="w-5 h-5 flex-shrink-0" /> Save Budget
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 w-full">
        {/* Current Budget View */}
        {currentBudget > 0 ? (
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover h-full min-w-0">
            <h2 className="text-xl font-black mb-6 sm:mb-8 text-slate-900">Current Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Spent so far</p>
                <p className={`text-3xl font-black break-words ${isOverBudget ? 'text-red-600' : 'text-primary-600'}`}>
                  ₹{expensesAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly Limit</p>
                <p className="text-3xl font-black break-words text-slate-800">
                  ₹{currentBudget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden shadow-inner mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-primary-500 to-blue-600'}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center gap-4 flex-col md:flex-row md:text-left text-center">
                <div className="flex items-center justify-center md:justify-start flex-shrink-0">
                    <span className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest ${isOverBudget ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-primary-50 text-primary-600 border border-primary-100'}`}>
                      {progress.toFixed(0)}% Used
                    </span>
                </div>
                <span className={`text-sm uppercase tracking-widest break-words ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {isOverBudget
                    ? `OVER BUDGET BY ₹${(expensesAmount - currentBudget).toLocaleString()}`
                    : `₹${(currentBudget - expensesAmount).toLocaleString()} REMAINING`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 sm:p-16 text-center border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-500 bg-white shadow-soft min-w-0">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <p className="font-black text-2xl text-slate-800 mb-2 uppercase tracking-tight">No Budget Set</p>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Set a monthly budget limit to start tracking.</p>
          </div>
        )}

        {/* History View */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover h-full min-w-0 overflow-hidden">
          <h2 className="text-xl font-black mb-6 sm:mb-8 text-slate-900 flex items-center">
             <History className="w-6 h-6 mr-3 text-slate-400 flex-shrink-0" /> Previous Records
          </h2>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {budgetHistory.length > 0 ? (
                budgetHistory.map((b, i) => (
                    <div key={b.id} className={`flex justify-between items-center gap-4 p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-primary-50 border-primary-100 ring-2 ring-primary-500/10' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                        <div className="flex items-center space-x-4 min-w-0">
                            <div className={`p-3 rounded-xl flex-shrink-0 ${i === 0 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                <Calendar size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-slate-900">{format(new Date(b.date), 'MMMM yyyy')}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{i === 0 ? 'Active Budget' : 'Previous Limit'}</p>
                            </div>
                        </div>
                        <span className="font-black text-xl text-slate-900 flex-shrink-0">₹{b.amount.toLocaleString()}</span>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 text-slate-300">
                    <p className="font-black uppercase tracking-widest text-xs">No historical data yet</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
