import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Checking server...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/health")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Could not reach the server"));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>ClinicQ</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
