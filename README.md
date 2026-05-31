# 🎨 MetArt: AI-Powered Premium Digital Art Gallery & Live Auction Platform

<div align="center">

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-v18.2.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node-v18+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Vision-orange?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**Built for the OpenAI × Outskill AI Builders Hackathon** 🏆

**MetArt** is a highly secure, AI-native MERN marketplace for digital art. It leverages **Google Gemini Vision AI** to automatically appraise artwork, generates custom virtual exhibition spaces, and features a real-time **Live AI Auctioneer** built on WebSockets. 

### 🚀 [Click Here to View Live Website](https://metart-seven.vercel.app/) 
### 🎥 [Click Here to Watch the 2-Minute Demo Video](YOUR_YOUTUBE_OR_LOOM_LINK_HERE)

</div>

---

## 🌟 Hackathon Flagship AI Features (100-Point Scorecard)

### 1. 🤖 AI Art Appraiser (Google Gemini Vision)
* **The Problem:** Artists struggle to write engaging catalog descriptions and don't know how to price their work.
* **The Solution:** When an artist uploads a painting, **Gemini 1.5 Flash** visually scans the canvas to analyze colors, composition, and texture. It automatically generates a high-end storytelling description, SEO search tags, and a suggested starting bid based on visual complexity.

### 2. 🏛️ AI Virtual Spaces & Live Commentator
* **The Concept:** Curate your artworks into virtual 3D "Spaces" with different atmospheric themes (e.g., Luxury Minimalist, Cyberpunk).
* **The Magic:** We built an animated **Live AI Curator** that uses generative text and a built-in Text-to-Speech (TTS) engine to give buyers a spoken, guided tour of the exhibition space, explaining the artistic connection between the pieces.

### 3. 🔨 Real-Time AI Auctions
* Powered by `Socket.io`, buyers can enter live bidding wars. The real-time engine ensures that bids are instantly synced across all active screens worldwide without refreshing.

### 4. 🛡️ Enterprise Grade Security & DevOps
* **Security:** Hardened backend using `Helmet.js`, `express-rate-limit`, `xss-clean`, and `express-mongo-sanitize` to prevent wallet drains and database injections.
* **DevOps:** Fully containerized using multi-stage `Dockerfiles` and `docker-compose`, deployed serverlessly across **Vercel** (Frontend) and **Render** (Backend).

---

## 🛠️ Technology Stack

### 💻 Frontend (Client)
*   **Core:** React 18, Redux Toolkit
*   **Styling:** Dynamic Light Theme (Beige/Lavender), Vanilla CSS, Ant Design (AntD)
*   **Real-time & Media:** Socket.IO Client, Web Speech API (Text-to-Speech)

### ⚙️ Backend (Server)
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB Atlas with Mongoose ODM
*   **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash Vision)
*   **Security Pipeline:** Helmet, Rate Limiters, XSS Clean, Mongo Sanitize
*   **Media Pipeline:** Cloudinary API, Sharp (compression & watermarking)
*   **Payments:** Stripe

---

## ⚡ Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Suyasha7/MetArt.git
cd MetArt
```

### 2. Configure Environment Variables
* Create `client/.env` and `server/config.env` using the provided `.example` files.
* You will need a **Google Gemini API Key**, **MongoDB URI**, and **Cloudinary** credentials.

### 3. Run with Docker (Recommended)
We have fully containerized the workspace for immediate execution:
```bash
docker-compose up --build
```
*The client will open at `http://localhost:3000` and the backend at `http://localhost:8000`.*

### 4. Run Manually
```bash
# Terminal 1 (Backend)
cd server && npm install && npm run dev

# Terminal 2 (Frontend)
cd client && npm install && npm start
```

---

## 👩‍💻 Author

**Suyasha Gourh**
*   **GitHub:** [@Suyasha7](https://github.com/Suyasha7)
*   **Email:** suyashagourh@gmail.com

*Built with ❤️ for the Outskill Hackathon.*
