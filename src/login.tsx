import { useState } from "react";

type LoginProps = {
  onLogin: (user: string) => void;
};

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) return;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (isSignup) {
      if (users[username]) {
        alert("User already exists. Please login.");
      } else {
        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful! Please login.");
        setIsSignup(false);
      }
    } else {
      if (users[username] && users[username] === password) {
        localStorage.setItem("user", username);
        onLogin(username);
      } else {
        alert("Invalid username or password.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}

export default Login;
