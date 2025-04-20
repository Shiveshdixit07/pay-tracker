import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionDetails from "./TransactionDetails";
import Dashboard from "./Dashboard";
import "./CSS/App.css";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const [currUserEmail, setCurrUserEmail] = useState(null);
  const [currUserName, setCurrUserName] = useState(null);
  const [currUserPhoneNumber, setCurrUserPhoneNumber] = useState(null);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setCurrUserEmail={setCurrUserEmail}
              setCurrUserName={setCurrUserName}
              setCurrUserPhoneNumber={setCurrUserPhoneNumber}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              UserEmail={currUserEmail}
              userName={currUserName}
              userPhoneNumber={currUserPhoneNumber}
            />
          }
        />
        <Route path="/group/:groupName" element={<TransactionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
