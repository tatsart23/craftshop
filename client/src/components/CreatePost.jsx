import React, { useState } from 'react';
import axios from 'axios';


const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [image, setImage] = useState(null);


  // Käsittelee syötekenttien muutokset
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file
  };

  // Käsittelee lomakkeen lähetyksen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Estää sivun uudelleenlatauksen

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    if (image) {
      formDataToSend.append('testImage', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/addPost', formDataToSend);
      console.log(response.data);
      alert('Post added successfully!');
      // Tyhjennetään lomake lähetyksen jälkeen
      setFormData({ title: '', content: '' });
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  return (
    <div>
      <form className="data-wrapper" onSubmit={handleSubmit} encType='multipart/form-data'>
        <h2>Luo päivitys</h2>

        <label>Otsikko:</label>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Sisältö:</label>
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <label>Kuva:</label>
        <input type="file" name="image"
        onChange={handleImageChange}
        />

        <button type="submit" className="add-button">Tallenna</button>
      </form>
    </div>
  );
};

export default CreatePost;
