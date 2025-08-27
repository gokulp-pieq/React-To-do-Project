import { useState } from "react";
import Login from "./login";
import Todo from "./todo";

function App() {
  // user is either a string (username) or null
  const [user, setUser] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear saved user
    setUser(null); // switch back to Login screen
  };

  return (
    <div className="app-container">
      {user ? (
        <Todo user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
