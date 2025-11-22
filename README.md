# Resume Builder

A fullstack AI-powered resume builder application that generates professional LaTeX resumes tailored to job descriptions.

## Project Structure

```
ResumeBuilder/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── ...           # Config files (vite, tailwind, tsconfig, etc.)
├── backend/          # Node.js + Express backend
│   ├── routes/       # API routes
│   ├── services/     # Business logic (AI, PDF generation)
│   └── ...           # Server configuration
└── README.md         # This file
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

## Features

- AI-powered resume content enhancement using Google Gemini
- LaTeX-based professional resume generation
- PDF export functionality
- Tailored resume optimization based on job descriptions
- Modern, responsive UI

## Documentation

- See `backend/README.md` for backend-specific documentation
- See `backend/INTEGRATION.md` for integration details
- See `INTEGRATION_COMPLETE.md` for deployment information

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- Google Gemini AI
- LaTeX (for PDF generation)

## License

MIT
