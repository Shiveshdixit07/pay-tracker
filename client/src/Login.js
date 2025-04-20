import React, { useState } from "react";
import { login } from "./api/api";
import { useNavigate } from "react-router-dom";
import styles from "./CSS/Login.module.css";
const Login = ({
  setCurrUserEmail,
  setCurrUserName,
  setCurrUserPhoneNumber,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await login({ email, password });
      localStorage.setItem("token", data.token);
      setCurrUserEmail(email);
      setCurrUserName(data.name);
      setCurrUserPhoneNumber(data.phoneNumber);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Login failed!");
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Welcome Back!</h2>
        <input
          type="email"
          placeholder="Email Address"
          className={styles.inputField}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.inputField}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.loginBtn} onClick={handleLogin}>
          Login
        </button>

        <div className={styles.signupContainer}>
          <p>New User?</p>
          <button className={styles.signupBtn} onClick={handleSignup}>
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
