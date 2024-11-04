import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Käsittelee syötekenttien muutokset
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Käsittelee lomakkeen lähetyksen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Estää sivun uudelleenlatauksen

    try {
      const response = await axios.post('http://localhost:5000/addPost', formData);
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
      <form className="data-wrapper" onSubmit={handleSubmit}>
        <h2>Create Post</h2>

        <label>Title:</label>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Content:</label>
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <button type="submit" className="add-button">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
