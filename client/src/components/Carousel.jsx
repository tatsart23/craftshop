import React, { useState, useEffect } from "react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

const Carousel = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval); 
  }, [data.length]);

  return (
    <div className="carousel-container">
      {data.map((slide, index) => (
        <div key={index} className={currentSlide === index ? "slide active-anim" : "slide"}>
          <img src={slide.src} alt={slide.title} />
        </div>
      ))}

      {/* Nuolinäppäimet */}
      <button className="arrow left-arrow" onClick={prevSlide}>
        <ArrowBackIosNewOutlinedIcon />
      </button>
      <button className="arrow right-arrow" onClick={nextSlide}>
        <ArrowForwardIosOutlinedIcon />
      </button>

      {/* Pisteet */}
      <div className="dots">
        {data.map((___, index) => (
          <span
            key={index}
            className={currentSlide === index ? "dot dot-active" : "dot"}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
