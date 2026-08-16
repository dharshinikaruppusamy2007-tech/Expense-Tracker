import React, { useState, useEffect } from 'react';
import api from '../api';
import { TrendingUp, AlertCircle, Lightbulb, Wallet, ArrowRight, Flame, Calendar, Utensils, Car, Zap, Film, ShoppingBag, Heart } from 'lucide-react';

// No longer using Chart.js for distribution

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(5); // Mocked streak for now
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [expRes, alertsRes, suggRes, predRes, budgetsRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/ai/alerts'),
        api.get('/ai/suggestions'),
        api.get('/ai/prediction'),
        api.get('/budgets')
      ]);

      setExpenses(expRes.data);
      setAlerts(alertsRes.data);
      setSuggestions(suggRes.data);
      setPrediction(predRes.data.prediction);
      
      if (budgetsRes.data.length > 0) {
        setMonthlyBudget(budgetsRes.data[0].amount);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + current.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
    }));

  const categoryConfig = {
    'Food': { icon: Utensils, color: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50' },
    'Travel': { icon: Car, color: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50' },
    'Bills': { icon: Zap, color: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-50' },
    'Entertainment': { icon: Film, color: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
    'Shopping': { icon: ShoppingBag, color: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-50' },
    'Health': { icon: Heart, color: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50' },
    'General': { icon: Wallet, color: 'bg-slate-500', text: 'text-slate-500', light: 'bg-slate-50' }
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Overview</h1>
          <div className="flex items-center mt-2 text-slate-400 font-bold text-sm uppercase tracking-widest">
            <Calendar size={16} className="mr-2" /> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="bg-orange-50 text-orange-600 px-5 py-3 rounded-2xl border border-orange-100 flex items-center shadow-soft">
                <Flame className="w-6 h-6 mr-2 fill-orange-500" />
                <span className="font-black text-lg">{streak} Day Streak</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center shadow-soft">
                <Wallet className="w-6 h-6 mr-3 text-primary-600" strokeWidth={2.5} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Spend</span>
                    <span className="font-black text-2xl text-slate-900">₹{totalSpent.toLocaleString()}</span>
                </div>
            </div>
        </div>
      </div>

      {monthlyBudget > 0 && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 flex flex-col md:flex-row items-center gap-8 card-hover">
            <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Budget Progress</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly Spending Limit</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</span>
                        <span className="text-slate-400 font-bold mx-2">/</span>
                        <span className="text-lg font-bold text-slate-500">₹{monthlyBudget.toLocaleString()}</span>
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${totalSpent > monthlyBudget ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-blue-600'}`} 
                        style={{ width: `${Math.min((totalSpent / monthlyBudget) * 100, 100)}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-3">
                    <span className={`text-xs font-black uppercase tracking-widest ${totalSpent > monthlyBudget ? 'text-red-500' : 'text-primary-600'}`}>
                        {((totalSpent / monthlyBudget) * 100).toFixed(1)}% Used
                    </span>
                    <span className="text-xs font-bold text-slate-400 italic">
                        {totalSpent > monthlyBudget ? 'Over Budget!' : `₹${(monthlyBudget - totalSpent).toLocaleString()} remaining`}
                    </span>
                </div>
            </div>
            <div className="hidden md:block w-px h-20 bg-slate-100"></div>
            <div className="flex flex-col items-center md:items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center md:text-left">Status</p>
                <div className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest ${totalSpent > monthlyBudget ? 'bg-red-50 bg-red-600 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {totalSpent > monthlyBudget ? 'Warning' : 'Healthy'}
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
            <h2 className="text-xl font-black mb-8 text-slate-800 flex items-center">
              <TrendingUp className="mr-3 text-primary-600" /> Spending Distribution
            </h2>
            <div className="space-y-6">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((cat) => {
                  const config = categoryConfig[cat.name] || categoryConfig['General'];
                  const Icon = config.icon;
                  return (
                    <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${config.light} ${config.text}`}>
                                    <Icon size={16} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-slate-700">{cat.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-black text-slate-900">₹{cat.amount.toLocaleString()}</span>
                                <span className="text-slate-400 font-bold text-xs">({cat.percentage.toFixed(0)}%)</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-50 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${config.color}`} 
                                style={{ width: `${cat.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300 font-bold uppercase tracking-widest text-sm italic">
                    <img src="https://illustrations.popsy.co/emerald/financial-report.svg" alt="no data" className="w-40 mb-4 opacity-50" />
                    No transactions recorded
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 card-hover">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-800">Recent Transactions</h2>
                <button className="text-xs font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors">See All</button>
            </div>
            <div className="space-y-4">
              {expenses.slice(0, 4).map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all cursor-default">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 font-black text-xl shadow-sm border border-slate-100">
                      {exp.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg">{exp.description || exp.category}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-xl">₹{exp.amount.toLocaleString()}</span>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-slate-300 font-bold text-center py-10 uppercase tracking-widest text-sm">Start tracking to see history</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Smart Alerts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-soft card-hover">
            <div className="flex items-center mb-6 text-red-600">
              <AlertCircle className="w-6 h-6 mr-3" strokeWidth={2.5} />
              <h2 className="text-xl font-black">Smart Alerts</h2>
            </div>
            {alerts.length > 0 ? (
              <ul className="space-y-4">
                {alerts.map((alert, i) => (
                  <li key={i} className="text-sm text-red-700 bg-red-50/70 p-4 rounded-2xl font-bold border border-red-100/50 flex items-start">
                    <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{alert.replace('⚠ ', '')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
                <p className="text-sm font-black uppercase tracking-widest mb-1">Excellent!</p>
                <p className="text-xs font-bold opacity-80">You're staying within all budgets.</p>
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl shadow-primary-200 text-white card-hover relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex items-center mb-6 relative z-10">
              <Lightbulb className="w-6 h-6 mr-3 text-white" strokeWidth={2.5} />
              <h2 className="text-xl font-black">AI Insights</h2>
            </div>
            <ul className="space-y-5 relative z-10">
              {suggestions.map((sugg, i) => (
                <li key={i} className="text-sm text-primary-50 bg-white/10 p-4 rounded-2xl font-bold backdrop-blur-sm border border-white/10">
                  <span className="leading-relaxed opacity-90">{sugg.replace('💡 ', '')}</span>
                </li>
              ))}
              {suggestions.length === 0 && <li className="text-sm font-bold opacity-80">Analyzing your patterns...</li>}
            </ul>
          </div>

          {/* AI Prediction */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white card-hover">
            <div className="flex items-center mb-5">
              <TrendingUp className="w-6 h-6 mr-3 text-primary-400" strokeWidth={2.5} />
              <h2 className="text-xl font-black">AI Prediction</h2>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50">
                <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                "{prediction.replace('🔮 ', '')}"
                </p>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">End-of-Month Forecast</p>
          </div>
        </div>

      </div>
    </div>
  );
}
