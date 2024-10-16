import React from 'react';

const Cart = ({ cartItems, calculateTotal, calculateTotalItems, removeFromCart, updateQuantity }) => {

  return (
    <div>
      <h2>Your Cart</h2>
      <p>Total items: {calculateTotalItems()}</p>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
              
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>
                Quantity: 
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                  min="1"
                />
              </p>
              <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total Price: {calculateTotal()}</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;
