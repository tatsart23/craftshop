import React, { useState } from "react";

const Add = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    description_big: "",
    price: "",
  });

  // State to hold selected image
  const [image, setImage] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formDataToSend = new FormData();
    formDataToSend.append("product_name", formData.product_name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("description_big", formData.description_big);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("ip_address", formData.ip_address);
    if (image) {
      formDataToSend.append("testImage", image); // Append image if it exists
    }

    try {
      const response = await fetch("http://localhost:5000/addData", {
        method: "POST",
        body: formDataToSend, // Send form data as multipart
      });

      const textResponse = await response.text();
      let jsonResponse;

      try {
        jsonResponse = JSON.parse(textResponse);
      } catch (err) {
        console.error("Failed to parse JSON:", err, textResponse);
        jsonResponse = null;
      }

      if (response.ok) {
        if (jsonResponse) {
          alert("Data and image added successfully!");
          console.log(jsonResponse);
        } else {
          alert("Data added, but the response is not in JSON format.");
        }
      } else {
        alert(
          "Error: " + (jsonResponse ? jsonResponse.error : "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      
      <form
        className="data-wrapper"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Add Product</h2>
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

        <label>Image:</label>
        <input
          type="file"
          name="testImage"
          onChange={handleImageChange} // Handle image selection
        />

        <button type="submit" className="add-button">Submit</button>
      </form>
    </div>
  );
};

export default Add;
