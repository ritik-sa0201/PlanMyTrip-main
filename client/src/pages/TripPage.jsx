import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

// ── SVG Icons ──────────────────────────────────────────────
function CalendarIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function CreateTripPage() {
  const [date, setDate] = useState({ from: new Date(), to: addDays(new Date(), 7) })
  const [city, setCity] = useState("Delhi")
  const [budget, setBudget] = useState("")
  const [travellers, setTravellers] = useState(1)
  const [preferredCuisine, setPreferredCuisine] = useState("")
  const [travelType, setTravelType] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [calOpen, setCalOpen] = useState(false)
  const navigate = useNavigate()

  // Cities — only Delhi supported now; extend this array to unlock more
  const CITIES = ["Delhi"]
  const CUISINES = ["North Indian", "South Indian", "Street Food", "Vegetarian", "Chinese"]
  const TRAVEL_TYPES = ["Family", "Adventure", "Relaxation", "Couple", "Solo"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date?.from || !date?.to) return
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/trip/generate`,
        {
          city,
          budget: Number(budget),
          start_date: format(date.from, "yyyy-MM-dd"),
          end_date: format(date.to, "yyyy-MM-dd"),
          travellers,
          preferred_cuisine: preferredCuisine,
          travel_type: travelType,
          additional_info: additionalInfo,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      if (response.status === 200) {
        navigate("/travel", { state: response.data })
      }
    } catch (error) {
      console.error("Error generating itinerary:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .planner-root {
          min-height: 100vh;
          background: #FAF7F2;
          font-family: 'Jost', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          position: relative;
          overflow: hidden;
        }

        .planner-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(196,105,42,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 10% 90%, rgba(196,105,42,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .planner-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 860px;
          background: #fff;
          border: 1px solid #E5DED8;
          border-radius: 4px;
          padding: 56px 52px;
        }
        @media (max-width: 640px) { .planner-card { padding: 36px 24px; } }

        .planner-eyebrow {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px;
        }
        .planner-dot { width: 6px; height: 6px; border-radius: 50%; background: #C4692A; }
        .planner-eyebrow-text {
          font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; color: #C4692A; font-weight: 500;
        }

        .planner-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 300; color: #1C1410;
          line-height: 1.1; margin-bottom: 8px;
        }
        .planner-heading em { font-style: italic; }

        .planner-subheading {
          font-size: 14px; font-weight: 300;
          color: #8B7466; margin-bottom: 44px; line-height: 1.7;
          max-width: 620px;
        }

        .divider { height: 1px; background: #EDE8E3; margin: 32px 0; }

        .section-label {
          font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #6B5A50;
          font-weight: 500; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-label svg { opacity: 0.6; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px 32px;
        }
        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; }

        .planner-select, .planner-input, .planner-textarea {
          width: 100%; padding: 13px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 14px; font-weight: 300;
          color: #1C1410; background: #FAF7F2;
          border: 1px solid #DDD4CC; border-radius: 2px;
          outline: none; appearance: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .planner-select:focus, .planner-input:focus, .planner-textarea:focus {
          border-color: #C4692A; background: #fff;
        }
        .planner-select:disabled {
          cursor: not-allowed; opacity: 0.7;
        }
        .planner-input::placeholder,
        .planner-textarea::placeholder { color: #C4B8AE; }
        .planner-textarea {
          resize: vertical; min-height: 100px; line-height: 1.7;
          cursor: text;
        }

        .select-wrap { position: relative; }
        .select-wrap::after {
          content: '▾';
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: #8B7466; font-size: 11px;
          pointer-events: none;
        }

        .field-hint {
          margin-top: 6px;
          font-size: 11px; color: #B5A49A;
          font-weight: 300; letter-spacing: 0.03em;
          display: flex; align-items: center; gap: 5px;
        }
        .field-hint::before {
          content: ''; display: inline-block;
          width: 4px; height: 4px; border-radius: 50%;
          background: #C4692A; opacity: 0.6; flex-shrink: 0;
        }

        .date-btn {
          width: 100%; padding: 13px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 14px; font-weight: 300;
          color: #1C1410; background: #FAF7F2;
          border: 1px solid #DDD4CC; border-radius: 2px;
          outline: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          text-align: left; transition: border-color 0.2s, background 0.2s;
        }
        .date-btn:hover, .date-btn:focus { border-color: #C4692A; background: #fff; }
        .date-btn.placeholder { color: #C4B8AE; }

        .counter {
          display: flex; align-items: center; gap: 0;
          border: 1px solid #DDD4CC; border-radius: 2px;
          overflow: hidden; background: #FAF7F2;
        }
        .counter-btn {
          width: 44px; height: 46px;
          background: transparent; border: none;
          font-size: 18px; color: #6B5A50;
          cursor: pointer; font-family: 'Jost', sans-serif;
          transition: background 0.15s, color 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .counter-btn:hover { background: #EDE8E3; color: #C4692A; }
        .counter-val {
          flex: 1; text-align: center;
          font-size: 14px; font-weight: 400;
          color: #1C1410; background: transparent;
          border: none; border-left: 1px solid #DDD4CC;
          border-right: 1px solid #DDD4CC;
          padding: 0; line-height: 46px;
        }

        .btn-create {
          width: 100%; margin-top: 40px; padding: 16px;
          background: #1C1410; color: #FAF7F2;
          font-family: 'Jost', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          border: none; border-radius: 2px; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-create:hover:not(:disabled) { background: #C4692A; transform: translateY(-1px); }
        .btn-create:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(250,247,242,0.3);
          border-top-color: #FAF7F2;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="planner-root">
        <div className="planner-card">

          {/* Header */}
          <div className="planner-eyebrow">
            <span className="planner-dot" />
            <span className="planner-eyebrow-text">AI Trip Planner</span>
          </div>
          <h1 className="planner-heading">
            Create Your AI-Powered<br /><em>Delhi Itinerary</em>
          </h1>
          <p className="planner-subheading">
            Tell us your budget, travel dates, cuisine preferences, and travel style. Our AI will generate a personalized day-by-day itinerary using travel knowledge, live weather intelligence, and real-time search.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* City */}
              <div className="form-group">
                <label className="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Destination
                </label>
                <div className="select-wrap">
                  <select
                    className="planner-select"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                    disabled={CITIES.length === 1}
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <span className="field-hint">Delhi knowledge base currently available</span>
              </div>

              {/* Budget */}
              <div className="form-group">
                <label className="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Budget (₹)
                </label>
                <input
                  type="number"
                  className="planner-input"
                  placeholder="Enter your total budget"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {/* Travel Dates */}
              <div className="form-group">
                <label className="section-label">
                  <CalendarIcon />
                  Travel Dates
                </label>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className={cn("date-btn", !date && "placeholder")}>
                      <CalendarIcon />
                      {date?.from ? (
                        date.to
                          ? <>{format(date.from, "MMM dd, yyyy")} – {format(date.to, "MMM dd, yyyy")}</>
                          : format(date.from, "MMM dd, yyyy")
                      ) : "Pick a date range"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(d) => { setDate(d); if (d?.from && d?.to) setCalOpen(false); }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Travellers */}
              <div className="form-group">
                <label className="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Travellers
                </label>
                <div className="counter">
                  <button type="button" className="counter-btn" onClick={() => setTravellers(t => Math.max(t - 1, 1))}>−</button>
                  <span className="counter-val">{travellers}</span>
                  <button type="button" className="counter-btn" onClick={() => setTravellers(t => t + 1)}>+</button>
                </div>
              </div>

              {/* Preferred Cuisine */}
              <div className="form-group">
                <label className="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                  </svg>
                  Preferred Cuisine
                </label>
                <div className="select-wrap">
                  <select
                    className="planner-select"
                    value={preferredCuisine}
                    onChange={e => setPreferredCuisine(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select cuisine</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Travel Type */}
              <div className="form-group">
                <label className="section-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M16.2 7.8 2 22"/><path d="M22 2 7.8 16.2"/>
                  </svg>
                  Travel Type
                </label>
                <div className="select-wrap">
                  <select
                    className="planner-select"
                    value={travelType}
                    onChange={e => setTravelType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select type</option>
                    {TRAVEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

            </div>

            {/* Additional Preferences — full width */}
            <div className="divider" />
            <div className="form-group">
              <label className="section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Additional Preferences
                <span style={{ color: "#B5A49A", fontSize: 10, fontWeight: 300, letterSpacing: "0.05em", textTransform: "none" }}>
                  — optional
                </span>
              </label>
              <textarea
                className="planner-textarea"
                placeholder="e.g. Less walking, Kid friendly, Wheelchair access, Food focused, Shopping focused…"
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  AI is planning your trip…
                </>
              ) : (
                "Create My Trip"
              )}
            </button>
          </form>

        </div>
      </div>
    </>
  )
}