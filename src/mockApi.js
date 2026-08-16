// mockApi.js - Handles all data logic using LocalStorage

const STORAGE_KEYS = {
  USERS: 'tracker_users',
  EXPENSES: 'tracker_expenses',
  GOALS: 'tracker_goals',
  REMINDERS: 'tracker_reminders',
  BUDGETS: 'tracker_budgets'
};

const getData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// AI Internal Logic
const categories = {
  'food': ['pizza', 'burger', 'lunch', 'dinner', 'restaurant', 'cafe', 'grocery', 'food'],
  'travel': ['flight', 'train', 'bus', 'uber', 'taxi', 'petrol', 'fuel', 'travel', 'trip'],
  'bills': ['electricity', 'water', 'rent', 'internet', 'recharge', 'wifi'],
  'entertainment': ['movie', 'netflix', 'game', 'spotify', 'subscription'],
  'shopping': ['clothes', 'amazon', 'flipkart', 'shoes', 'dress', 'shopping']
};

const autoCategorize = (description) => {
  if (!description) return 'General';
  const desc = description.toLowerCase();
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => desc.includes(kw))) return cat.charAt(0).toUpperCase() + cat.slice(1);
  }
  return 'General';
};

const mockApi = {
  // Auth
  register: async (userData) => {
    const users = getData(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === userData.email)) {
      throw { response: { data: { message: 'Email already registered' } } };
    }
    const newUser = { ...userData, id: Date.now() };
    users.push(newUser);
    setData(STORAGE_KEYS.USERS, users);
    return { data: { message: 'Registration successful' } };
  },

  login: async (credentials) => {
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) {
      throw { response: { data: { message: 'Invalid credentials' } } };
    }
    return { data: { token: 'mock-jwt-token', id: user.id, name: user.name, email: user.email } };
  },

  // Expenses
  getExpenses: async () => ({ data: getData(STORAGE_KEYS.EXPENSES) }),
  
  addExpense: async (expenseData) => {
    const expenses = getData(STORAGE_KEYS.EXPENSES);
    const category = expenseData.category || autoCategorize(expenseData.description);
    const newExpense = { 
      ...expenseData, 
      id: Date.now(), 
      date: new Date().toISOString(),
      category,
      isAutoDetected: !expenseData.category 
    };
    expenses.unshift(newExpense);
    setData(STORAGE_KEYS.EXPENSES, expenses);
    return { data: newExpense };
  },

  deleteExpense: async (id) => {
    const expenses = getData(STORAGE_KEYS.EXPENSES).filter(e => e.id !== id);
    setData(STORAGE_KEYS.EXPENSES, expenses);
    return { data: { success: true } };
  },

  // Goals
  getGoals: async () => ({ data: getData(STORAGE_KEYS.GOALS) }),
  
  addGoal: async (goalData) => {
    const goals = getData(STORAGE_KEYS.GOALS);
    const newGoal = { 
      ...goalData, 
      id: Date.now(), 
      savedAmount: 0,
      streak: 0,
      lastContributionDate: null,
      history: [] // To track weekly dots
    };
    goals.unshift(newGoal);
    setData(STORAGE_KEYS.GOALS, goals);
    return { data: newGoal };
  },

  addSavings: async (id, amount) => {
    const goals = getData(STORAGE_KEYS.GOALS);
    const goalIndex = goals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      const goal = goals[goalIndex];
      const today = new Date().toISOString().split('T')[0];
      const amountVal = parseFloat(amount);
      
      let newStreak = goal.streak || 0;
      if (!goal.lastContributionDate) {
        newStreak = 1;
      } else {
        const lastDate = new Date(goal.lastContributionDate);
        const currentDate = new Date(today);
        const diffInDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 1) {
          newStreak += 1;
        } else if (diffInDays > 1) {
          newStreak = 1;
        }
        // If diffInDays === 0 (same day), streak doesn't change
      }

      goal.savedAmount = (goal.savedAmount || 0) + amountVal;
      goal.streak = newStreak;
      goal.lastContributionDate = today;
      
      // Track history for weekly dots
      if (!goal.history) goal.history = [];
      if (!goal.history.includes(today)) {
        goal.history.push(today);
      }
      
      setData(STORAGE_KEYS.GOALS, goals);
      return { data: goals[goalIndex] };
    }
    return { data: null };
  },

  deleteGoal: async (id) => {
    const goals = getData(STORAGE_KEYS.GOALS).filter(g => g.id !== id);
    setData(STORAGE_KEYS.GOALS, goals);
    return { data: { success: true } };
  },

  // Reminders
  getReminders: async () => ({ data: getData(STORAGE_KEYS.REMINDERS) }),
  
  addReminder: async (reminderData) => {
    const reminders = getData(STORAGE_KEYS.REMINDERS);
    const newReminder = { ...reminderData, id: Date.now() };
    reminders.unshift(newReminder);
    setData(STORAGE_KEYS.REMINDERS, reminders);
    return { data: newReminder };
  },

  deleteReminder: async (id) => {
    const reminders = getData(STORAGE_KEYS.REMINDERS).filter(r => r.id !== id);
    setData(STORAGE_KEYS.REMINDERS, reminders);
    return { data: { success: true } };
  },

  // Budgets
  getBudgets: async () => ({ data: getData(STORAGE_KEYS.BUDGETS) }),

  addBudget: async (budgetData) => {
    const budgets = getData(STORAGE_KEYS.BUDGETS);
    const newBudget = { 
      ...budgetData, 
      id: Date.now(), 
      date: new Date().toISOString() 
    };
    budgets.unshift(newBudget);
    setData(STORAGE_KEYS.BUDGETS, budgets);
    return { data: newBudget };
  },

  // AI Insights Logic
  getAlerts: async () => {
    const expenses = getData(STORAGE_KEYS.EXPENSES);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budgets = getData(STORAGE_KEYS.BUDGETS);
    const currentLimit = budgets.length > 0 ? budgets[0].amount : 5000;
    
    const alerts = [];
    if (total > currentLimit) alerts.push("You have exceeded your overall monthly budget limit!");
    if (total > currentLimit * 0.8) alerts.push("Warning: You have utilized 80% of your current budget.");
    return { data: alerts };
  },

  getSuggestions: async () => {
    const expenses = getData(STORAGE_KEYS.EXPENSES);
    const foodSum = expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0);
    const suggestions = [
      "Try to cook at home more often to save on food expenses.",
      "Consider using public transport for short distances."
    ];
    if (foodSum > 2000) suggestions.push("Your food spending is high this month. Consider checking for discounts.");
    return { data: suggestions };
  },

  getPrediction: async () => {
    const expenses = getData(STORAGE_KEYS.EXPENSES);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const predicted = total * 1.2;
    return { data: { prediction: `Based on your current spending, you are likely to spend ₹${predicted.toFixed(2)} by the end of this month.` } };
  }
};

export default mockApi;
