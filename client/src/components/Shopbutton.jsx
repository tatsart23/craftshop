import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Shopbutton = ({ totalItems }) => {
  const navigate = useNavigate(); 

  const goToCart = () => {
    navigate('/cart'); 
  };

  return (
    <div 
      className='shop-button'
      onClick={goToCart}
    >
      <ShoppingCartIcon />
      {totalItems > 0 && (
        <span 
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '5px 10px',
            fontSize: '12px'
          }}
        >
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default Shopbutton;
