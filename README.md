<div align="center">

<img src="https://img.shields.io/badge/-%E2%9C%88%EF%B8%8F%20PlanMyTrip%20AI-1a1a2e?style=for-the-badge&logoColor=white" alt="PlanMyTrip AI" height="60"/>

<h1>PlanMyTrip AI</h1>

<p><strong>Full-stack AI-powered travel planning platform that generates personalized, budget-aware multi-day itineraries</strong><br/>
Built with React · FastAPI · LangGraph · Groq LLM · ChromaDB · RAG · Weather Intelligence · Real-Time Search</p>

<p>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Vite-Latest-646CFF?style=flat-square&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas%2FLocal-47A248?style=flat-square&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/LangGraph-Latest-FF6B35?style=flat-square"/>
  <img src="https://img.shields.io/badge/ChromaDB-Latest-F97316?style=flat-square"/>
  <img src="https://img.shields.io/badge/Groq-LLM-00A67E?style=flat-square"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=flat-square&logo=nginx&logoColor=white"/>
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
- [Deployment Architecture](#-deployment-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [RAG Pipeline](#-rag-pipeline)
- [Authentication](#-authentication)
- [Installation](#%EF%B8%8F-installation)
- [Production Deployment](#-production-deployment)
- [API Reference](#-api-reference)
- [Example Usage](#-example-usage)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🌍 Overview

**PlanMyTrip AI** is a full-stack intelligent travel planning system. A React/Vite frontend collects trip preferences and renders AI-generated itineraries, while a FastAPI backend orchestrates a **LangGraph** pipeline that combines local knowledge retrieval (RAG), live weather data, and real-time web search to produce practical, budget-aware travel plans — complete with accommodation, restaurant recommendations, transportation guidance, packing advice, and downloadable PDF itineraries. User accounts and authentication are backed by **MongoDB** with JWT-based session handling.

The application is fully containerized and deployed to production using **Docker**, **AWS EC2**, **Nginx**, and **GitHub Actions CI/CD**, with the frontend served separately via **Vercel**.

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
- Local Travel Knowledge Base PDFs
- Tourism Websites
- Hotel & Restaurant Information
- All indexed in **ChromaDB** with semantic embeddings, refined with **Cohere rerank**

</td>
</tr>
<tr>
<td width="50%">

### 🌤️ Weather Intelligence
- Fetches **live weather data** via OpenWeatherMap
- Adjusts activity scheduling by weather
- Recommends appropriate clothing
- Avoids poor-weather planning
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
Professional downloadable trip plans generated with **ReportLab**:
- Daily itinerary & meals
- Transportation breakdown
- Packing list & cost estimates

</td>
</tr>
<tr>
<td width="50%">

### 🔐 User Authentication
Secure account system:
- JWT cookie-based sessions (**PyJWT**)
- Passwords hashed with **Passlib (bcrypt)**
- User records persisted in **MongoDB**

</td>
<td width="50%">

### 🗺️ Interactive Map & UI
Rich, responsive frontend built with:
- Leaflet / React-Leaflet & Google Maps
- Radix UI components + TailwindCSS
- Lottie animations for a polished feel

</td>
</tr>
</table>

---

## 🏗️ System Architecture

<img width="1536" height="1024" alt="ChatGPT Image Jul 17, 2026, 10_24_21 PM" src="https://github.com/user-attachments/assets/c5151c91-3014-40ce-91dc-72d7d72fc317" />

---

## 🧠 LangGraph Workflow

<img width="1693" height="929" alt="ChatGPT Image Jul 17, 2026, 09_56_13 PM" src="https://github.com/user-attachments/assets/ae2bb611-5a9e-436f-addd-2ccabdfbbbc9" />

---

## 🚀 Deployment Architecture

The application runs a fully containerized, production-grade deployment: a **React + Vite** frontend hosted on **Vercel**, talking over HTTPS to a **FastAPI** backend running in **Docker** on an **AWS EC2** instance behind an **Nginx** reverse proxy with **Let's Encrypt** HTTPS. Releases are automated end-to-end with **GitHub Actions CI/CD**, and **ChromaDB** data is preserved across deploys with a **persistent Docker volume**.

✅ React + Vercel · ✅ FastAPI · ✅ Docker · ✅ Docker Compose · ✅ Persistent Docker Volume (ChromaDB) · ✅ EC2 · ✅ Elastic IP · ✅ Nginx Reverse Proxy · ✅ HTTPS (Let's Encrypt) · ✅ GitHub Actions CI/CD · ✅ JWT Cookie Authentication

### Production Deployment Flow

```
                          USER
                           │
                https://planmytrip.vercel.app
                           │
                           ▼
                    Vercel CDN
                           │
                 React + Vite Frontend
                           │
         Axios (withCredentials = true)
                           │
             HTTPS API Request (JWT Cookie)
                           │
                           ▼
        https://planmytripritik.duckdns.org
                           │
                  DNS (DuckDNS)
                           │
                           ▼
                  AWS Elastic IP
                           │
                           ▼
             EC2 Ubuntu Instance
                           │
                           ▼
                Nginx Reverse Proxy
                 (Port 80 / 443)
                           │
             Reverse Proxy → localhost:8000
                           │
                           ▼
                 FastAPI + Uvicorn
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
  MongoDB             LangGraph            ChromaDB
 Authentication      AI Workflow        Docker Volume
      │
      ▼
 JWT HttpOnly Cookie
```

### CI/CD Pipeline

```
Developer
    │
    │ git push origin main
    ▼
GitHub Repository
    │
    ▼
GitHub Actions Workflow
    │
    │ SSH using Deploy Key
    ▼
AWS EC2
    │
    │ git pull
    │ docker compose down
    │ docker compose build
    │ docker compose up -d
    ▼
Updated Backend Live
```

### Docker Deployment Flow

```
Developer Machine
        │
        ▼
    Dockerfile
        │
        ▼
docker compose build
        │
        ▼
   Docker Image
        │
        ▼
docker compose up
        │
        ▼
  Docker Container
        │
        ▼
   Named Volume
        │
        ▼
ChromaDB persists
even after container recreation
```

### Backend Request Flow

```
User Login
    │
    ▼
React Frontend
    │
    │ POST /login
    ▼
FastAPI
    │
    ▼
Verify Password
    │
    ▼
Generate JWT
    │
    ▼
Set HttpOnly Cookie
    │
    ▼
Browser stores Cookie
──────────────────────
Next Request
    │
    ▼
Browser automatically sends Cookie
    │
    ▼
Nginx
    │
    ▼
FastAPI
    │
    ▼
Read Cookie
    │
    ▼
Verify JWT
    │
    ▼
Return Protected Data
```

### AI Request Flow

```
User enters trip details
        │
        ▼
    Frontend
        │
        │ POST /trip
        ▼
     FastAPI
        │
        ▼
    LangGraph
        │
────────────────────────────────
       Parallel Execution
   RAG · Weather API · Serper Search
────────────────────────────────
        │
        ▼
   Planner Node
        │
        ▼
  Optimizer Node
        │
        ▼
   Generate PDF
        │
        ▼
  Return itinerary
```

### Infrastructure Overview

```
Internet
    │
    ▼
  HTTPS
    │
    ▼
 DuckDNS
    │
    ▼
Elastic IP
    │
    ▼
 AWS EC2
    │
    ▼
  Nginx
    │
    ▼
 FastAPI
    │
    ├──▶ MongoDB
    ├──▶ LangGraph
    ├──▶ Groq
    ├──▶ Weather API
    ├──▶ Serper API
    └──▶ ChromaDB
```

---

## 🛠 Tech Stack

### Frontend

| Tool | Purpose |
|------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Build tool & dev server |
| **React-Router-DOM** | Client-side routing |
| **TailwindCSS** | Utility-first styling |
| **Radix UI** | Accessible headless UI primitives |
| **Lucide / React-Icons** | Iconography |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | HTTP client |
| **Date-fns** | Date formatting & manipulation |
| **Leaflet / React-Leaflet, @react-google-maps/api** | Interactive maps |
| **Lottie-React** | Animations |

### Backend

| Tool | Purpose |
|------|---------|
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | ASGI REST API server |
| **Uvicorn** | ASGI server |
| ![LangGraph](https://img.shields.io/badge/LangGraph-FF6B35?style=flat-square) | AI workflow orchestration |
| ![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square) | LLM toolchain & RAG |
| ![Groq](https://img.shields.io/badge/Groq-00A67E?style=flat-square) | Ultra-fast LLM inference |
| ![ChromaDB](https://img.shields.io/badge/ChromaDB-F97316?style=flat-square) | Vector database |
| **Cohere** | Reranking retrieved documents |
| **Serper** | Real-time web search |
| **OpenWeatherMap** | Live weather data |
| ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white) | Data validation & settings management |
| **Python-Multipart** | Form/file parsing |
| **Orjson** | Fast JSON serialization |
| **Tenacity** | Retry logic |
| **Structlog** | Structured logging |
| **ReportLab** | PDF generation |
| **Passlib [bcrypt]** | Password hashing |
| **PyJWT** | JWT authentication |
| ![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat-square&logo=huggingface&logoColor=black) | Sentence embeddings |

### Data Store

| Tool | Purpose |
|------|---------|
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Stores user accounts (hashed passwords) in `fastapi_db.users` via `pymongo` |

### External APIs

| API | Usage |
|-----|-------|
| **Groq API** | LLM completions |
| **OpenWeather API** | Live weather data |
| **Serper API** | Real-time web search |
| **Cohere API** | Retrieval reranking |

### Deployment & Infrastructure

| Tool | Purpose |
|------|---------|
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerization of the FastAPI backend |
| **Docker Compose** | Multi-container orchestration |
| **Docker Named Volume** | Persists ChromaDB data across container rebuilds |
| ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white) | Backend hosting (Ubuntu instance) |
| **Elastic IP** | Static public IP for the EC2 instance |
| ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white) | Reverse proxy (ports 80/443 → localhost:8000) |
| **Let's Encrypt** | Free HTTPS/TLS certificates |
| **DuckDNS** | Dynamic DNS for the backend domain |
| ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) | CI/CD pipeline (SSH deploy on push to `main`) |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Frontend hosting & CDN |

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
│   │   ├── api/                     # Route handlers (auth, trip, rag, test)
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
│   │   ├── services/                # Business logic (auth, PDF, etc.)
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
│   ├── chroma_db/                   # Persisted vector store (Docker volume)
│   ├── Dockerfile                   # Backend container definition
│   └── docker-compose.yml           # Container orchestration
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Actions CI/CD pipeline
│
├── nginx/
│   └── planmytrip.conf              # Nginx reverse proxy config
│
├── images/                          # README screenshots
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

All documents are chunked, embedded, and stored in **ChromaDB** for semantic retrieval at query time. Retrieved chunks are then **reranked with Cohere** before being passed to the Planner Node, improving relevance over raw vector similarity search.

---

## 🔐 Authentication

- User signup/login handled by the `/auth` routes on the FastAPI backend.
- Passwords are hashed with **bcrypt** (via Passlib) before being stored — plaintext passwords are never persisted.
- On successful login, a **JWT** (via PyJWT) is issued and set as an HTTP-only cookie, which the React frontend automatically attaches to subsequent requests via Axios.
- User records live in the `users` collection of the `fastapi_db` MongoDB database.

---

## ⚙️ Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB instance (local or Atlas)
- API keys for Groq, OpenWeather, Serper, and Cohere
- Docker & Docker Compose (for containerized/production setup)

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
COHERE_API_KEY=your_cohere_api_key

MONGO_URI=mongodb://localhost:27017
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
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

### 6️⃣ Run with Docker (optional, local)

```bash
cd server
docker compose up -d --build
```

> ChromaDB data is persisted in a named Docker volume, so it survives container rebuilds.

---

## 🚀 Production Deployment

The full production release process:

1. Build Docker image
2. Push source code to GitHub
3. GitHub Actions triggers automatically
4. SSH into AWS EC2
5. Pull latest source
6. Rebuild Docker image
7. Restart Docker Compose
8. Nginx serves HTTPS traffic
9. Requests are proxied to FastAPI
10. Docker Volume preserves ChromaDB

The frontend (React + Vite) is deployed separately on **Vercel**, and communicates with the backend over HTTPS using JWT cookies (`axios` with `withCredentials: true`). The backend domain is served through **DuckDNS**, pointing at the EC2 instance's **Elastic IP**, with **Nginx** terminating HTTPS (via **Let's Encrypt**) and reverse-proxying to the FastAPI app running on `localhost:8000` inside Docker.

---

## 📡 API Reference

### `POST /auth/signup`
Register a new user account (password hashed with bcrypt before storage in MongoDB).

### `POST /auth/login`
Authenticate a user and issue a JWT cookie for subsequent requests.

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
Generate and download a PDF version of the itinerary (built with ReportLab).

---

### `GET /api/rag/search`
Test RAG retrieval with a query parameter.

```
GET /api/rag/search?q=budget hotels in Delhi
```

---

## 💡 Example Usage

1. Sign up / log in from the React frontend (JWT cookie issued on success).
2. Fill in the trip form — destination, dates, budget, traveller count, cuisine, and travel style.
3. Submit the form to trigger `POST /api/trip/generate`.
4. The backend's LangGraph pipeline runs the RAG, Weather, and Search nodes in parallel, then the Planner and Optimizer nodes sequentially.
5. View the structured itinerary in the UI, complete with map markers, meal plans, and cost breakdowns.
6. Download the finalized plan as a PDF via `POST /api/trip/pdf`.

---

## 🚀 Future Improvements

- [ ] Multi-city trip support
- [ ] Trip history dashboard for logged-in users
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
<em>Built with React · FastAPI · LangGraph · Groq · ChromaDB · MongoDB · Docker · AWS EC2 · Nginx</em>
</td>
</tr>
</table>

---

<div align="center">

<sub>If you found this project useful, consider giving it a ⭐ on GitHub!</sub>

</div>
