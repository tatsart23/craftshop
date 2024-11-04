import React from "react";
import { useAuth } from "./AuthProvider";
import Carousel from "./Carousel";
import { slides } from "../data/carouselData.json";
import Post from "./Post";

const Home = () => {
  const auth = useAuth();
  return (
    <div className="home-container">
      <Carousel data={slides} />
      <h1 className="welcome-text">Home</h1>

      {auth.token ? (
        <>
          <p>Welcome {auth.user} </p>
        </>
      ) : (
        <p>Welcome</p>
      )}
      <Post />
      
    </div>
  );
};

export default Home;
