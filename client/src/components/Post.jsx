import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "./AuthProvider"; // Authentication context
import EditPost from "./EditPost"; // Importoi EditPost-komponentti

const Post = () => {
  const [postData, setPostData] = useState([]);
  const [editItem, setEditItem] = useState(null); // Tila modaalikomponentin avaamiselle
  const auth = useAuth(); // Auth token from authentication context

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getPost");
        setPostData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPost();
  }, []);

  // Poista postaus
  const handleDelete = async (id) => {
    Swal.fire({
      background: "#ffef76",
      text: "Are you sure you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton: "buy-button",
        popup: "popup-class",
        cancelButton: "cancel-button"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5000/deletePost/${id}`);
          setPostData(postData.filter((post) => post._id !== id));
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting post:", error);
          Swal.fire("Error!", "Could not delete post.", "error");
        }
      }
    });
  };

  // Avaa muokkausmodaali
  const openEditModal = (item) => {
    setEditItem(item);
  };

  // Päivitä postauksen tiedot
  const handleUpdate = (updatedPost) => {
    setPostData(postData.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <section>
      <div className="post-wrapper">
        <div className="post-content">
          {postData.length > 0 ? (
            postData.map((post) => (
              <div key={post._id} className="post-item">
                {post.imagePath && (
                  <img src={`${post.imagePath}`} alt={post.title} />
                )}
                <div className="post-para">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                </div>
                {auth.token ? (
                <div className="post-admin-buttons">
                  <button className="post-admin-btn" onClick={() => openEditModal(post)}>
                    <EditIcon />
                  </button>
                  <button className="post-admin-btn" onClick={() => handleDelete(post._id)}>
                    <DeleteOutlineIcon />
                  </button>
                </div>
                ) : null}
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {editItem && (
        <EditPost
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdate={handleUpdate}
        />
      )}
    </section>
  );
};

export default Post;
