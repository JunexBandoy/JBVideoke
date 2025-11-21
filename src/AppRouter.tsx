import { initializeApp } from 'firebase/app';
import { createHashRouter } from 'react-router-dom';

import App from './App';
import PlayerPage from './components/pages/Videoke/PlayerPage';
import { Login } from './login';

const firebaseConfig = {
  apiKey: 'AIzaSyAAnXZllC_J5ZHCR5w8z3JB74RIwTL2oLk',
  authDomain: 'queueing-e2d14.firebaseapp.com',
  projectId: 'queueing-e2d14',
  storageBucket: 'queueing-e2d14.firebasestorage.app',
  messagingSenderId: '138699890827',
  appId: '1:138699890827:web:336e6065c9e8c01ad4348e',
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const AppRouter = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/app',
    element: <App />,
  },
  {
    path: '/player',
    element: <PlayerPage />,
  },
]);
