import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // نستخدم Router كـ alias لـ BrowserRouter
import AppRoutes from './routes/AppRoutes'; // تأكدي من أن المسار './routes/AppRoutes' صحيح

function App() {
  // مؤقتًا: نفترض أن المستخدم مسجل الدخول (isAuthenticated = true) للاختبار
  const isAuthenticated = true; 

  return (
    <Router>
      {/* تمرير حالة isAuthenticated إلى AppRoutes */}
      <AppRoutes isAuthenticated={isAuthenticated} />
    </Router>
  );
}

export default App;