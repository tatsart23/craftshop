import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal"; // Modal component
import Edit from "./Edit"; // Edit component
import { useAuth } from "./AuthProvider"; // Authentication context
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { Bars } from "react-loading-icons";

const Store = () => {
  const [storeData, setStoreData] = useState([]); // Store data fetched from backend
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for the modal
  const [editItem, setEditItem] = useState(null); // Selected item for editing
  const [loading, setLoading] = useState(false); // Loading state
  const auth = useAuth(); // Auth token from authentication context

  // Fetch store data from the server when the component mounts
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true); // Set loading state to true
      try {
        const response = await axios.get("http://localhost:5000/getStore");
        if (Array.isArray(response.data)) {
          setStoreData(response.data); // Set the fetched store data
        } else {
          console.error("Data is not an array:", response.data);
        }
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchStoreData();
  }, []);

  const toggleEdit = (item) => {
    if (editItem) {
      setSelectedItem(null); // Clear selected item when closing modal
    } else {
      setSelectedItem(item); // Set the selected item when opening modal
    }
    setEditItem(!editItem); // Toggle modal open/close state
  };

  const toggleModal = (item) => {
    if (modalOpen) {
      setSelectedItem(null); // Clear selected item when closing modal
    } else {
      setSelectedItem(item); // Set the selected item when opening modal
    }
    setModalOpen(!modalOpen); // Toggle modal open/close state
  };

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
        image: item.imagePath,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
    Swal.fire({
      background: "#ffef76",
      text: "Tuote lisätty ostoskoriin!",
      buttonsStyling: false,
      confirmButtonColor: "#ff6550",
      icon: "success",
      customClass: {
        confirmButton: "buy-button",
        popup: "popup-class",
      },
      button: "Close",
    }).then(() => {
      window.location.reload();
    });
  };

  const deleteItem = (item) => {
    console.log("Deleting item with ID:", item._id); // Lisää loki ID:stä
    axios
      .delete(`http://localhost:5000/deleteItem/${item._id}`)
      .then((response) => {
        Swal.fire({
          background: "#ffef76",
          text: "Tuote poistettu!",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: "buy-button",
            popup: "popup-class",
          },
          button: "Close",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("There was an error deleting the item!", error);
        alert(
          `Error deleting item: ${
            error.response?.data?.error || "Unknown error"
          }`
        );
      });
  };

  return (
    <div>
      <h1>Store</h1>
      <div className="store-container">
        {loading ? (
          <Bars color="#ff6550" /> // Show loading spinner
        ) : storeData.length > 0 ? (
          <ul className="store-wrapper">
            {storeData.map((item) => (
              <li key={item._id} onClick={() => toggleModal(item)}>
                {item.imagePath && (
                  <img
                    src={`${item.imagePath}`}
                    alt={`${item.product_name}'s image`}
                  />
                )}
                <p>Tuote: {item.product_name}</p>
                <p>Kuvaus: {item.description}</p>
                <p>Hinta: {item.price} €</p>
                {auth.token ? (
                  <div className="admin-btns">
                    <button
                      className="store-admin-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEdit(item);
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="store-admin-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                ) : null}

                <button
                  className="buy-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
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
        <Modal
          item={selectedItem}
          onClose={toggleModal}
          addToCart={addToCart}
        />
      )}
      {editItem && selectedItem && (
        <Edit item={selectedItem} onClose={toggleEdit} editItem={editItem} />
      )}
    </div>
  );
};

export default Store;
