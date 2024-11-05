import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import Carousel from "./Carousel";
import { slides } from "../data/carouselData.json";
import Post from "./Post";
import axios from "axios";


const Home = () => {
  const auth = useAuth();
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getCarousel");
        setCarouselData(response.data);
        console.log("Haettu carouselData:", response.data);
      } catch (error) {
        console.error("Virhe dataa haettaessa:", error);
      }
    };
    fetchCarouselData();
  }, []);


  return (
    <div className="home-container">
      <Carousel data={carouselData} />
      <h1 className="welcome-text">Tervetuloa kauppaamme</h1>

      <h2 className="post-title">Uusimmat postaukset</h2>
      <Post />
      
    </div>
  );
};

export default Home;
