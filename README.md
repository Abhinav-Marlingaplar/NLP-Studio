# NLP Studio – Multi-Service NLP Platform

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blueviolet)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-black)
![VectorDB](https://img.shields.io/badge/Vector%20Database-Supabase-green)
![LLM](https://img.shields.io/badge/LLM-Groq%20API-brightgreen)
![Embeddings](https://img.shields.io/badge/Embeddings-Xenova%20Transformers-orange)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-black)

---

## Overview

NLP Studio is a full-stack NLP platform built using the MERN stack and modern large language model tooling.  
The application provides multiple NLP services through a single interface, including a Retrieval-Augmented Generation (RAG) chatbot, text paraphrasing, and text analytics.

The project focuses on building a production-ready AI system rather than a prototype, with emphasis on authentication, scalable architecture, and real-world deployment challenges such as CORS, token management, and environment-based configuration.

Live Demo (Frontend): https://nlp-studio.vercel.app  
Backend API: https://nlp-studio.onrender.com  

---

## Key Features

- RAG-based chatbot that combines vector similarity search with LLM inference to answer user queries using custom context.
- Paraphrasing and text analytics services exposed through a unified API design.
- Secure authentication using JWT access tokens and HTTP-only refresh tokens.
- Modular backend architecture allowing easy extension of additional NLP services.
- Deployed cloud architecture with separate frontend and backend hosting, configured for cross-origin communication and SPA routing.

---

## Technologies Used

| Technology | Purpose |
|----------|--------|
| MongoDB | Persistent storage for users and application data |
| Express.js | REST API layer and authentication logic |
| React.js (Vite) | Frontend single-page application |
| Node.js | Backend runtime |
| Groq API | LLM inference |
| Xenova Transformers | Embedding generation |
| Supabase Vector Database | Vector storage and semantic search for RAG |
| JWT | Access and refresh token-based authentication |
| Tailwind CSS | UI styling |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## Authentication Design

The authentication system uses a standard production-grade JWT workflow:

- Short-lived access tokens are issued on login and stored client-side.
- Long-lived refresh tokens are stored as HTTP-only cookies.
- Axios interceptors automatically refresh expired access tokens.
- Cross-origin authentication is secured using strict CORS configuration and cookie policies.

This approach mirrors common patterns used in modern SaaS applications.

---

## Environment Variables

### Backend (`/server/.env`)

```env
PORT=10000
NODE_ENV=production

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
