import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const success = await login(name, password);

    if (!success) {
      setError("Invalid name or password");
    }
  };

  return (
    <div className="login-page">
      <h1 className="app-title">Task Management System</h1>

      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Please login to your account</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={submitHandler}>
          <input
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}