"use client";
import { useState, useEffect } from "react";

const NAV_LINKS = [];

const API_BASE = "http://localhost:8000";

const FEATURE_CARDS = [
  {
    href: "/create-trip",
    img: "https://cdn.vectorstock.com/i/500p/21/15/taj-mahal-indian-monument-vector-59802115.jpg",
    title: "AI-Powered Itinerary Generation",
    tag: "Core Feature",
    days: "Multi-Day",
    desc: "Create personalized multi-day travel plans tailored to your budget, cuisine preferences, and travel style.",
  },
  {
    href: "/create-trip",
    img: "https://img.magnific.com/premium-vector/india-building-architecture-scenery_18591-50010.jpg?semt=ais_hybrid&w=740&q=80",
    title: "Weather-Aware Planning",
    tag: "Live Intelligence",
    days: "Real-Time",
    desc: "Live weather intelligence helps recommend suitable activities, packing suggestions, and travel precautions.",
  },
  {
    href: "/create-trip",
    img: "https://media.istockphoto.com/id/928865756/vector/red-fort-new-delhi-india-detailed-vector-sketch-illustration.jpg?s=612x612&w=0&k=20&c=vsJQV6HRg6A3ddjgAAd5eOIelT_6c9Ps7fuoeob2EWE=",
    title: "Real-Time Travel Search",
    tag: "Web Search",
    days: "Always Current",
    desc: "Google Search integration keeps recommendations informed with current attractions, events, and travel insights.",
  },
  {
    href: "/create-trip",
    img: "https://cdn.vectorstock.com/i/1000v/50/49/indian-building-monuments-icon-cartoon-vector-25975049.jpg",
    title: "Budget Optimization",
    tag: "Smart Finance",
    days: "Cost-Aware",
    desc: "Automatically adjusts plans to maximize value while staying within your budget constraints.",
  },
];

const REVIEWS = [
  { name: "Ananya R.", city: "Beta User · Bangalore", text: "The itinerary it generated for my Delhi trip was incredibly detailed — it even factored in the weather and suggested what to pack. Genuinely impressed.", stars: 5 },
  { name: "Dev K.", city: "Early Access · Hyderabad", text: "As a solo traveler on a tight budget, having the AI optimize my plan to fit my spending limit was exactly what I needed. Saved me hours of research.", stars: 5 },
  { name: "Shreya T.", city: "Student Traveler · Pune", text: "The PDF export was a lifesaver — I had a clean, shareable itinerary ready before my flight. The food recommendations alone were worth it.", stars: 5 },
];

