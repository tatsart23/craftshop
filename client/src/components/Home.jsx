import React from "react";
import { useAuth } from "./AuthProvider";
import Carousel from "./Carousel";
import { slides } from "../data/carouselData.json";

const Home = () => {
  const auth = useAuth();
  return (
    <div className="home-container">
      <h1 className="welcome-text">Home</h1>

      {auth.token ? (
        <>
          <p>Welcome {auth.user} </p>
        </>
      ) : (
        <p>Welcome</p>
      )}

      <Carousel data={slides} />
    </div>
  );
};

export default Home;
