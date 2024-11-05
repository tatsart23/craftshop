import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Post = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getPost");
        console.log("Haettu postData:", response.data); // Tulostetaan haettu data
        setPostData(response.data); // Asetetaan haettu data tilaan
      } catch (error) {
        console.error("Virhe dataa haettaessa:", error);
      }
    };
    fetchPost();
  }, []);

  return (
    <section>
      <div className="post-wrapper">
        <div className="post-content">
          {postData && postData.length > 0 ? (
            postData.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-header">
                {post.imagePath && (
                  <img src={`${post.imagePath}`} alt={post.title} />
                )}
                <h2>{post.title}</h2>
                </div>
                <div className="post-para">
                <p>{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Ladataan...</p> // Näytetään latausviesti, jos data ei ole vielä saatavilla
          )}
        </div>
      </div>
    </section>
  );
};

export default Post;
