// Utility functions for localStorage management

export const STORAGE_KEYS = {
  USERS: 'eduport_users',
  CURRENT_USER: 'eduport_current_user',
  PORTFOLIOS: 'eduport_portfolios',
  FEEDBACK: 'eduport_feedback'
};

// Initialize mock data
export const initializeMockData = () => {
  // Initialize users if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const mockUsers = [
      {
        id: '1',
        email: 'student1@edu.com',
        password: 'student123',
        role: 'student',
        name: 'John Doe'
      },
      {
        id: '2',
        email: 'student2@edu.com',
        password: 'student123',
        role: 'student',
        name: 'Jane Smith'
      },
      {
        id: 'admin',
        email: 'admin@edu.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }

  // Initialize portfolios if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIOS)) {
    const mockPortfolios = [
      {
        id: '1',
        studentId: '1',
        studentName: 'John Doe',
        title: 'E-Commerce Website',
        description: 'A full-stack e-commerce platform with payment integration',
        status: 'testing',
        milestones: [
          { id: '1', name: 'Idea', completed: true, date: '2024-01-15' },
          { id: '2', name: 'Prototype', completed: true, date: '2024-02-20' },
          { id: '3', name: 'Testing', completed: true, date: '2024-03-10' },
          { id: '4', name: 'Completed', completed: false, date: null }
        ],
        media: [],
        createdAt: '2024-01-10',
        updatedAt: '2024-03-10'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Jane Smith',
        title: 'Mobile App for Fitness',
        description: 'A React Native app for tracking workouts and nutrition',
        status: 'prototype',
        milestones: [
          { id: '1', name: 'Idea', completed: true, date: '2024-02-01' },
          { id: '2', name: 'Prototype', completed: true, date: '2024-03-01' },
          { id: '3', name: 'Testing', completed: false, date: null },
          { id: '4', name: 'Completed', completed: false, date: null }
        ],
        media: [],
        createdAt: '2024-02-01',
        updatedAt: '2024-03-01'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(mockPortfolios));
  }

  // Initialize feedback if not exists
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify([]));
  }
};

// User functions
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Portfolio functions
export const getPortfolios = () => {
  const portfolios = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
  return portfolios ? JSON.parse(portfolios) : [];
};

export const getPortfolioById = (id) => {
  const portfolios = getPortfolios();
  return portfolios.find(p => p.id === id);
};

export const getPortfoliosByStudentId = (studentId) => {
  const portfolios = getPortfolios();
  return portfolios.filter(p => p.studentId === studentId);
};

export const savePortfolio = (portfolio) => {
  const portfolios = getPortfolios();
  const existingIndex = portfolios.findIndex(p => p.id === portfolio.id);
  
  if (existingIndex >= 0) {
    portfolios[existingIndex] = { ...portfolio, updatedAt: new Date().toISOString() };
  } else {
    const newPortfolio = {
      ...portfolio,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    portfolios.push(newPortfolio);
  }
  
  localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
  return portfolios.find(p => p.id === (portfolio.id || portfolios[portfolios.length - 1].id));
};

export const deletePortfolio = (id) => {
  const portfolios = getPortfolios();
  const filtered = portfolios.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(filtered));
};

// Feedback functions
export const getFeedback = (portfolioId) => {
  const feedback = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  const allFeedback = feedback ? JSON.parse(feedback) : [];
  return allFeedback.filter(f => f.portfolioId === portfolioId);
};

export const addFeedback = (feedback) => {
  const allFeedback = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  const feedbacks = allFeedback ? JSON.parse(allFeedback) : [];
  const newFeedback = {
    ...feedback,
    id: Date.now().toString(),
    date: new Date().toISOString()
  };
  feedbacks.push(newFeedback);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
  return newFeedback;
};

// Initialize on load
initializeMockData();

