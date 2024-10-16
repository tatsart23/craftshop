import React from 'react';

const Modal = ({ item, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{item.product_name}</h2>
        <p>{item.description}</p>
        <p>Price: {item.price} €</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
