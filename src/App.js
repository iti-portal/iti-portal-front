import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; 

function App() {
  
  const isAuthenticated = true; 

  return (
    <Router>
      <AppRoutes isAuthenticated={isAuthenticated} />
    </Router>
  );
}

export default App;