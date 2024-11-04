import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';  // Import React hooks
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
import Cart from './components/Cart';
import Shopbutton from './components/Shopbutton';
import Success from './components/Success';
import CreatePost from './components/CreatePost';

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  // Calculate the total quantity of items in the cart
  const calculateTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Function to handle removing an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const emptyCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  // Handle changing item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  calculateTotal={calculateTotal}
                  calculateTotalItems={calculateTotalItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/success" element={<Success emptyCart={emptyCart} />} />
            <Route path="/store" element={<Store />} />
            <Route element={<PrivateRoute />}> {/*piilotetaan linkit jos käyttäjä ei ole kirjautunut sisään käyttämällä private route komponenttia*/}
              <Route path="/add" element={<Add />} />
              <Route path="/create" element={<CreatePost/>} />
              <Route path="/logout" element={<Logout />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container> 
        <Shopbutton totalItems={calculateTotalItems()} /> {/* Pass total items to Shopbutton */}
      </AuthProvider>
    </Router>
  );
}

export default App;
