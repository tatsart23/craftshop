import React, {useState} from "react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0);

  return (
    <div className="carousel">
      <ArrowBackIosNewOutlinedIcon className="arrow left-arrow" />
      {data.map((item, index) => (
        <div key={index} style={{maxWidth:"1200px"}}>
          <img src={item.src} alt={item.alt} className={slide === index ? "slide" :"slide slide-hidden"} />
        </div>
      ))}
      <ArrowForwardIosOutlinedIcon className="arrow right-arrow" />
      <span className="indicators">
        {data.map((item, index) => (
          <button key={index} onClick={null} className="indicator"></button>
        ))}
      </span>
    </div>
  );
};

export default Carousel;
