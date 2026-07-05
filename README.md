<div align="center">

<img src="https://img.shields.io/badge/-%E2%9C%88%EF%B8%8F%20PlanMyTrip%20AI-1a1a2e?style=for-the-badge&logoColor=white" alt="PlanMyTrip AI" height="60"/>

<h1>PlanMyTrip AI</h1>

<p><strong>AI-powered travel planning platform that generates personalized multi-day itineraries</strong><br/>
Built with LangGraph · FastAPI · Groq LLM · ChromaDB · RAG · Weather Intelligence · Real-Time Search</p>

<p>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/LangGraph-Latest-FF6B35?style=flat-square"/>
  <img src="https://img.shields.io/badge/ChromaDB-Latest-F97316?style=flat-square"/>
  <img src="https://img.shields.io/badge/Groq-LLM-00A67E?style=flat-square"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square"/>
</p>

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#%EF%B8%8F-system-architecture)
- [LangGraph Workflow](#-langgraph-workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [RAG Pipeline](#-rag-pipeline)
- [Installation](#%EF%B8%8F-installation)
- [API Reference](#-api-reference)
- [Example Usage](#-example-usage)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🌍 Overview

**PlanMyTrip AI** is an intelligent travel planning system that combines local knowledge retrieval, live weather data, and real-time web search to generate practical, budget-aware travel plans — complete with accommodation, restaurant recommendations, transportation guidance, packing advice, and downloadable PDF itineraries.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🗺️ AI Travel Planning
Generate complete itineraries based on:
- Destination City
- Budget & Travel Dates
- Number of Travellers
- Preferred Cuisine
- Travel Style & Preferences

</td>
<td width="50%">

### 📚 RAG Knowledge Base
Retrieval-Augmented Generation using:
- Delhi Travel Knowledge Base PDF
- Delhi Tourism Websites
- Hotel & Restaurant Information
- All indexed in **ChromaDB** with semantic embeddings

</td>
</tr>
<tr>
<td width="50%">

### 🌤️ Weather Intelligence
- Fetches **live weather data**
- Adjusts activity scheduling by weather
- Recommends appropriate clothing
- Avoids poor weather planning
- Indoor/outdoor activity routing

</td>
<td width="50%">

### 🔍 Real-Time Search Agent
Uses **Serper Search** to gather:
- Local events & seasonal attractions
- Cuisine recommendations
- Travel tips & hidden gems
- Up-to-date destination info

</td>
</tr>
<tr>
<td width="50%">

### 💰 Budget Optimization Engine
Post-generation optimizer that:
- Validates budget constraints
- Reduces unnecessary expenses
- Optimizes transport choices
- Improves route efficiency
- Preserves itinerary quality

</td>
<td width="50%">

### 🍽️ Smart Food Planning
Every day includes:
- Breakfast, Lunch & Dinner
- Restaurant name & dish recommendation
- Estimated costs per meal
- Based on cuisine preferences & budget

</td>
</tr>
<tr>
<td width="50%">

### 🏨 Accommodation Recommendations
Budget-aware hotel suggestions:
- **Budget** · **Mid-range** · **Luxury**
- Based on travel style & retrieved data

</td>
<td width="50%">

### 📄 PDF Export
Professional downloadable trip plans:
- Daily itinerary & meals
- Transportation breakdown
- Packing list & cost estimates

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React + Vite)             │
└────────────────────────┬────────────────────────┘
                         │ HTTP
                         ▼
┌─────────────────────────────────────────────────┐
│               FastAPI Backend                    │
└────────────────────────┬────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│                  LangGraph                       │
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│   │ RAG Node │  │ Weather  │  │ Search Node  │  │
│   │          │  │   Node   │  │   (Serper)   │  │
│   └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│        └─────────────┼───────────────┘           │
│                      │                           │
│              ┌───────▼───────┐                   │
│              │  Planner Node │                   │
│              └───────┬───────┘                   │
│                      │                           │
│            ┌─────────▼─────────┐                 │
│            │  Optimizer Node   │                 │
│            └─────────┬─────────┘                 │
└──────────────────────┼──────────────────────────┘
                       │
              ┌────────▼─────────┐
              │  Structured JSON │
              │  Output + PDF    │
              └──────────────────┘
```

---

## 🧠 LangGraph Workflow

```
START
  │
  ├─▶ [RAG Node]         ← Retrieves local travel knowledge from ChromaDB
  │
  ├─▶ [Weather Node]     ← Fetches live weather, adjusts activity scheduling
  │
  ├─▶ [Search Node]      ← Real-time search for events, tips, hidden gems
  │
  ├─▶ [Planner Node]     ← Generates full multi-day itinerary with meals
  │
  └─▶ [Optimizer Node]   ← Validates budget, optimizes routes & expenses
        │
       END → Structured Output → PDF Export
```

---

## 🛠 Tech Stack

### Backend

| Tool | Purpose |
|------|---------|
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | REST API server |
| ![LangGraph](https://img.shields.io/badge/LangGraph-FF6B35?style=flat-square) | AI workflow orchestration |
| ![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square) | LLM toolchain & RAG |
| ![Groq](https://img.shields.io/badge/Groq-00A67E?style=flat-square) | Ultra-fast LLM inference |
| ![ChromaDB](https://img.shields.io/badge/ChromaDB-F97316?style=flat-square) | Vector database |
| ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white) | Data validation & schemas |
| ![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat-square&logo=huggingface&logoColor=black) | Sentence embeddings |

### Frontend

| Tool | Purpose |
|------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build tool & dev server |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | HTTP client |

### External APIs

| API | Usage |
|-----|-------|
| **Groq API** | LLM completions |
| **OpenWeather API** | Live weather data |
| **Serper API** | Real-time web search |

---

## 📂 Project Structure

```
PlanMyTrip/
│
├── client/                          # React + Vite Frontend
│   └── src/
│       ├── pages/                   # Page-level components
│       ├── components/              # Reusable UI components
│       └── services/                # API service layer (Axios)
│
├── server/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/                     # Route handlers
│   │   ├── graph/
│   │   │   ├── nodes/               # LangGraph node definitions
│   │   │   │   ├── rag_node.py
│   │   │   │   ├── weather_node.py
│   │   │   │   ├── search_node.py
│   │   │   │   ├── planner_node.py
│   │   │   │   └── optimizer_node.py
│   │   │   └── builder.py           # LangGraph graph builder
│   │   ├── prompts/                 # LLM prompt templates
│   │   ├── schemas/                 # Pydantic models
│   │   ├── services/                # Business logic
│   │   ├── vectorstore/             # ChromaDB interface
│   │   ├── loaders/                 # PDF & URL loaders
│   │   └── scripts/
│   │       └── ingest.py            # RAG ingestion script
│   │
│   ├── data/
│   │   ├── delhi/
│   │   │   └── Delhi.pdf            # Travel knowledge base
│   │   └── urls.txt                 # Tourism website URLs
│   │
│   └── chroma_db/                   # Persisted vector store
│
└── README.md
```

---

## 🔍 RAG Pipeline

### Knowledge Sources

| Source | Contents |
|--------|----------|
| 📄 `Delhi.pdf` | Attractions, hotels, restaurants, transport, budget info |
| 🌐 Tourism Websites | Delhi Tourism, Incredible India, travel & restaurant guides |

### Embedding Model

```python
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-small-en-v1.5"
)
```

> All documents are chunked, embedded, and stored in **ChromaDB** for semantic retrieval at query time.

---

## ⚙️ Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- API keys for Groq, OpenWeather, and Serper

---

### 1️⃣ Clone the Repository

```bash
git clone <repo-url>
cd PlanMyTrip
```

### 2️⃣ Backend Setup

```bash
cd server

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `server/` directory:

```env
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
SERPER_API_KEY=your_serper_api_key
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BASE_URL=http://127.0.0.1:8000
```

### 4️⃣ Build the RAG Knowledge Base

Place your PDFs inside `server/data/delhi/` and add website URLs to `server/data/urls.txt`, then run:

```bash
python -m app.scripts.ingest
```

### 5️⃣ Run the Application

```bash
# Terminal 1 — Start Backend
cd server
uvicorn app.main:app --reload

# Terminal 2 — Start Frontend
cd client
npm run dev
```

> Frontend runs at `http://localhost:5173` · Backend at `http://127.0.0.1:8000`

---

## 📡 API Reference

### `POST /api/trip/generate`
Generate a personalized travel itinerary.

**Request Body:**
```json
{
  "city": "Delhi",
  "budget": 15000,
  "start_date": "2026-06-10",
  "end_date": "2026-06-14",
  "travellers": 2,
  "preferred_cuisine": "North Indian",
  "travel_type": "Family",
  "additional_info": "Less walking"
}
```

**Response:**
```json
{
  "summary": "4-day personalized Delhi itinerary",
  "accommodation_suggestion": "The Claridges",
  "estimated_total_cost": 14000,
  "days": [
    {
      "day": 1,
      "breakfast": { "restaurant": "...", "dish": "...", "cost": 300 },
      "lunch":     { "restaurant": "...", "dish": "...", "cost": 500 },
      "dinner":    { "restaurant": "...", "dish": "...", "cost": 600 },
      "activities": ["Red Fort", "Chandni Chowk", "Jama Masjid"]
    }
  ]
}
```

---

### `POST /api/trip/pdf`
Generate and download a PDF version of the itinerary.

---

### `GET /api/rag/search`
Test RAG retrieval with a query parameter.

```
GET /api/rag/search?q=budget hotels in Delhi
```

---

## 🚀 Future Improvements

- [ ] Multi-city trip support
- [ ] User authentication & trip history
- [ ] Conversational itinerary editing
- [ ] Hotel & restaurant booking integration
- [ ] Live transportation APIs
- [ ] Multi-language support
- [ ] Recommendation feedback loop
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

<table>
<tr>
<td align="center">
<strong>Ritik Saini</strong><br/>
B.Tech Computer Engineering<br/>
IIIT Bhubaneswar<br/>
<br/>
<em>Built with LangGraph · FastAPI · Groq · ChromaDB · React</em>
</td>
</tr>
</table>

---

<div align="center">

<sub>If you found this project useful, consider giving it a ⭐ on GitHub!</sub>

</div>
