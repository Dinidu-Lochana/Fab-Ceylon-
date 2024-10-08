import './App.css';
import LoginCustomer from './Pages/LoginCustomer';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUpCustomer from './Pages/SignUpCustomer';
import SignUpAdmin from './Pages/Admin/SignUpAdmin';
import LoginAdmin from './Pages/Admin/LoginAdmin';
import AdminDashboard from './Pages/Admin/AdminDashboard';

import { Home } from './Pages/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<LoginCustomer />}/>
          <Route path='/signup' element={<SignUpCustomer />}/>
          <Route path='/adminsignup' element={<SignUpAdmin />}/>
          <Route path='/adminlogin' element={< LoginAdmin/>}/>
          <Route path='/admindashboard' element={< AdminDashboard/>}/>

        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;