import React, { useState } from "react";
import Swal from "sweetalert2";

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
          Swal.fire({
            background: "#ffef76",
            text: "Data was added successfully!",
            buttonsStyling: false,
            confirmButtonColor: "#ff6550",
            icon: "success",
            customClass: {
              confirmButton: "buy-button",
              popup: "popup-class",
            },
            button: "Close",
          });
          console.log(jsonResponse);
        } else {
          Swal.fire({
            background: "#ffef76",
            text: "No data was added!",
            buttonsStyling: false,
            confirmButtonColor: "#ff6550",
            icon: "error",
            customClass: {
              confirmButton: "buy-button",
              popup: "popup-class",
            },
            button: "Close",
          });
        }
      } else {
        Swal.fire({
          background: "#ffef76",
          text: `Failed to add data: ${jsonResponse?.error || "Unknown error"}`,
          buttonsStyling: false,
          confirmButtonColor: "#ff6550",
          icon: "error",
          customClass: {
            confirmButton: "buy-button",
            popup: "popup-class",
          },
          button: "Close",
        });
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
        <h2>Lisää tuote</h2>
        <label>Tuotteen nimi:</label>
        <input
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
        />

        <label>Kuvaus:</label>
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Kuvaus Pitkä:</label>
        <textarea
          name="description_big"
          className="description_big"
          placeholder="Description Long"
          value={formData.description_big}
          onChange={handleChange}
        />

        <label>Hinta:</label>
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <label>Kuva:</label>
        <input
          type="file"
          name="testImage"
          onChange={handleImageChange} // Handle image selection
        />

        <button type="submit" className="add-button">Tallenna</button>
      </form>
    </div>
  );
};

export default Add;
