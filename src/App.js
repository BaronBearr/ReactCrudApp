import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AddUser from './components/AddProduct';
import EditUser from './components/EditProduct';
import History from './components/History';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/history/:id' element={<History />} />
        <Route path='/edit/:id' element={<EditUser />} />
        {/*<Route path='/create' element={<AddUser />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
