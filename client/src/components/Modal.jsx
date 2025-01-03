import React from "react";

const Modal = ({ item, onClose, addToCart }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-img">
          <img
            src={`${item.imagePath}`} // Use imagePath for the image URL
            alt={`${item.product_name}'s image`}
          />
        </div>
        <div className="modal-info">
          <h2>{item.product_name}</h2>
          <p>{item.description_big}</p>
          <p>Hinta: {item.price} €</p>
          <button className="modal-close-button" onClick={onClose}>X</button>
          <button className="buy-button" onClick={(e) => {
                  addToCart(item);
                }}>Lisää ostoskoriin</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
