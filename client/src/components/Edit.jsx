import React, { useState } from "react";
import axios from "axios";

const Edit = ({ item, onClose }) => {
  // Initialize formData with item's data
  const [formData, setFormData] = useState({
    product_name: item.product_name,
    description: item.description,
    description_big: item.description_big,
    price: item.price,
  });

  // Function to update formData based on input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
  };

  // Function to handle form submission
  const handleEdit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.put(
        `http://localhost:5000/editItem/${item._id}`,
        formData
      );
      alert(`Item "${formData.product_name}" updated successfully!`);
      onClose();
    } catch (error) {
      console.error("There was an error updating the item!", error);
      alert("Failed to update item. Please try again.");
    }
    window.location.reload(); 
  };

  return (
    <div className="edit-form">
      <div className="edit-info">
        <form className="edit-wrapper" onSubmit={handleEdit}>
          <div className="edit-header">
            <h2>Edit Product</h2>
            <button className="edit-close-button" onClick={onClose}>
              X
            </button>
          </div>
          <img
            className="edit-img"
            src={`${item.imagePath}`} // imagePath URL
            alt={`${item.product_name}'s image`}
          />
          <label>Product Name:</label>
          <input
            name="product_name"
            placeholder="Product Name"
            value={formData.product_name}
            onChange={handleChange}
          />

          <label>Description:</label>
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Description Long:</label>
          <textarea
            name="description_big"
            className="description_big"
            placeholder="Description Long"
            value={formData.description_big}
            onChange={handleChange}
          />

          <label>Price:</label>
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <button className="edit-button" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
