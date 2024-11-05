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
    <div className="cart-container">
      <h1>Ostoskorisi</h1>
      <h3>Kokonaishinta: {calculateTotal()} €</h3>
      <p>Tuotteiden määrä: {calculateTotalItems()}</p>

      {cartItems.length === 0 ? (
        <p>Korisi on tyhjä</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-wrapper">
              <div className="cart-img">
                <img
                  src={`${item.image}`}
                  alt={`${item.product_name}'s image`}
                />
              </div>
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>Hinta: {item.price} €</p>
                <p>
                  Määrä:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    min="1"
                  />
                </p>
                <p>Summa: {(item.price * item.quantity).toFixed(2)} €</p>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>Poista</button>
              </div>
            </div>
          ))}         
        </div>
      )}
      <button onClick={makePayment} className="buy-button">Maksamaan</button>
    </div>
  );
};

export default Cart;
