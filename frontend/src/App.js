import React, { useState, useEffect } from "react";
import axios from "axios";

// Get base URL from .env
const baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  // Existing two fields
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [latestData, setLatestData] = useState(null);

  // PIN state
  const [pin, setPin] = useState("");
  const [currentPin, setCurrentPin] = useState(null);

  // --- Fetch latest data ---
  const fetchLatestData = async () => {
    try {
      const res = await axios.get(`${baseURL}/data`);
      setLatestData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch current PIN ---
  const fetchCurrentPin = async () => {
    try {
      const res = await axios.get(`${baseURL}/get-pin`);
      setCurrentPin(res.data.pin);
    } catch (err) {
      console.error(err);
      setCurrentPin(null);
    }
  };

  useEffect(() => {
    fetchLatestData();
    fetchCurrentPin();
  }, []);

  // --- Send two fields ---
  const handleSubmit = async () => {
    if (!field1 || !field2) {
      alert("Please fill both fields");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/data`, { field1, field2 });
      console.log("Response:", res.data);
      setField1("");
      setField2("");
      fetchLatestData();
    } catch (err) {
      console.error("Axios error:", err.response ? err.response.data : err.message);
      alert("Error sending data to backend");
    }
  };

  // --- Set new PIN ---
  const handleSetPin = async () => {
    if (!pin || pin.length !== 5) {
      alert("PIN must be exactly 5 digits");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/set-pin`, { pin });
      console.log(res.data);
      alert(res.data.message);
      setPin("");
      fetchCurrentPin();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error setting PIN");
    }
  };

  // --- Update existing PIN ---
  const handleUpdatePin = async () => {
    if (!pin || pin.length !== 5) {
      alert("PIN must be exactly 5 digits");
      return;
    }

    try {
      const res = await axios.put(`${baseURL}/update-pin`, { pin });
      console.log(res.data);
      alert(res.data.message);
      setPin("");
      fetchCurrentPin();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating PIN");
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h2>Send Data to Backend</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Field 1"
          value={field1}
          onChange={(e) => setField1(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Field 2"
          value={field2}
          onChange={(e) => setField2(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>
      <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
        Send
      </button>

      {latestData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Latest Data:</h3>
          <p><strong>Field 1:</strong> {latestData.field1}</p>
          <p><strong>Field 2:</strong> {latestData.field2}</p>
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>PIN Management</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="5-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleSetPin} style={{ padding: "8px 16px", marginRight: "10px" }}>
          Set PIN
        </button>
        <button onClick={handleUpdatePin} style={{ padding: "8px 16px" }}>
          Update PIN
        </button>
      </div>
      {currentPin && (
        <div>
          <strong>Current PIN:</strong> {currentPin}
        </div>
      )}
    </div>
  );
}

export default App;
