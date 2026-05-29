import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Activity, Clock, MapPin, ChevronDown, Download, Luggage, Info, CloudSun, Hotel, Navigation } from "lucide-react";

export default function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDay, setOpenDay] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const itineraryData = location.state?.itinerary ?? location.state;
  const tripRequest = location.state?.tripRequest ?? null;

  // ── Empty state ──────────────────────────────────────────
  if (!itineraryData || !itineraryData.days || itineraryData.days.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
          .tv-empty { min-height:100vh; background:#FAF7F2; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; font-family:'Jost',sans-serif; padding:40px; text-align:center; }
          .tv-empty-icon { width:64px; height:64px; border:1px solid #E5DED8; border-radius:2px; display:flex; align-items:center; justify-content:center; color:#C4692A; }
          .tv-empty-heading { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; color:#1C1410; }
          .tv-empty-sub { font-size:14px; color:#8B7466; font-weight:300; line-height:1.7; max-width:380px; }
          .tv-empty-btn { padding:14px 36px; background:#1C1410; color:#FAF7F2; font-family:'Jost',sans-serif; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; border:none; border-radius:2px; cursor:pointer; transition:background 0.2s; }
          .tv-empty-btn:hover { background:#C4692A; }
        `}</style>
        <div className="tv-empty">
          <div className="tv-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h1 className="tv-empty-heading">No itinerary generated yet.</h1>
          <p className="tv-empty-sub">Head back to the planner and fill in your trip details to generate a personalized Delhi itinerary.</p>
          <button className="tv-empty-btn" onClick={() => navigate("/create-trip")}>Create Trip</button>
        </div>
      </>
    );
  }

  // ── Derived stats ────────────────────────────────────────
  const totalActivities = itineraryData.days.reduce((sum, d) => sum + (d.activities?.length || 0), 0);
  const totalDays = itineraryData.days.length;
  const totalCost = itineraryData.estimated_total_cost;
  const packingCount = itineraryData.packing_list?.length || 0;

  // ── PDF Download ─────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!tripRequest) return;
    setPdfLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/trip/pdf`,
        tripRequest,
        { responseType: "blob", headers: { "Content-Type": "application/json" } }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "delhi-itinerary.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .tv-root { min-height:100vh; background:#FAF7F2; font-family:'Jost',sans-serif; }

        /* ── Header ── */
        .tv-header { background:#1C1410; color:#FAF7F2; position:relative; overflow:hidden; }
        .tv-header-bg {
          position:absolute; inset:0; z-index:0;
          background:radial-gradient(ellipse 70% 120% at 100% 50%, rgba(196,105,42,0.18) 0%, transparent 70%);
        }
        .tv-header-inner {
          position:relative; z-index:1;
          max-width:980px; margin:0 auto;
          padding:48px 40px 44px;
          display:flex; align-items:flex-end;
          justify-content:space-between; gap:24px; flex-wrap:wrap;
        }
        @media(max-width:640px){ .tv-header-inner{ padding:36px 24px 32px; } }

        .tv-eyebrow { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#C4692A; font-weight:500; margin-bottom:10px; display:block; }
        .tv-city { font-family:'Cormorant Garamond',serif; font-size:clamp(38px,5vw,64px); font-weight:300; line-height:1.05; color:#FAF7F2; }
        .tv-city em { font-style:italic; }
        .tv-subtitle { font-size:13px; color:rgba(250,247,242,0.5); margin-top:8px; font-weight:300; letter-spacing:0.03em; line-height:1.6; max-width:480px; }

        .tv-header-right { display:flex; align-items:center; gap:14px; flex-shrink:0; }

        .tv-pdf-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 22px; background:transparent; color:#FAF7F2;
          border:1px solid rgba(250,247,242,0.25); border-radius:2px;
          font-family:'Jost',sans-serif; font-size:12px;
          letter-spacing:0.12em; text-transform:uppercase; font-weight:400;
          cursor:pointer; transition:background 0.2s, border-color 0.2s;
        }
        .tv-pdf-btn:hover:not(:disabled) { background:rgba(196,105,42,0.15); border-color:#C4692A; }
        .tv-pdf-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .tv-pdf-spinner { width:12px; height:12px; border:1.5px solid rgba(250,247,242,0.3); border-top-color:#FAF7F2; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        .tv-strip { height:4px; background:linear-gradient(90deg,#C4692A 0%,#E8943A 40%,#C4692A 100%); }

        /* ── Main ── */
        .tv-main { max-width:980px; margin:0 auto; padding:52px 40px 80px; }
        @media(max-width:640px){ .tv-main{ padding:32px 20px 60px; } }

        /* ── Top Stats ── */
        .tv-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#E5DED8; border:1px solid #E5DED8; border-radius:2px; overflow:hidden; margin-bottom:48px; }
        @media(max-width:640px){ .tv-stats{ grid-template-columns:repeat(2,1fr); } }
        .tv-stat-item { background:#fff; padding:20px 22px; }
        .tv-stat-label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#B5A49A; font-weight:500; margin-bottom:6px; }
        .tv-stat-val { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:#1C1410; }

        /* ── Section Title ── */
        .tv-section-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; color:#1C1410; margin-bottom:22px; }
        .tv-section-title em { font-style:italic; }

        /* ── Info Cards ── */
        .tv-info-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:48px; }
        .tv-info-card { background:#fff; border:1px solid #E5DED8; border-radius:2px; padding:24px; transition:border-color 0.2s; }
        .tv-info-card:hover { border-color:#C4692A; }
        .tv-info-card-header { display:flex; align-items:center; gap:9px; margin-bottom:12px; }
        .tv-info-card-icon { color:#C4692A; }
        .tv-info-card-label { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#8B7466; font-weight:500; }
        .tv-info-card-body { font-size:14px; color:#3D2E28; font-weight:300; line-height:1.75; }

        /* ── Packing List ── */
        .tv-packing { margin-bottom:48px; }
        .tv-pills { display:flex; flex-wrap:wrap; gap:8px; margin-top:4px; }
        .tv-pill { padding:8px 16px; background:#fff; border:1px solid #DDD4CC; border-radius:2px; font-size:13px; font-weight:300; color:#3D2E28; letter-spacing:0.02em; transition:border-color 0.18s, color 0.18s; }
        .tv-pill:hover { border-color:#C4692A; color:#C4692A; }

        /* ── Day Accordion ── */
        .tv-day { margin-bottom:10px; border:1px solid #E5DED8; border-radius:2px; overflow:hidden; background:#fff; }

        .tv-day-header {
          width:100%; padding:18px 24px;
          display:flex; justify-content:space-between; align-items:center;
          background:#1C1410; color:#FAF7F2;
          border:none; cursor:pointer; font-family:'Jost',sans-serif;
          transition:background 0.2s;
        }
        .tv-day-header:hover { background:#2A1E18; }
        .tv-day-header.open { background:#C4692A; }

        .tv-day-left { display:flex; flex-direction:column; gap:3px; text-align:left; }
        .tv-day-num { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#FAF7F2; line-height:1; }
        .tv-day-date { font-size:12px; color:rgba(250,247,242,0.55); font-weight:300; letter-spacing:0.04em; }
        .tv-day-budget { font-size:11px; color:rgba(250,247,242,0.7); font-weight:400; letter-spacing:0.06em; }

        .tv-chevron { transition:transform 0.25s; color:rgba(250,247,242,0.7); flex-shrink:0; }
        .tv-chevron.open { transform:rotate(180deg); }

        .tv-day-body { padding:24px; }

        .tv-sub-heading {
          font-size:11px; letter-spacing:0.18em; text-transform:uppercase;
          color:#C4692A; font-weight:500;
          display:flex; align-items:center; gap:8px;
          margin-bottom:14px; padding-bottom:12px;
          border-bottom:1px solid #EDE8E3;
        }

        .tv-cards { display:flex; flex-direction:column; gap:10px; }

        .tv-card {
          background:#FAF7F2; border:1px solid #EDE8E3; border-radius:2px;
          padding:18px 20px; transition:border-color 0.2s;
        }
        .tv-card:hover { border-color:#C4692A; }

        .tv-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:10px; }
        .tv-card-name { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:#1C1410; line-height:1.2; }
        .tv-card-desc { font-size:13px; color:#6B5A50; font-weight:300; line-height:1.7; margin-bottom:12px; }

        .tv-card-meta { display:flex; flex-wrap:wrap; gap:10px 20px; }
        .tv-card-row { display:flex; align-items:center; gap:6px; font-size:12px; color:#8B7466; font-weight:300; }
        .tv-card-row svg { opacity:0.55; flex-shrink:0; color:#C4692A; }

        .tv-cost-badge {
          flex-shrink:0; background:#1C1410; color:#FAF7F2;
          border-radius:2px; padding:6px 12px; text-align:right;
          font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:600;
          white-space:nowrap;
        }
        .tv-cost-badge span { display:block; font-family:'Jost',sans-serif; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(250,247,242,0.45); font-weight:300; margin-bottom:2px; }
      `}</style>

      <div className="tv-root">

        {/* ── Header ── */}
        <header className="tv-header">
          <div className="tv-header-bg" />
          <div className="tv-header-inner">
            <div>
              <span className="tv-eyebrow">AI-Generated Itinerary</span>
              <h1 className="tv-city">Delhi <em>AI Itinerary</em></h1>
              <p className="tv-subtitle">Personalized travel plan generated using AI, weather intelligence, and real-time travel research.</p>
            </div>
            <div className="tv-header-right">
              <button
                className="tv-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={pdfLoading || !tripRequest}
                title={!tripRequest ? "Trip request data unavailable" : ""}
              >
                {pdfLoading ? <span className="tv-pdf-spinner" /> : <Download size={14} />}
                {pdfLoading ? "Generating…" : "Download PDF"}
              </button>
            </div>
          </div>
        </header>
        <div className="tv-strip" />

        <main className="tv-main">

          {/* ── Top Stats ── */}
          <div className="tv-stats">
            <div className="tv-stat-item">
              <p className="tv-stat-label">Estimated Cost</p>
              <p className="tv-stat-val">₹{totalCost?.toLocaleString()}</p>
            </div>
            <div className="tv-stat-item">
              <p className="tv-stat-label">Days Planned</p>
              <p className="tv-stat-val">{totalDays}</p>
            </div>
            <div className="tv-stat-item">
              <p className="tv-stat-label">Activities</p>
              <p className="tv-stat-val">{totalActivities}</p>
            </div>
            <div className="tv-stat-item">
              <p className="tv-stat-label">Packing Items</p>
              <p className="tv-stat-val">{packingCount}</p>
            </div>
          </div>

          {/* ── Summary Info Cards ── */}
          <h2 className="tv-section-title">Trip <em>Overview</em></h2>
          <div className="tv-info-grid">
            {itineraryData.summary && (
              <div className="tv-info-card">
                <div className="tv-info-card-header">
                  <Info size={15} className="tv-info-card-icon" />
                  <span className="tv-info-card-label">Summary</span>
                </div>
                <p className="tv-info-card-body">{itineraryData.summary}</p>
              </div>
            )}
            {itineraryData.accommodation_suggestion && (
              <div className="tv-info-card">
                <div className="tv-info-card-header">
                  <Hotel size={15} className="tv-info-card-icon" />
                  <span className="tv-info-card-label">Accommodation</span>
                </div>
                <p className="tv-info-card-body">{itineraryData.accommodation_suggestion}</p>
              </div>
            )}
            {itineraryData.transportation_advice && (
              <div className="tv-info-card">
                <div className="tv-info-card-header">
                  <Navigation size={15} className="tv-info-card-icon" />
                  <span className="tv-info-card-label">Transportation</span>
                </div>
                <p className="tv-info-card-body">{itineraryData.transportation_advice}</p>
              </div>
            )}
            {itineraryData.weather_advice && (
              <div className="tv-info-card">
                <div className="tv-info-card-header">
                  <CloudSun size={15} className="tv-info-card-icon" />
                  <span className="tv-info-card-label">Weather Advice</span>
                </div>
                <p className="tv-info-card-body">{itineraryData.weather_advice}</p>
              </div>
            )}
          </div>

          {/* ── Packing List ── */}
          {itineraryData.packing_list?.length > 0 && (
            <div className="tv-packing">
              <h2 className="tv-section-title">What To <em>Carry</em></h2>
              <div className="tv-pills">
                {itineraryData.packing_list.map((item, i) => (
                  <span key={i} className="tv-pill">{item}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Day Accordion ── */}
          <h2 className="tv-section-title">Your <em>Day-by-Day</em> Plan</h2>

          {itineraryData.days.map((day, index) => {
            const isOpen = openDay === index;
            return (
              <div key={index} className="tv-day">
                <button
                  className={`tv-day-header${isOpen ? " open" : ""}`}
                  onClick={() => setOpenDay(openDay === index ? -1 : index)}
                >
                  <div className="tv-day-left">
                    <p className="tv-day-num">Day {day.day}</p>
                    {day.date && <p className="tv-day-date">{day.date}</p>}
                    {day.day_budget != null && (
                      <p className="tv-day-budget">Budget ₹{day.day_budget?.toLocaleString()}</p>
                    )}
                  </div>
                  <ChevronDown size={18} className={`tv-chevron${isOpen ? " open" : ""}`} />
                </button>

                {isOpen && (
                  <div className="tv-day-body">
                    <>
                    <p className="tv-sub-heading">
  🍽 Meals
</p>

<div className="tv-cards">

  <div className="tv-card">
    <p className="tv-card-name">Breakfast</p>

    <p className="tv-card-desc">
      {day.breakfast.restaurant}
    </p>

    <div className="tv-card-meta">
      <div className="tv-card-row">
        Dish: {day.breakfast.dish}
      </div>

      <div className="tv-card-row">
        Cost: ₹{day.breakfast.estimated_cost}
      </div>
    </div>
  </div>

  <div className="tv-card">
    <p className="tv-card-name">Lunch</p>

    <p className="tv-card-desc">
      {day.lunch.restaurant}
    </p>

    <div className="tv-card-meta">
      <div className="tv-card-row">
        Dish: {day.lunch.dish}
      </div>

      <div className="tv-card-row">
        Cost: ₹{day.lunch.estimated_cost}
      </div>
    </div>
  </div>

  <div className="tv-card">
    <p className="tv-card-name">Dinner</p>

    <p className="tv-card-desc">
      {day.dinner.restaurant}
    </p>

    <div className="tv-card-meta">
      <div className="tv-card-row">
        Dish: {day.dinner.dish}
      </div>

      <div className="tv-card-row">
        Cost: ₹{day.dinner.estimated_cost}
      </div>
    </div>
  </div>

</div>
                    </>
                    {(day.activities || []).length > 0 && (
                      <>
                        <p className="tv-sub-heading"><Activity size={13} />Activities</p>
                        <div className="tv-cards">
                          {day.activities.map((activity, idx) => (
                            <div key={idx} className="tv-card">
                              <div className="tv-card-top">
                                <p className="tv-card-name">{activity.place}</p>
                                {activity.estimated_cost != null && (
                                  <div className="tv-cost-badge">
                                    <span>Cost</span>
                                    ₹{activity.estimated_cost?.toLocaleString()}
                                  </div>
                                )}
                              </div>
                              {activity.description && (
                                <p className="tv-card-desc">{activity.description}</p>
                              )}
                              <div className="tv-card-meta">
                                {activity.transport_mode && (
                                  <div className="tv-card-row">
                                    <Navigation size={12} />
                                    {activity.transport_mode}
                                  </div>
                                )}
                              
                                {activity.duration_hours != null && (
                                  <div className="tv-card-row">
                                    <Clock size={12} />
                                    {activity.duration_hours} hrs
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </main>
      </div>
    </>
  );
}