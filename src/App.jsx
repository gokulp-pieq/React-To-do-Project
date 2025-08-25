import { useState } from "react";
import Login from "./login";
import Todo from "./todo";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      {user ? (
        <Todo user={user} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
