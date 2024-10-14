import React, { useState } from "react";

const Add = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    ip_address: ""
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch("http://localhost:5000/addData", { // Update to correct backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert formData object to JSON
      });

      // Check if the response body exists and can be parsed as JSON
      const textResponse = await response.text();
      let jsonResponse;

      try {
        jsonResponse = JSON.parse(textResponse);
      } catch (err) {
        console.error("Failed to parse JSON:", err, textResponse);
        jsonResponse = null;
      }

      if (response.ok) {
        if (jsonResponse) {
          // Handle success response
          alert("Data added successfully!");
          console.log(jsonResponse);
        } else {
          alert("Data added, but the response is not in JSON format.");
        }
      } else {
        alert("Error: " + (jsonResponse ? jsonResponse.error : "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <form className="data-wrapper" onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <label>Second Name:</label>
        <input
          name="last_name"
          type="text"
          placeholder="Second Name"
          value={formData.last_name}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Gender:</label>
        <input
          name="gender"
          type="text"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />

        <label>IP Address:</label>
        <input
          name="ip_address"
          type="text"
          placeholder="IP Address"
          value={formData.ip_address}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Add;
