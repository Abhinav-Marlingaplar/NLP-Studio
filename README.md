# NLP Studio – Multi-Service NLP Platform

![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blueviolet)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-black)
![VectorDB](https://img.shields.io/badge/VectorDB-Supabase-green)
![LLM](https://img.shields.io/badge/LLM-Groq%20API-brightgreen)
![Cache](https://img.shields.io/badge/Cache-Redis%20Upstash-red)
![Deploy](https://img.shields.io/badge/Deploy-Render%20%7C%20Vercel-black)

🔗 [Live Demo](https://nlp-studio.vercel.app) · ⚙️ [Backend API](https://nlp-studio.onrender.com)

---

## Overview

NLP Studio is a full-stack AI-powered Natural Language Processing platform that delivers multiple language services through a unified web interface. Built on the MERN stack with Groq LLM APIs, it combines Retrieval-Augmented Generation, intelligent paraphrasing, and deep text analytics into a single cohesive application.

The platform is engineered for real-world deployment — featuring a service-layer architecture, Redis caching, JWT-based authentication, and an automated warm-up system designed to maintain availability on free-tier cloud infrastructure.

---

## Key Features

### RAG Chatbot
Upload one or more PDF documents and interact with them through a conversational interface. The system generates semantic embeddings using Xenova Transformers (MiniLM), stores them in Supabase Vector DB, and retrieves contextually relevant chunks to ground responses from the Groq LLM. Responses are cached in Redis to reduce latency on repeated queries.

### Paraphrasing Service
Rewrite any text while preserving its original meaning. Users can control the output through three parameters — tone (formal, casual, neutral), length (shorter, same, longer), and creativity level (0–1 scale). Powered by Groq's `llama-3.1-8b-instant` model.

### Text Analytics
Performs comprehensive multi-layer analysis on any input text. Returns a structured JSON report covering overall sentiment, aspect-level breakdown, key issues with severity ratings, identified strengths, potential risks, and actionable recommendations. Designed for product feedback, reviews, and content evaluation use cases.

### Authentication System
Production-grade JWT authentication with short-lived access tokens stored client-side and long-lived refresh tokens stored in HTTP-only cookies. Axios interceptors handle automatic token refresh transparently. CORS and cookie policies are configured for secure cross-origin communication between Vercel and Render.

### Service Layer Architecture
Business logic is fully decoupled from HTTP handling through a dedicated services layer. Each feature — RAG, paraphrase, analytics, and auth — has its own service file responsible for all logic, LLM calls, and data access. Controllers are thin and only handle request extraction and response sending.

### Redis Caching
Two cache layers are active across the RAG pipeline via Upstash Redis. Embedding vectors are cached for 24 hours and full LLM responses are cached per session for 1 hour. Cache misses fall back to the full pipeline gracefully without any errors.

### Warm-Up System
Exposes `/api/health` and `/api/warm-all` endpoints that ping MongoDB and Supabase to keep free-tier services active. Automated cron jobs via cron-job.org hit these endpoints every 10 minutes (server keep-alive) and every day at midnight (database warm-up), preventing Render sleep and Supabase inactivity pauses.

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Vector Database | Supabase |
| LLM Inference | Groq API |
| Embeddings | Xenova Transformers (MiniLM L6 v2) |
| Caching | Redis via Upstash |
| Authentication | JSON Web Tokens (JWT) |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Cron Scheduling | cron-job.org |

---

## Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
  <img src="images/landing.png" alt="Landing Page" width="400"/>
  <img src="images/dashboard.png" alt="Dashboard" width="400"/>
  <img src="images/rag.png" alt="RAG Chatbot" width="400"/>
  <img src="images/paraphraser.png" alt="Paraphraser" width="400"/>
  <img src="images/analytics-1.png" alt="Text Analytics" width="400"/>
  <img src="images/analytics-2.png" alt="Analytics Detail" width="400"/>
</div>

---

## Conclusion

NLP Studio demonstrates the end-to-end design and deployment of a production-ready, AI-driven web application. It integrates large language models, vector databases, semantic search, and secure authentication within a clean full-stack architecture. The latest version introduces a service layer for maintainability, Redis caching for performance, and an automated warm-up infrastructure to ensure consistent availability — reflecting engineering practices used in modern AI-powered SaaS products.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

**Abhinav Marlingaplar**
[GitHub](https://github.com/Abhinav-Marlingaplar)
