import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const success = await login(name, password); // ✅ AWAIT

    if (!success) {
      setError("Invalid name or password");
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: 100 }}>
        Task Management System
      </h1>

      <div className="login-box">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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
    </>
  );
}