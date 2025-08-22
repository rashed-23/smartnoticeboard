import React, { useState, useEffect } from "react";
import axios from "axios";

// Get base URL from .env
const baseURL = process.env.REACT_APP_BASE_URL;

function App() {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [latestData, setLatestData] = useState(null);

  const fetchLatestData = async () => {
    try {
      const res = await axios.get(`${baseURL}/data`);
      setLatestData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(baseURL);
    fetchLatestData();
  }, []);

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
    </div>
  );
}

export default App;
