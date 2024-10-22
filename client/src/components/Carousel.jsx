import React, { useState } from "react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

const Carousel = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === data.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? data.length - 1 : currentSlide - 1);
  };

  return (
    <div className="carousel-container">
      {data.map((slide, index) => (
        <div key={index} className={currentSlide === index ? "slide active-anim" : "slide"}>
          <img src={slide.src} alt={slide.title} />
        </div>
      ))}

      {/* Arrow buttons */}
      <button className="arrow left-arrow" onClick={prevSlide}>
        <ArrowBackIosNewOutlinedIcon />
      </button>
      <button className="arrow right-arrow" onClick={nextSlide}>
        <ArrowForwardIosOutlinedIcon />
      </button>

      {/* Dots */}
      <div className="dots">
        {data.map((slide, index) => (
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
