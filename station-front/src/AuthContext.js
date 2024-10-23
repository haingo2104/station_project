// import { createContext, useState, useEffect, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     localStorage.setItem('user', JSON.stringify(user));
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();
// export default AuthContext; // Ajoutez cette ligne

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         console.log("Fetching user profile...");
//         const response = await axios.get('http://localhost:9000/profile', { withCredentials: true });
//         console.log("User profile fetched successfully:", response.data.user);
//         setUser(response.data.user);
//         setIsAdmin(response.data.user.role === 'admin');
//       } catch (error) {
//         console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, isAdmin, setUser, setIsAdmin }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('access_token');
        console.log('Token récupéré:', token);
        if (token) {
          const response = await axios.get('http://localhost:9000/profile', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }

          );
          console.log('Réponse du profil:', response.data);
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            console.error('Utilisateur non trouvé dans la réponse');
          }
        } else {
          console.warn('Aucun token trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
      } finally {
        console.log("test");
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:9000/login', { email, password }, { withCredentials: true , headers: {
        'Content-Type': 'application/json'
      } });
      console.log('Réponse de connexion:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.delete('http://localhost:9000/logout', { withCredentials: true });
      console.log("message" , response.data.message);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const value = { user, login, logout, loading, setUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


