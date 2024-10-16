import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Store from './components/Store';
import Container from './components/Container';
import Add from './components/Add';
import Login from './components/Login';
import AuthProvider from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';
import Cart from './components/tempCart';


function App() {

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/store" element={<Store />} />
            <Route element={<PrivateRoute />} > {/*piilotetaan linkit jos käyttäjä ei ole kirjautunut sisään käyttämällä private route komponenttia*/}
              <Route path="/add" element={<Add />} />
              <Route path="/logout" element={<Logout />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
          
        </Container>
        
      </AuthProvider>
    </Router>
  );
}

export default App;