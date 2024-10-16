import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";
import Shopbutton from "./Shopbutton";

const Store = () => {
  const [storeData, setStoreData] = useState([]);

  const auth = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5000/getStore")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setStoreData(response.data);
        } else {
          console.error("Data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === item._id);

    if (itemIndex !== -1) {

      cart[itemIndex].quantity += 1;
    } 
    else {
    cart.push({
      id: item._id,
      name: item.product_name,
      price: item.price,
      quantity: 1,
    })};
    
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Item added to cart:", item);
    alert(`Item "${item.product_name}" added to cart!`);


  };

  return (
    <div>
      <h1>Store</h1>
      <div className="store-container">
        {storeData.length > 0 ? (
          <ul className="store-wrapper">
            {storeData.map((item) => (
              <li key={item._id}>
                {item.imagePath && (
                  <img
                    src={`http://localhost:5000${item.imagePath}`} // Nyt käytetään imagePath-tiedostopolkua
                    alt={`${item.product_name}'s image`}
                    
                  />
                )}
                <p>Tuote: {item.product_name}</p>
                <p>Kuvaus: {item.description}</p>
                <p>Hinta: {item.price}</p>
                {auth.token ? (<button>Edit</button>) : null} {/* Näytetään vain jos käyttäjä on kirjautunut sisään, tällä hetkellä ei toimintoa */}
                {auth.token ? (<button>Delete</button>) : null}
                <button onClick={() => addToCart(item)} >Add to cart</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <Shopbutton />
    </div>
  );
};

export default Store;
