import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://beefocusapp.onrender.com";

export default function App() {
  const WORK = 25 * 60;
  const BREAK = 5 * 60;

  const [time, setTime] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [focus, setFocus] = useState(0);

  const beep = new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
  );

  // 📥 load focus from backend
  useEffect(() => {
    async function loadFocus() {
      const res = await axios.get(API + "/focus");
      setFocus(res.data.focusSessions);
    }
    loadFocus();
  }, []);

  // 💾 load saved timer
  useEffect(() => {
    const saved = localStorage.getItem("befocus-time");
    if (saved) setTime(Number(saved));
  }, []);

  // 💾 save timer
  useEffect(() => {
    localStorage.setItem("befocus-time", time);
  }, [time]);

  // ⏱ TIMER
  useEffect(() => {
    let interval = null;

    if (running) {
      interval = setInterval(() => {
        setTime((t) => {
          if (t === 0) {
            handleEnd();
            return isWork ? BREAK : WORK;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, isWork]);

  // 🔥 session end
  async function handleEnd() {
    setIsWork(!isWork);

    // 🔔 sound
    beep.play();

    // 📊 update backend focus
    if (isWork) {
      const res = await axios.post(API + "/focus");
      setFocus(res.data.focusSessions);
    }
  }

  function format(t) {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔥 BeFocus PRO</h1>

        <p style={styles.mode}>
          {isWork ? "💻 Focus Mode" : "☕ Break Time"}
        </p>

        <div style={styles.timer}>{format(time)}</div>

        <button
          onClick={() => setRunning(!running)}
          style={styles.button}
        >
          {running ? "Pause" : "Start"}
        </button>

        <p style={styles.stats}>📊 Focus sessions: {focus}</p>
      </div>
    </div>
  );
}

/* 🌈 BEFOCUS STYLE */
const styles = {
  body: {
    background: "radial-gradient(circle at top, #0a0a0a, #000)",
    color: "white",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 40,
    borderRadius: 20,
    textAlign: "center",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 40px rgba(0,255,150,0.1)",
    width: 320,
  },

  title: {
    fontSize: 28,
    marginBottom: 10,
  },

  mode: {
    opacity: 0.7,
  },

  timer: {
    fontSize: 90,
    fontWeight: "bold",
    margin: "20px 0",
  },

  button: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#00ff99",
    color: "#000",
    fontWeight: "bold",
  },

  stats: {
    marginTop: 15,
    opacity: 0.8,
  },
};