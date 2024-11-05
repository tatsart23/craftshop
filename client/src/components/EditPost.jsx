import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EditPost = ({ item, onClose, onUpdate }) => {
  // Alustetaan lomakedata item's data perusteella
  const [formData, setFormData] = useState({
    title: item.title || "", // Asetetaan tyhjät merkkijonot varalta
    content: item.content || "",
    imagePath: item.imagePath || ""
  });

  // Päivitä lomakedata input-muutosten perusteella
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Käsittele lomakkeen lähetys
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/editPost/${item._id}`,
        formData
      );
      Swal.fire({
        background: "#ffef76",
        text: "Postaus päivitetty!",
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
      onUpdate(response.data); // Päivitetään postData, jotta muutokset näkyvät
      onClose(); // Suljetaan modaalikomponentti
    } catch (error) {
      console.error("Error updating post!", error);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="edit-form">
      <div className="edit-info">
        <form className="edit-wrapper" onSubmit={handleEdit}>
          <div className="edit-header">
            <h2>Muokkaa päivitystä</h2>
            <button className="edit-close-button" onClick={onClose}>
              X
            </button>
          </div>
          <img
            className="edit-img"
            src={`${item.imagePath}`}
            alt={`${item.title}'s image`}
          />
          <label>Otsikko:</label>
          <input
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>Sisältö:</label>
          <textarea
            name="content"
            className="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
          />

          <label>Kuva:</label>
          <input
            name="imagePath"
            type="text"
            placeholder="Image URL"
            value={formData.imagePath}
            onChange={handleChange}
          />

          <button className="edit-button" type="submit">
            Päivitä
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