function StarRating({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#C4692A", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Reusable auth modal — handles its own submit state + error display so
// the login and signup forms don't duplicate this logic.
// ---------------------------------------------------------------------
function AuthModal({ mode, onClose, onSwitchMode, onSuccess }) {
  const isSignup = mode === "signup";
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const endpoint = isSignup ? "/signup" : "/login";
    const payload = isSignup
      ? fields
      : { email: fields.email, password: fields.password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // non-JSON response body — fall through to generic error below
      }

      if (!res.ok) {
        // FastAPI's HTTPException puts the message in `detail`
        setError(data.detail || data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      if (isSignup) {
        // Signed up successfully — send them straight into the login form
        onSwitchMode("login", { email: fields.email });
        setSubmitting(false);
        return;
      }

      onSuccess(data.user || { email: fields.email });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,9,5,0.72)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="jost"
        style={{
          background: "#1C1410",
          border: "1px solid rgba(250,247,242,0.08)",
          borderRadius: 8,
          width: 400,
          maxWidth: "100%",
          padding: "36px 32px 32px",
          position: "relative",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "transparent",
            border: "none",
            color: "rgba(250,247,242,0.45)",
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
            padding: 4,
          }}
        >
          ×
        </button>

        <span style={{ width: 40, height: 2, background: "#C4692A", display: "block", marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: "#FAF7F2", marginBottom: 6 }}>
          {isSignup ? "Create an account" : "Welcome back"}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(250,247,242,0.5)", marginBottom: 28, fontWeight: 300 }}>
          {isSignup ? "Start planning your Delhi trip with AI." : "Log in to pick up where you left off."}
        </p>

        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(196,60,42,0.12)",
              border: "1px solid rgba(196,60,42,0.35)",
              color: "#E38E7E",
              fontSize: 13,
              padding: "11px 14px",
              borderRadius: 4,
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={fieldLabelStyle}>Name</span>
              <input
                required
                value={fields.name}
                onChange={update("name")}
                placeholder="Your full name"
                style={inputStyle}
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: 14 }}>
            <span style={fieldLabelStyle}>Email</span>
            <input
              required
              type="email"
              value={fields.email}
              onChange={update("email")}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: 6 }}>
            <span style={fieldLabelStyle}>Password</span>
            <input
              required
              type="password"
              minLength={isSignup ? 8 : undefined}
              value={fields.password}
              onChange={update("password")}
              placeholder={isSignup ? "At least 8 characters" : "Your password"}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: 20,
              opacity: submitting ? 0.6 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? (isSignup ? "Creating account…" : "Logging in…") : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: "rgba(250,247,242,0.5)", textAlign: "center", marginTop: 22 }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
            style={{
              background: "none",
              border: "none",
              color: "#C4692A",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              padding: 0,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

const fieldLabelStyle = {
  display: "block",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(250,247,242,0.55)",
  marginBottom: 6,
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 4,
  border: "1px solid rgba(250,247,242,0.14)",
  background: "#241A12",
  color: "#FAF7F2",
  fontSize: 14,
  outline: "none",
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"

  const [user, setUser] = useState(null); // null while logged out, { email } once known
  const [authChecked, setAuthChecked] = useState(false);

  // Check whether a session cookie is already valid on page load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        // network error / not logged in — leave user as null
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  const openModal = (mode, prefill) => {
    setAuthModal(mode);
  };

  return (
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#FAF7F2", color: "#1C1410", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .jost { font-family: 'Jost', sans-serif; }
        .btn-primary {
          display: inline-block;
          background: #C4692A;
          color: #FAF7F2;
          padding: 14px 36px;
          border-radius: 2px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s, transform 0.15s;
          border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #A3541F; transform: translateY(-1px); }
        .btn-ghost {
          display: inline-block;
          background: transparent;
          color: #FAF7F2;
          padding: 13px 34px;
          border-radius: 2px;
          border: 1px solid rgba(250,247,242,0.5);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 400;
          transition: background 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .btn-ghost:hover { background: rgba(250,247,242,0.1); border-color: #FAF7F2; }
        .trip-card {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s, box-shadow 0.3s;
          display: block;
        }
        .trip-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(28,20,16,0.12); }
        .trip-card img { transition: transform 0.5s; }
        .trip-card:hover img { transform: scale(1.04); }
        .divider-line { width: 48px; height: 2px; background: #C4692A; display: block; }
        .feature-num { font-size: 72px; font-weight: 300; color: #EDCFB8; line-height: 1; font-family: 'Cormorant Garamond', serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .hero-animate { animation: fadeUp 1s ease both; }
        .hero-animate-d1 { animation-delay: 0.15s; }
        .hero-animate-d2 { animation-delay: 0.35s; }
        .hero-animate-d3 { animation-delay: 0.55s; }
        .nav-link {
          font-family:'Jost',sans-serif; font-size:13px; letter-spacing:0.08em; text-transform:uppercase;
          color: rgba(250,247,242,0.8); text-decoration:none; transition:color 0.2s; padding: 4px 0;
          border-bottom: 1px solid transparent;
        }
        .nav-link:hover { color: #FAF7F2; border-bottom-color: #C4692A; }
        .review-card { background: #fff; border-radius: 4px; padding: 32px; border-left: 3px solid #C4692A; }
        input, textarea, select { font-family: 'Jost', sans-serif !important; }
        input:focus {
          border-color: #C4692A !important;
          box-shadow: 0 0 0 3px rgba(196,105,42,0.18);
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(28,20,16,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background 0.3s",
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: "#FAF7F2", letterSpacing: "0.04em" }}>
            Plan<span style={{ color: "#C4692A" }}>My</span>Trip
          </span>
        </a>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map(l => <a key={l} href="#" className="nav-link">{l}</a>)}
        </div>

        {/* Auth-aware nav actions: skip rendering until we know the auth state,
            to avoid a Login/Signup flash for users who are already logged in. */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 180, justifyContent: "flex-end" }}>
          {!authChecked ? null : user ? (
            <>
              <span className="jost" style={{ color: "rgba(250,247,242,0.7)", fontSize: 13 }}>
                {user.email}
              </span>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => openModal("login")}>Login</button>
              <button className="btn-primary" onClick={() => openModal("signup")}>Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://cdn.wallpapersafari.com/87/95/96lTr4.png"
            alt="Taj Mahal India"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,6,4,0.55) 0%, rgba(28,20,16,0.75) 60%, rgba(28,20,16,0.92) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, padding: "0 24px" }}>
          <p className="jost hero-animate" style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C4692A", marginBottom: 24, fontWeight: 500 }}>
            Powered by LangGraph + RAG
          </p>
          <h1 className="hero-animate hero-animate-d1" style={{
            fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 300, lineHeight: 1.05,
            color: "#FAF7F2", letterSpacing: "-0.01em", marginBottom: 12
          }}>
            AI Travel Planning<br /><em style={{ fontWeight: 300, fontStyle: "italic" }}>for Modern Explorers</em>
          </h1>
          <p className="jost hero-animate hero-animate-d2" style={{ fontSize: 16, color: "rgba(250,247,242,0.72)", lineHeight: 1.8, maxWidth: 560, margin: "24px auto 48px", fontWeight: 300 }}>
            Generate personalized Delhi itineraries using AI, live weather intelligence, local travel knowledge, and real-time web search.
          </p>
          <div className="hero-animate hero-animate-d3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/create-trip" className="btn-primary">Create My Trip</a>
            <a href="#how" className="btn-ghost">See How It Works</a>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, rgba(196,105,42,0.8), transparent)", margin: "0 auto" }} />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: "#1C1410", padding: "32px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[["1 City", "Supported · Delhi"], ["4 Layers", "AI Intelligence Stack"], ["PDF", "Export Ready"], ["Day-by-Day", "Personalized Plans"]].map(([val, label], i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px", borderRight: i < 3 ? "1px solid rgba(250,247,242,0.08)" : "none" }}>
              <p style={{ fontSize: 32, fontWeight: 600, color: "#C4692A", letterSpacing: "-0.02em" }}>{val}</p>
              <p className="jost" style={{ fontSize: 12, color: "rgba(250,247,242,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding: "100px 40px", background: "#FAF7F2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <span className="divider-line" style={{ marginBottom: 20 }} />
            <p className="jost" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4692A", marginBottom: 12, fontWeight: 500 }}>Platform Capabilities</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, lineHeight: 1.1, maxWidth: 480 }}>
              What the AI <em style={{ fontStyle: "italic" }}>Does for You</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {FEATURE_CARDS.map((t, i) => (
              <a key={i} href={t.href} className="trip-card">
                <div style={{ overflow: "hidden", height: 260, position: "relative" }}>
                  <img src={t.img} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(28,20,16,0.7) 0%, transparent 60%)"
                  }} />
                  <span className="jost" style={{
                    position: "absolute", top: 16, left: 16,
                    background: "rgba(196,105,42,0.92)", color: "#FAF7F2",
                    fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "5px 12px", borderRadius: 2, fontWeight: 500
                  }}>{t.tag}</span>
                  <span className="jost" style={{
                    position: "absolute", bottom: 16, right: 16,
                    color: "rgba(250,247,242,0.85)", fontSize: 12, letterSpacing: "0.08em"
                  }}>{t.days}</span>
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{t.title}</h3>
                  <p className="jost" style={{ fontSize: 14, color: "#6B5A50", lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "#1C1410", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 72, textAlign: "center" }}>
            <p className="jost" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4692A", marginBottom: 16, fontWeight: 500 }}>The Process</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: "#FAF7F2", lineHeight: 1.1 }}>
              Three Steps to Your<br /><em style={{ fontStyle: "italic" }}>Perfect Itinerary</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(250,247,242,0.06)" }}>
            {[
              { n: "01", title: "Tell Us About Your Trip", body: "Enter destination, travel dates, budget, traveller count, cuisine preferences, and any special requirements you have in mind." },
              { n: "02", title: "AI Researches Everything", body: "LangGraph coordinates RAG retrieval from Delhi's travel knowledge base, fetches live weather data, and searches the web for current travel intelligence." },
              { n: "03", title: "Receive Your Personalized Plan", body: "Get a structured day-by-day itinerary with attractions, transportation advice, food recommendations, cost estimates, and packing guidance — ready to export as PDF." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#1C1410", padding: "56px 40px" }}>
                <span className="feature-num">{s.n}</span>
                <span className="divider-line" style={{ margin: "24px 0 20px", background: "#C4692A" }} />
                <h3 style={{ fontSize: 24, fontWeight: 600, color: "#FAF7F2", marginBottom: 16, lineHeight: 1.2 }}>{s.title}</h3>
                <p className="jost" style={{ fontSize: 14, color: "rgba(250,247,242,0.55)", lineHeight: 1.9, fontWeight: 300 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ background: "#FAF7F2", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <span className="divider-line" style={{ marginBottom: 20 }} />
              <p className="jost" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4692A", marginBottom: 16, fontWeight: 500 }}>Why Plan My Trip</p>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 32 }}>
                Built on Modern<br /><em>AI Infrastructure</em>
              </h2>
              <p className="jost" style={{ fontSize: 15, color: "#6B5A50", lineHeight: 1.9, fontWeight: 300, marginBottom: 40 }}>
                Generic travel apps give you lists. We give you a journey. LangGraph orchestrates a multi-step AI pipeline — retrieval, weather, search, planning, and optimization — into a single coherent travel plan.
              </p>
              {[
                ["LangGraph Workflow Orchestration", "Multi-step AI workflow combining retrieval, weather intelligence, web search, planning, and budget optimization in sequence."],
                ["ChromaDB Travel Knowledge Base", "Retrieval-Augmented Generation powered by a curated Delhi travel knowledge base for hyper-relevant local recommendations."],
                ["Structured AI Outputs", "Schema-driven itinerary generation ensures reliable, consistently formatted plans you can actually follow."],
                ["PDF Export Ready", "Download your complete travel itinerary in a clean, shareable PDF — ready before you board."],
              ].map(([title, body], i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4692A", marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{title}</p>
                    <p className="jost" style={{ fontSize: 14, color: "#6B5A50", lineHeight: 1.7, fontWeight: 300 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYnx-7pUOZdww-3CErdHnm_olkYAms5seELcg1S354MF3lzr-xTxqI0v_l&s=10"
                alt="India travel"
                style={{ width: "100%", height: 520, objectFit: "cover", borderRadius: 4 }}
              />
              <div style={{
                position: "absolute", bottom: -24, left: -24,
                background: "#C4692A", padding: "28px 32px", borderRadius: 4, maxWidth: 240
              }}>
                <p style={{ fontSize: 28, fontWeight: 600, color: "#FAF7F2", lineHeight: 1.2 }}>LangGraph</p>
                <div style={{ width: 36, height: 2, background: "rgba(250,247,242,0.4)", margin: "10px 0" }} />
                <p className="jost" style={{ color: "rgba(250,247,242,0.8)", fontSize: 12, fontWeight: 300 }}>FastAPI · ChromaDB · Groq · OpenWeather · Serper</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ background: "#F2ECE4", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="jost" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4692A", marginBottom: 16, fontWeight: 500 }}>Early Feedback</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, lineHeight: 1.1 }}>
              What beta users <em style={{ fontStyle: "italic" }}>are saying</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <StarRating count={r.stars} />
                <p style={{ fontSize: 18, lineHeight: 1.7, margin: "16px 0 24px", fontStyle: "italic", fontWeight: 300 }}>"{r.text}"</p>
                <div>
                  <p className="jost" style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</p>
                  <p className="jost" style={{ fontSize: 12, color: "#8B7466", fontWeight: 300 }}>{r.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: "relative", padding: "120px 40px", textAlign: "center", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1800&q=80"
            alt="India"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(12,7,4,0.78)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <p className="jost" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4692A", marginBottom: 20, fontWeight: 500 }}>Your Journey Awaits</p>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, color: "#FAF7F2", lineHeight: 1.05, marginBottom: 24 }}>
            Start Planning Your<br /><em style={{ fontStyle: "italic" }}>Delhi Trip in Minutes</em>
          </h2>
          <p className="jost" style={{ fontSize: 16, color: "rgba(250,247,242,0.65)", lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>
            Let AI handle research, budgeting, weather analysis, and itinerary creation — while you focus on the experience.
          </p>
          <a href="/create-trip" className="btn-primary" style={{ fontSize: 13, padding: "16px 48px" }}>
            Generate My Trip
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0E0905", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(250,247,242,0.08)",
              paddingBottom: 32,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#FAF7F2",
              }}
            >
              Plan<span style={{ color: "#C4692A" }}>My</span>Trip
            </span>

            <button
              onClick={() => setShowContact(true)}
              className="jost"
              style={{
                background: "transparent",
                border: "1px solid rgba(250,247,242,0.2)",
                color: "#FAF7F2",
                padding: "10px 20px",
                cursor: "pointer",
                borderRadius: "8px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              Contact
            </button>
          </div>

          <p
            className="jost"
            style={{
              fontSize: 12,
              color: "rgba(250,247,242,0.25)",
              textAlign: "center",
              fontWeight: 300,
              lineHeight: 2,
            }}
          >
            © 2025 PlanMyTrip · Built with LangGraph · FastAPI · ChromaDB · Groq · OpenWeather · Serper
            <br />
            Created by <strong>Ritik Saini (IIIT Bhubaneswar)</strong>
          </p>
        </div>

        {showContact && (
          <div
            onClick={() => setShowContact(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#1A130D",
                padding: "30px",
                borderRadius: "16px",
                width: "400px",
                color: "#FAF7F2",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Contact Developer</h2>
              <p>📞 <strong>Phone:</strong> 8929892878</p>
              <p>
                📧 <strong>Email:</strong>{" "}
                <a href="mailto:ritiksaini022006@gmail.com" style={{ color: "#C4692A" }}>
                  ritiksaini022006@gmail.com
                </a>
              </p>
              <p>
                💼 <strong>LinkedIn:</strong>{" "}
                <a href="https://www.linkedin.com/in/ritik-sa0201/" target="_blank" rel="noreferrer" style={{ color: "#C4692A" }}>
                  View Profile
                </a>
              </p>
              <button
                onClick={() => setShowContact(false)}
                style={{
                  marginTop: "20px",
                  background: "#C4692A",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </footer>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(mode) => setAuthModal(mode)}
          onSuccess={(u) => {
            setUser(u);
            setAuthModal(null);
          }}
        />
      )}
    </main>
  );
}