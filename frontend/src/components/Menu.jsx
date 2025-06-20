import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";

/* ----  You can add / remove pages in one place  ---- */
const NAV_ITEMS = [
  { id: "home",       label: "Home", path: "/" },
  { id: "necklaces",  label: "Necklaces", path: "/necklaces" },
  { id: "earrings",   label: "Earrings", path: "/earrings" },
  { id: "bracelets",  label: "Bracelets", path: "/bracelets" },
];

export default function Navigation() {
  /* --------------- state --------------- */
  const [isDrawerOpen, setOpen]   = useState(false);
  const [isDesktop, setDesktop]   = useState(window.innerWidth >= 768);

  /* --------------- handlers --------------- */
  const handleResize = useCallback(() => {
    const wide = window.innerWidth >= 768;
    setDesktop(wide);
    if (wide) setOpen(false);    // always close drawer on desktop
  }, []);

  const toggleDrawer = () => setOpen((o) => !o);

  const handleNavClick = () => {
    if (!isDesktop) setOpen(false);   // close on mobile
  };

  /* --------------- effects --------------- */
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  /* Prevent body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
  }, [isDrawerOpen]);

  /* --------------- render --------------- */
  return (
    <header className="nav-container">
      <div className="nav-content">
        {!isDesktop && (
          <Hamburger open={isDrawerOpen} onToggle={toggleDrawer} />
        )}

        <nav
          className={
            isDesktop
              ? "nav-bar"
              : `nav-drawer ${isDrawerOpen ? "show" : ""}`
          }
        >
          {NAV_ITEMS.map(({ id, label, path }) => (
            <NavLink
              key={id}
              to={path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                isDesktop
                  ? `nav-link ${isActive ? "active" : ""}`
                  : `drawer-link ${isActive ? "active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ---- hamburger ---- */
function Hamburger({ open, onToggle }) {
  return (
    <button
      aria-label="Toggle navigation"
      aria-expanded={open}
      className={`hamburger ${open ? "open" : ""}`}
      onClick={onToggle}
    >
      <span />
      <span />
      <span />
    </button>
  );
}