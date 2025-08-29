import { useState } from "react";

type LoginProps = {
  onLogin: (user: string) => void;
};

function Login({ onLogin }: LoginProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || (isSignup && (!firstName.trim() || !lastName.trim()))) return;

    if (isSignup) {
      try {
        const response = await fetch("http://localhost:8085/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Signup failed");
          return;
        }

        alert("Signup successful! Please login.");
        setIsSignup(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again.");
      }
    } else {
      // login
      try {
        const response = await fetch("http://localhost:8085/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Invalid email or password");
          return;
        }

        const data = await response.json();
        onLogin(data.email); // store logged-in email
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
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
