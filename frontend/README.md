# Frontend - Resume Builder

React + TypeScript + Vite frontend for the AI-powered Resume Builder application.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file in this directory:

```
VITE_API_URL=http://localhost:3001
```

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service layer
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── lib/           # Library configurations
```

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Integration

The frontend communicates with the backend API at the URL specified in `VITE_API_URL`. 

Default: `http://localhost:3001`
