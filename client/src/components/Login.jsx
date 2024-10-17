import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const auth = useAuth();

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      auth.loginAction(input);
      return;
    }
    alert("Please fill in the form");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container ">
      <img src="/img/lehdet.png" alt="" />
      <form onSubmit={handleSubmitEvent}>
        <div className="form-control">
          <label htmlFor="username"><h2>Username:</h2></label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            aria-describedby="username"
            aria-invalid="false"
            onChange={handleInput}
          />
          <div id="user-email" className="sr-only"></div>
        </div>
        <div className="form-control">
          <label htmlFor="password"><h2>Password:</h2></label>
          <input
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            aria-describedby="user-password"
            aria-invalid="false"
            onChange={handleInput}
          />
          <div id="user-password" className="sr-only"></div>
        </div>
        <button className="btn-submit">Login</button>
      </form>
      <img src="/img/lehdet.png" alt="" />
    </div>
  );
};

export default Login;
