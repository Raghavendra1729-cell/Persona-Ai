# Persona AI Chatbot

This repository contains my submission for the persona-based AI chatbot assignment. The app lets a user chat with three different mentor personas: Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra. Each persona has a separate system prompt, separate suggestion chips, and a separate conversation flow, so switching between them feels like changing mentors rather than just changing a label.

The project is split into two folders:

- `persona ai backend` contains the FastAPI backend and the `/api/chat` route
- `persona ai frontend` contains the React + Vite + Tailwind frontend

## Features

- three persona images at the top of the page
- active persona highlight
- chat reset when the persona changes
- suggestion chips for each persona
- typing indicator while the response is loading
- user-friendly error handling
- mobile and desktop responsive layout

## Local setup

### Backend

```bash
cd "persona ai backend"
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend environment variables are documented in `persona ai backend/.env.example`.

### Frontend

```bash
cd "persona ai frontend"
npm install
cp .env.example .env
npm run dev
```

## Deployment

Deployed frontend URL: https://persona-ai-alpha-roan.vercel.app/  
Deployed backend URL: https://persona-ai-k8fx.onrender.com/

## Screenshots

Add screenshots here before submission:

<img width="1693" height="955" alt="Screenshot 2026-04-30 at 12 00 13 PM" src="https://github.com/user-attachments/assets/1cd5a798-db3f-4b70-b7be-69ed67aef2c1" />

<img width="1259" height="932" alt="Screenshot 2026-04-30 at 12 01 45 PM" src="https://github.com/user-attachments/assets/04cf5e92-dd67-4950-814f-154a48a62b44" />


<img width="1263" height="950" alt="Screenshot 2026-04-30 at 12 01 29 PM" src="https://github.com/user-attachments/assets/b0a93676-31c7-414d-8963-09e7056b38fe" />

