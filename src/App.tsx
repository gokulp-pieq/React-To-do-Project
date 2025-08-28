import { useState } from "react";
import Login from "./login.tsx";
import Todo from "./todo.tsx";

function App() {
  // user is either a string (username) or null
 const [user, setUser] = useState<string | null>(() => {
    // This function runs only once when component mounts
    return localStorage.getItem("user");
  });

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear saved user
    setUser(null); // switch back to Login screen
  };

  return (
    <div className="flex h-screen justify-center items-center w-full">
      {user ? (
        <Todo user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
