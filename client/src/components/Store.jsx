import React, { useEffect, useState } from "react";
import axios from "axios";

const Store = () => {
  const [storeData, setStoreData] = useState([]);

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
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Store;
