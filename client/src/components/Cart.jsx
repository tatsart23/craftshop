import React from "react";
import {loadStripe} from "@stripe/stripe-js";


const Cart = ({
  cartItems,
  calculateTotal,
  calculateTotalItems,
  removeFromCart,
  updateQuantity,
}) => {

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51QAtQ2CTfbFpWnW85jm2MzvGiza1XSJFsaNmk32gc3wqtzBxolwcgLLxpVUP9hHuBzQVNHaYzeyVHrVtBRlWJ55l00peRBW44x")
    const body = {
      products: cartItems
    }
    console.log(body)
    const headers = {
      "Content-Type": "application/json"
    }
    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
    const session = await response.json()
    const result = await stripe.redirectToCheckout({sessionId: session.id})
  }


  return (
    <div>
      <h1>Your Cart</h1>
      <h3>Total Price: {calculateTotal()}</h3>
      <p>Total items: {calculateTotalItems()}</p>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-wrapper">
              <div className="cart-img">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={`${item.product_name}'s image`}
                />
              </div>
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    min="1"
                  />
                </p>
                <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}         
        </div>
      )}
      <button onClick={makePayment}>Checkout</button>
    </div>
  );
};

export default Cart;
