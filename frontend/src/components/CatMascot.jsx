import { useEffect, useRef, useState } from "react";
import catWalk from "../assets/cat/catwalkx2_trans.gif"; // transparent version
import catRun  from "../assets/cat/catrunx2_trans.gif";
import "../style/CatMascot.css";

const CatMascot = () => {
  const catRef = useRef(null);

  /* ──────────── state ──────────── */
  const [isRunning, setIsRunning] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [pos, setPos] = useState({ x: 60, y: window.innerHeight - 120 });
  const [visible, setVisible] = useState(window.innerWidth > 768); // desktop only

  /* ──────────── hide bubble after 4 s ──────────── */
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 4000);
    return () => clearTimeout(t);
  }, []);

  /* ──────────── toggle visibility on resize ──────────── */
  useEffect(() => {
    const handleResize = () => setVisible(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ──────────── follow mouse ──────────── */
  useEffect(() => {
    if (!visible) return;

    let target = { ...pos };
    let rafId;

    const speed = 0.08;               // 0–1, higher = snappier
    const update = () => {
      setPos((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1) {
          setIsRunning(true);
          return { x: prev.x + dx * speed, y: prev.y + dy * speed };
        }
        setIsRunning(false);
        return prev;
      });

      rafId = requestAnimationFrame(update);
    };

    const handleMove = (e) => {
      target = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMove);
    rafId = requestAnimationFrame(update);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, [visible, pos]);

  if (!visible) return null;

  return (
    <div
      ref={catRef}
      className="cat-mascot"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <img
        src={isRunning ? catRun : catWalk}
        alt="Cat Mascot"
        className="cat-img"
      />

      {showBubble && (
        <div className="cat-bubble">
          New deals daily!<br />
          Follow me to purr‑chase!
        </div>
      )}
    </div>
  );
};

export default CatMascot;
