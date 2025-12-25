
const TOKEN_KEY = 'bee_carbon_token';
const USER_KEY = 'bee_user_data';

export const authService = {
 
  setSession: (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  },

  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

 
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

 
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
   
  },


  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};