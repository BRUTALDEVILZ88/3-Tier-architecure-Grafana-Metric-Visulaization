import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const logMsgs = [
  ["OK", "Health check passed"],
  ["INFO", "Scaling ECS task to 2"],
  ["WARN", "Worker queue depth high"],
  ["OK", "Cache refreshed"],
  ["INFO", "Deploy complete"],
  ["OK", "DB connection pool OK"],
];

function pad(n) { return n < 10 ? "0" + n : n; }

function getTime() {
  const d = new Date();
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

export default function App() {
  const [data, setData] = useState(null);
  const [clock, setClock] = useState(getTime());
  const [logs, setLogs] = useState([
    { t: "09:01:12", lvl: "OK",   msg: "ECS task started" },
    { t: "09:01:15", lvl: "OK",   msg: "Backend connected" },
    { t: "09:01:18", lvl: "INFO", msg: "CloudWatch active" },
    { t: "09:02:01", lvl: "OK",   msg: "App healthy" },
  ]);
  const reqChartRef = useRef(null);
  const cpuChartRef = useRef(null);
  const reqChartInstance = useRef(null);
  const cpuChartInstance = useRef(null);
  const logBoxRef = useRef(null);

  const reqCount = useRef(Math.floor(Math.random() * 400 + 500));
  const latency  = useRef(Math.floor(Math.random() * 20 + 38));
  const cpu      = useRef(Math.floor(Math.random() * 15 + 42));

  useEffect(() => {
    axios.get("/api/message")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    const clockTimer = setInterval(() => setClock(getTime()), 1000);

    const logTimer = setInterval(() => {
      const [lvl, msg] = logMsgs[Math.floor(Math.random() * logMsgs.length)];
      setLogs((prev) => [...prev, { t: getTime(), lvl, msg }]);
    }, 3500);

    return () => { clearInterval(clockTimer); clearInterval(logTimer); };
  }, []);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!reqChartRef.current) return;
    if (reqChartInstance.current) reqChartInstance.current.destroy();
    reqChartInstance.current = new Chart(reqChartRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Requests",
          data: [312, 480, 390, 520, 610, 430, reqCount.current],
          borderColor: "#d966b0",
          backgroundColor: "rgba(252,232,245,0.5)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#d966b0",
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "#fdf0f6" }, ticks: { color: "#9b7aa8", font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { color: "#9b7aa8", font: { size: 10 } } },
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!cpuChartRef.current) return;
    if (cpuChartInstance.current) cpuChartInstance.current.destroy();
    cpuChartInstance.current = new Chart(cpuChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["frontend", "backend", "auth", "worker"],
        datasets: [{
          data: [32, 28, 22, 18],
          backgroundColor: ["#d966b0", "#7c3aed", "#0f766e", "#f59e0b"],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
  }, []);

  const s = {
    dash: { background: "#fdf0f6", minHeight: "100vh", padding: "22px 20px", fontFamily: "'Inter', sans-serif", color: "#2c1a2e" },
    navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "13px 18px", background: "white", borderRadius: "18px", border: "1px solid #f5c6e0" },
    brand: { display: "flex", alignItems: "center", gap: "9px", fontSize: "17px", fontWeight: "600", color: "#c0359c" },
    navRight: { display: "flex", alignItems: "center", gap: "10px" },
    badgeGreen: { display: "flex", alignItems: "center", gap: "5px", padding: "6px 13px", borderRadius: "50px", fontSize: "12px", fontWeight: "500", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
    badgePink:  { display: "flex", alignItems: "center", gap: "5px", padding: "6px 13px", borderRadius: "50px", fontSize: "12px", fontWeight: "500", background: "#fce8f5", color: "#a0267e",  border: "1px solid #f0a8d8" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "18px" },
    statCard: { background: "white", borderRadius: "16px", border: "1px solid #f5c6e0", padding: "16px 18px" },
    statVal: { fontSize: "26px", fontWeight: "600", color: "#c0359c", lineHeight: "1.1" },
    statLabel: { fontSize: "12px", color: "#9b7aa8", marginTop: "3px" },
    statTrend: { fontSize: "11px", marginTop: "6px", color: "#166534" },
    mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
    card: { background: "white", borderRadius: "18px", border: "1px solid #f5c6e0", padding: "20px" },
    cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
    cardTitleRow: { display: "flex", alignItems: "center", gap: "9px" },
    cardTitle: { fontSize: "14px", fontWeight: "600", color: "#2c1a2e" },
    infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #fdf0f6", fontSize: "12.5px" },
    infoLbl: { color: "#9b7aa8", fontWeight: "500" },
    infoVal: { color: "#2c1a2e", fontWeight: "500" },
    statusOk: { display: "inline-flex", alignItems: "center", gap: "5px", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "4px 11px", borderRadius: "50px", fontSize: "12px", fontWeight: "500", marginBottom: "13px" },
    bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
    infraItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "10px", background: "#fdf0f6", marginBottom: "6px", fontSize: "12.5px", fontWeight: "500", color: "#2c1a2e" },
    terminal: { background: "#1e0a2e", borderRadius: "12px", padding: "14px", fontFamily: "monospace", fontSize: "11.5px", lineHeight: "1.9", maxHeight: "160px", overflowY: "auto" },
  };

  const iconBox = (bg, color) => ({ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: bg, color });
  const dot = (color) => ({ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" });
  const pillOk   = { fontSize: "10px", padding: "2px 8px", borderRadius: "50px", fontWeight: "500", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" };
  const pillWarn = { fontSize: "10px", padding: "2px 8px", borderRadius: "50px", fontWeight: "500", background: "#fefce8", color: "#854d0e", border: "1px solid #fde047" };

  const pipeSteps = [
    { label: "Source", done: true,  active: false, icon: "✓" },
    { label: "Build",  done: true,  active: false, icon: "✓" },
    { label: "Test",   done: true,  active: false, icon: "✓" },
    { label: "Deploy", done: false, active: true,  icon: "🚀" },
    { label: "Verify", done: false, active: false, icon: "🛡" },
  ];

  const services = [
    { name: "frontend", pct: 94,  color: "#d966b0", status: "#22c55e" },
    { name: "backend",  pct: 99,  color: "#d966b0", status: "#22c55e" },
    { name: "auth",     pct: 97,  color: "#d966b0", status: "#22c55e" },
    { name: "worker",   pct: 78,  color: "#f59e0b", status: "#facc15" },
    { name: "database", pct: 100, color: "#0f766e", status: "#22c55e" },
  ];

  const infra = [
    { name: "ECS Fargate",    ok: true  },
    { name: "Load Balancer",  ok: true  },
    { name: "Docker",         ok: true  },
    { name: "CloudWatch",     ok: true  },
    { name: "Jenkins",        ok: false },
  ];

  const logLvlStyle = (lvl) => {
    if (lvl === "OK")   return { fontSize: 10.5, padding: "1px 5px", borderRadius: 4, fontWeight: 600, background: "#052e16", color: "#86efac" };
    if (lvl === "WARN") return { fontSize: 10.5, padding: "1px 5px", borderRadius: 4, fontWeight: 600, background: "#431407", color: "#fdba74" };
    return                    { fontSize: 10.5, padding: "1px 5px", borderRadius: 4, fontWeight: 600, background: "#3c1860", color: "#f0a8d8" };
  };

  return (
    <div style={s.dash}>
      {/* Navbar */}
      <div style={s.navbar}>
        <div style={s.brand}>
          ☁️ CloudOps Dashboard
          <span style={{ fontSize: 11, color: "#9b7aa8", fontWeight: 400, marginLeft: 4 }}>v2.0</span>
        </div>
        <div style={s.navRight}>
          <span style={{ fontSize: 12, color: "#9b7aa8" }}>{clock}</span>
          <div style={s.badgeGreen}><span style={dot("#22c55e")}></span> ECS Healthy</div>
          <div style={s.badgePink}><span style={{ ...dot("#d966b0"), animation: "pulse 1.4s infinite" }}></span> 3 services live</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={s.statsRow}>
        {[
          { icon: "📡", val: reqCount.current.toLocaleString(), label: "Total requests",    trend: "↑ +12.4% today",  color: "#c0359c" },
          { icon: "⏱",  val: latency.current + "ms",            label: "Avg latency",       trend: "↓ -3ms yesterday", color: "#7c3aed" },
          { icon: "🖥",  val: cpu.current + "%",                 label: "CPU utilization",   trend: "↑ +5% spike 2h ago", color: "#0f766e" },
          { icon: "☁️", val: "99.97%",                           label: "Uptime (30d)",      trend: "✓ SLA target met", color: "#e11d6a" },
        ].map((c) => (
          <div key={c.label} style={s.statCard}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ ...s.statVal, color: c.color }}>{c.val}</div>
            <div style={s.statLabel}>{c.label}</div>
            <div style={s.statTrend}>{c.trend}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={s.mainGrid}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#fce8f5", "#c0359c")}>📈</div>
              <span style={s.cardTitle}>Request throughput</span>
            </div>
            <span style={{ fontSize: 11, color: "#9b7aa8" }}>last 7 days</span>
          </div>
          <div style={{ position: "relative", width: "100%", height: 160 }}>
            <canvas ref={reqChartRef} />
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#f0eaff", "#7c3aed")}>📡</div>
              <span style={s.cardTitle}>Backend status</span>
            </div>
          </div>
          <div style={s.statusOk}>✓ Connected & healthy</div>
          {[
            ["Message",     data?.message   || "Loading..."],
            ["Application", data?.app       || "CloudOps App"],
            ["Status",      data?.status    || "Active"],
            ["Region",      "ap-south-1"],
            ["Timestamp",   data?.timestamp || new Date().toLocaleString()],
          ].map(([lbl, val]) => (
            <div key={lbl} style={s.infoRow}>
              <span style={s.infoLbl}>{lbl}</span>
              <span style={{ ...s.infoVal, color: lbl === "Status" ? "#d966b0" : "#2c1a2e", fontSize: lbl === "Timestamp" ? 11 : 12.5 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline + Service health */}
      <div style={s.mainGrid}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#fff4ee", "#c45d1a")}>🔀</div>
              <span style={s.cardTitle}>CI/CD pipeline</span>
            </div>
            <span style={{ ...s.badgePink, fontSize: 10, padding: "3px 9px" }}>Build #84</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {pipeSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                    background: step.done ? "#f0fdf4" : step.active ? "#fce8f5" : "#fdf0f6",
                    border: `2px solid ${step.done ? "#86efac" : step.active ? "#f0a8d8" : "#f5c6e0"}`,
                    color: step.done ? "#166534" : step.active ? "#c0359c" : "#9b7aa8",
                  }}>{step.icon}</div>
                  <div style={{ fontSize: 10, color: "#9b7aa8", fontWeight: 500 }}>{step.label}</div>
                </div>
                {i < pipeSteps.length - 1 && (
                  <div style={{ height: 2, background: i < 3 ? "#86efac" : "#f5c6e0", flex: 0.5, marginBottom: 14 }} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: "#9b7aa8", display: "flex", gap: 16 }}>
            <span>🔗 feat: pink dashboard</span>
            <span>👤 pushed by you</span>
            <span>🕐 2 min ago</span>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#e0faf3", "#0f766e")}>📊</div>
              <span style={s.cardTitle}>Service health</span>
            </div>
          </div>
          {services.map((svc) => (
            <div key={svc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #fdf0f6", fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, color: "#2c1a2e", minWidth: 70 }}>
                <span style={dot(svc.status)}></span> {svc.name}
              </div>
              <div style={{ flex: 1, height: 5, borderRadius: 50, background: "#fdf0f6", margin: "0 10px" }}>
                <div style={{ height: 5, borderRadius: 50, background: svc.color, width: svc.pct + "%" }} />
              </div>
              <div style={{ fontSize: 11, color: "#9b7aa8", minWidth: 30, textAlign: "right" }}>{svc.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={s.bottomRow}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#f0eaff", "#7c3aed")}>🗂</div>
              <span style={s.cardTitle}>Infrastructure</span>
            </div>
          </div>
          {infra.map((item) => (
            <div key={item.name} style={s.infraItem}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: item.ok ? "#d966b0" : "#f59e0b" }}>{item.ok ? "✓" : "⚠"}</span>
                {item.name}
              </div>
              <span style={item.ok ? pillOk : pillWarn}>{item.ok ? "healthy" : "building"}</span>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#fff0f4", "#e11d6a")}>🍩</div>
              <span style={s.cardTitle}>CPU by service</span>
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", height: 140 }}>
            <canvas ref={cpuChartRef} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {[["#d966b0","#72243e","frontend 32%"],["#7c3aed","#3c3489","backend 28%"],["#0f766e","#0f6e56","auth 22%"],["#f59e0b","#854f0b","worker 18%"]].map(([bg, color, lbl]) => (
              <span key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: bg, display: "inline-block" }}></span>{lbl}
              </span>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitleRow}>
              <div style={iconBox("#fff4ee", "#c45d1a")}>📝</div>
              <span style={s.cardTitle}>Live logs</span>
            </div>
            <span style={{ ...s.badgePink, fontSize: 10, padding: "2px 7px" }}>{logs.length}</span>
          </div>
          <div style={s.terminal} ref={logBoxRef}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 7, marginBottom: 1 }}>
                <span style={{ color: "#d966b0", minWidth: 52, fontSize: 11 }}>{l.t}</span>
                <span style={logLvlStyle(l.lvl)}>{l.lvl}</span>
                <span style={{ color: "#f5e0f8" }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}