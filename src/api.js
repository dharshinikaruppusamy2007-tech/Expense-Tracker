import mockApi from './mockApi';

const api = {
  get: (url) => {
    if (url === '/expenses') return mockApi.getExpenses();
    if (url === '/goals') return mockApi.getGoals();
    if (url === '/reminders') return mockApi.getReminders();
    if (url === '/ai/alerts') return mockApi.getAlerts();
    if (url === '/ai/suggestions') return mockApi.getSuggestions();
    if (url === '/ai/prediction') return mockApi.getPrediction();
    if (url === '/budgets') return mockApi.getBudgets();
    return Promise.reject('URL NOT FOUND');
  },
  post: (url, data) => {
    if (url === '/auth/register') return mockApi.register(data);
    if (url === '/auth/login') return mockApi.login(data);
    if (url === '/expenses') return mockApi.addExpense(data);
    if (url === '/goals') return mockApi.addGoal(data);
    if (url === '/reminders') return mockApi.addReminder(data);
    if (url === '/budgets') return mockApi.addBudget(data);
    return Promise.reject('URL NOT FOUND');
  },
  put: (url, data) => {
    if (url.includes('/goals/') && url.includes('/add-savings')) {
        const id = parseInt(url.split('/')[2]);
        const amount = url.split('amount=')[1];
        return mockApi.addSavings(id, amount);
    }
    return Promise.reject('URL NOT FOUND');
  },
  delete: (url) => {
    const parts = url.split('/');
    const id = parseInt(parts[parts.length - 1]);
    if (url.includes('/expenses/')) return mockApi.deleteExpense(id);
    if (url.includes('/goals/')) return mockApi.deleteGoal(id);
    if (url.includes('/reminders/')) return mockApi.deleteReminder(id);
    return Promise.reject('URL NOT FOUND');
  }
};

export default api;
