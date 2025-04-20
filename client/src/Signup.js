import React, { useState } from "react";
import { signup } from "./api/api";
import { useNavigate } from "react-router-dom";
import styles from "./CSS/Signup.module.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phNumber, setPhoneNumber] = useState("");

  const navigate = useNavigate();

  const RedirectToLogin = () => {
    navigate("/");
  };

  const handleSignup = async () => {
    try {
      const phoneNumber = Number(phNumber);
      await signup({ email, password, name, phoneNumber });
      alert("Signup successful! Redirecting to login page.");
      RedirectToLogin();
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h2>Create an Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className={styles.inputField}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className={styles.inputField}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
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

        <button className={styles.signupBtn} onClick={handleSignup}>
          Signup
        </button>

        <div className={styles.redirectContainer}>
          <p>Already have an account?</p>
          <button className={styles.loginBtn} onClick={RedirectToLogin}>
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
