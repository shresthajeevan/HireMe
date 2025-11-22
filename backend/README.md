# Resume Builder Backend

AI-powered LaTeX resume builder backend with PDF generation capabilities.

## 🚀 Features

- **AI-Powered Enhancement**: Uses Google Gemini AI to optimize resume content for ATS systems
- **Job Description Analysis**: Extracts keywords and tailors resume to match job requirements
- **LaTeX Generation**: Produces professional, ATS-friendly LaTeX resumes
- **PDF Compilation**: Converts LaTeX to downloadable PDF files
- **RESTful API**: Clean, well-documented endpoints

## 📋 Prerequisites

- **Node.js** 18+ 
- **pdflatex** (for PDF compilation)
  - macOS: `brew install --cask mactex-no-gui` or `brew install basictex`
  - Linux: `sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra`
  - Windows: Install [MiKTeX](https://miktex.org/download)
- **Google Gemini API Key** (free tier available)

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Get your free Gemini API key**: https://makersuite.google.com/app/apikey

### 3. Verify LaTeX Installation

```bash
pdflatex --version
```

If this command fails, install LaTeX using the instructions in Prerequisites.

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "environment": "development"
}
```

### Generate Enhanced Resume

```bash
POST /api/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "resumeData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(123) 456-7890",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "education": [
      {
        "university": "State University",
        "degree": "B.S. Computer Science",
        "graduationDate": "May 2024",
        "location": "City, State",
        "gpa": "3.8"
      }
    ],
    "technicalSkills": {
      "languages": "Python, JavaScript, Java",
      "frameworks": "React, Node.js, Express",
      "tools": "Git, Docker, AWS"
    },
    "experience": [
      {
        "jobTitle": "Software Engineer Intern",
        "company": "Tech Corp",
        "location": "Remote",
        "startDate": "May 2023",
        "endDate": "Aug 2023",
        "achievements": [
          "Built features for web application",
          "Improved performance"
        ]
      }
    ],
    "projects": [
      {
        "name": "Portfolio Website",
        "techStack": "React, TailwindCSS",
        "githubUrl": "https://github.com/johndoe/portfolio",
        "descriptions": [
          "Created responsive portfolio site"
        ]
      }
    ]
  },
  "jobDescription": "Looking for a frontend developer with React experience..."
}
```

**Response:**
```json
{
  "success": true,
  "latexCode": "\\documentclass[letterpaper,11pt]{article}...",
  "enhancedData": { /* AI-enhanced resume data */ }
}
```

### Compile LaTeX to PDF

```bash
POST /api/pdf
Content-Type: application/json
```

**Request Body:**
```json
{
  "latexCode": "\\documentclass[letterpaper,11pt]{article}..."
}
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file download

## 🧪 Testing with cURL

### Test Generate Endpoint

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "555-0123",
      "education": [],
      "technicalSkills": {
        "languages": "Python, JavaScript",
        "frameworks": "React, Django",
        "tools": "Git, Docker"
      },
      "experience": [],
      "projects": []
    },
    "jobDescription": "Seeking a full-stack developer with Python and React experience"
  }' \
  -o response.json
```

### Test PDF Endpoint

```bash
# First, extract the latexCode from response.json, then:
curl -X POST http://localhost:3001/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"latexCode": "YOUR_LATEX_CODE_HERE"}' \
  -o resume.pdf
```

## 🔗 Frontend Integration

### Example: React/TypeScript Frontend

```typescript
// Generate enhanced resume
const generateResume = async (resumeData: any, jobDescription: string) => {
  const response = await fetch('http://localhost:3001/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData, jobDescription })
  });
  
  const { latexCode, enhancedData } = await response.json();
  return { latexCode, enhancedData };
};

// Download PDF
const downloadPDF = async (latexCode: string) => {
  const response = await fetch('http://localhost:3001/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latexCode })
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.pdf';
  a.click();
};
```

## 🚢 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add `GEMINI_API_KEY`, `PORT`, `ALLOWED_ORIGINS`
4. Add build pack for LaTeX:
   - In Render dashboard, add custom Docker or use Nixpacks with LaTeX

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables: `railway variables set GEMINI_API_KEY=your_key`
5. Deploy: `railway up`

### Deploy to Vercel (Serverless)

**Note**: PDF compilation requires system LaTeX installation, which isn't available in Vercel's serverless environment. Consider using a cloud LaTeX API like [LaTeX.Online](https://latexonline.cc/) or deploy to a platform with full system access.

### Docker Deployment

```dockerfile
FROM node:18

# Install LaTeX
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t resume-backend .
docker run -p 3001:3001 -e GEMINI_API_KEY=your_key resume-backend
```

## 📁 Project Structure

```
backend/
├── server.js              # Main Express server
├── routes/
│   ├── generate.js        # POST /api/generate endpoint
│   └── pdf.js             # POST /api/pdf endpoint
├── services/
│   └── aiService.js       # AI enhancement logic
├── utils/
│   └── latexCompiler.js   # LaTeX to PDF compilation
├── package.json
├── env.example
└── README.md
```

## 🐛 Troubleshooting

### "GEMINI_API_KEY is not set"
- Ensure you've created a `.env` file in the `backend` directory
- Verify the API key is correct (get it from https://makersuite.google.com/app/apikey)

### "pdflatex: command not found"
- Install LaTeX using the instructions in Prerequisites
- Verify installation: `pdflatex --version`

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Format: `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000`

### LaTeX Compilation Fails
- Check the error logs in the server console
- Verify LaTeX code is properly escaped (no unescaped `&`, `%`, `$`, etc.)
- Ensure all required LaTeX packages are installed

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
