import React, { useState } from "react";
import { auth } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User registered successfully");
    } catch (error) {
      console.error(error);
      alert("Error registering user");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully");
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <div className="container d-flex flex-column gap-5 align-items-center justify-content-center vh-100">
        <h1>My super cool dashboard</h1>
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4">{isRegistering ? "Register" : "Login"}</h1>
        <div className="form-group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary btn-block mb-3"
          onClick={isRegistering ? handleRegister : handleLogin}
        >
          {isRegistering ? "Register" : "Login"}
        </button>
        <button
          className="btn btn-secondary btn-block"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
