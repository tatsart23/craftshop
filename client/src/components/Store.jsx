import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Store = () => {
    const [storeData, setStoreData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/getStore')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setStoreData(response.data);
                } else {
                    console.error('Data is not an array:', response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <h1>Store</h1>
            <div className="store-container">
            {storeData.length > 0 ? (
                <ul className='store-wrapper'>
                    {storeData.map(item => (
                        <li key={item._id}>
                            <p>First Name: {item.first_name}</p>
                            <p>Last Name: {item.last_name}</p>
                            <p>Email: {item.email}</p>
                            <p>Gender: {item.gender}</p>
                            <p>IP Address: {item.ip_address}</p>
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