import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    axios
      .get(
        "http://Frontend-Alb-1184578340.ca-central-1.elb.amazonaws.com/api/message"
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    setVisits(Math.floor(Math.random() * 1000));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #141e30, #243b55)",
        padding: "40px",
        fontFamily: "Arial",
        color: "white",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
          alignItems: "center",
        }}
      >
        <h1>🚀 CloudOps Dashboard</h1>

        <div>
          <span
            style={{
              background: "#4caf50",
              padding: "10px 15px",
              borderRadius: "10px",
            }}
          >
            ECS Running
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h2>📡 Backend Status</h2>

          {data ? (
            <>
              <p
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                ✅ {data.message}
              </p>

              <p><strong>Application:</strong> {data.app}</p>
              <p><strong>Status:</strong> {data.status}</p>
              <p><strong>Timestamp:</strong> {data.timestamp}</p>
            </>
          ) : (
            <p>Loading backend...</p>
          )}
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h2>☁️ Infrastructure</h2>

          <ul style={{ lineHeight: "2" }}>
            <li>✅ AWS ECS Fargate</li>
            <li>✅ Internal Application Load Balancer</li>
            <li>✅ Docker Containers</li>
            <li>✅ Jenkins CI/CD Pipeline</li>
            <li>✅ CloudWatch Logging</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h2>📈 Metrics</h2>

          <p style={{ fontSize: "40px", margin: "10px 0" }}>
            {visits}
          </p>

          <p>Total Requests Processed</p>
        </div>

        {/* Card 4 */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h2>📝 Logs</h2>

          <div
            style={{
              background: "#111",
              color: "#00ff90",
              padding: "15px",
              borderRadius: "10px",
              fontFamily: "monospace",
            }}
          >
            INFO: ECS Task Started <br />
            INFO: Backend Connected <br />
            INFO: CloudWatch Active <br />
            INFO: Application Healthy
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;