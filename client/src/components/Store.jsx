import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Modal component
import { useAuth } from './AuthProvider'; // Authentication context

const Store = () => {
  const [storeData, setStoreData] = useState([]); // Store data fetched from backend
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for the modal
  const auth = useAuth(); // Auth token from authentication context

  // Fetch store data from the server when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/getStore")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setStoreData(response.data); // Set the fetched store data
        } else {
          console.error("Data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // Toggle modal visibility and set the selected item
  const toggleModal = (item) => {
    if (modalOpen) {
      setSelectedItem(null); // Clear selected item when closing modal
    } else {
      setSelectedItem(item); // Set the selected item when opening modal
    }
    setModalOpen(!modalOpen); // Toggle modal open/close state
  };

  // Add item to the cart (saved in localStorage)
  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === item._id);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1; // Increment the quantity if the item exists
    } else {
      cart.push({
        id: item._id,
        name: item.product_name,
        price: item.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
    alert(`Item "${item.product_name}" added to cart!`); // Confirmation message
    window.location.reload(); // Reload the page to update the cart
  };

  return (
    <div>
      <h1>Store</h1>
      <div className="store-container">
        {storeData.length > 0 ? (
          <ul className="store-wrapper">
            {storeData.map((item) => (
              <li key={item._id} onClick={() => toggleModal(item)}>
                {/* Display modal only for the selected item */}
                {item.imagePath && (
                  <img
                    src={`http://localhost:5000${item.imagePath}`} // Use imagePath for the image URL
                    alt={`${item.product_name}'s image`}
                  />
                )}
                <p>Tuote: {item.product_name}</p>
                <p>Kuvaus: {item.description}</p>
                <p>Hinta: {item.price} €</p>
                {auth.token ? <button>Edit</button> : null} {/* Only show Edit if the user is authenticated */}
                {auth.token ? <button>Delete</button> : null}
                <button className="buy-button" onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering modal on button click
                  addToCart(item);
                }}>
                  Add to cart
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
      
      {/* Render Modal only when it's open */}
      {modalOpen && selectedItem && (
        <Modal item={selectedItem} onClose={toggleModal} addToCart={addToCart} />
      )}
    </div>
  );
};

export default Store;
