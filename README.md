# EASE AI Process Monitor

A lightweight Process Monitor that evaluates whether actions taken during a process comply with established guidelines using AI analysis.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ease-ai-process-monitor.vercel.app/)

**Live Demo**: [https://ease-ai-process-monitor.vercel.app/](https://ease-ai-process-monitor.vercel.app/)

## Overview

This application helps organizations ensure their processes are followed correctly by:

- Accepting reported actions (what someone did)
- Evaluating compliance against established guidelines
- Using AI (Hugging Face's BART model) to classify actions as COMPLIES, DEVIATES, or UNCLEAR
- Storing results and displaying them in a comprehensive UI

## Features

- **AI-Powered Analysis**: Uses Hugging Face's `facebook/bart-large-mnli` model for zero-shot classification
- **Dual Analysis Modes**:
  - Manual: Submit action with custom guideline
  - Preset: Match action against multiple saved guidelines
- **Submission History**: View all submissions with basic pagination and result-based filtering (initial implementation - not fully flushed out yet)
- **Real-time Results**: Get instant compliance analysis with confidence scores

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Neon serverless PostgreSQL database (for quick prototyping)
- Hugging Face account with API token

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ease-ai-process-monitor
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Database Configuration (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/ease_ai_monitor?sslmode=require"

# Hugging Face API Configuration
HUGGING_FACE_ACCESS_TOKEN="your_hugging_face_token_here"
```

**Note**: This project uses Neon serverless PostgreSQL for quick prototyping and development. You can get a free Neon database at [neon.tech](https://neon.tech/). A Neon dev database URL has been added to the `.env.example` file for immediate use.

### 4. Hugging Face Setup

1. Create a free account at [huggingface.co](https://huggingface.co/)
2. Go to Profile → Access Tokens
3. Create a new Read token
4. Add the token to your `.env.local` file

### 5. Database Setup

```bash
# Generate database migrations
pnpm db:generate

# Push schema to Neon database
pnpm db:push

# (Optional) Open Drizzle Studio for database management
pnpm db:studio
```

**Note**: The `pnpm db:push` command will create the necessary tables in your Neon serverless database. This is perfect for quick prototyping and development without needing to set up a local PostgreSQL instance.

## How to Run the Project

### Live Demo

The application is deployed and available at: **[https://ease-ai-process-monitor.vercel.app/](https://ease-ai-process-monitor.vercel.app/)**

You can test the application immediately without any setup by visiting the live demo.

### Development Mode

```bash
# Start the development server
pnpm dev

# The application will be available at http://localhost:3000
```

### Production Mode

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Deployment

This project is automatically deployed to Vercel. The deployment includes:

- **Automatic builds** on every push to main branch
- **Environment variables** configured for production
- **Database connection** to Neon serverless PostgreSQL
- **Hugging Face API** integration for AI analysis

### Database Management

```bash
# Generate new migrations after schema changes
pnpm db:generate

# Apply migrations to Neon database
pnpm db:migrate

# Push schema changes directly to Neon (development only)
pnpm db:push

# Open Drizzle Studio for database management
pnpm db:studio
```

**Note**: For this prototyping setup, `pnpm db:push` is the recommended approach as it directly syncs your schema changes with the Neon serverless database without requiring migration files.

## How to Run Tests

### Run All Tests

```bash
# Run tests once
pnpm test:run

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui
```

### Test Structure

The test suite includes:

- **API Tests**: Validate Hugging Face integration and analysis logic
- **Component Tests**: Test UI components and user interactions
- **Integration Tests**: End-to-end form submission and result handling
- **EASE-AI Test Cases**: Specific test cases from requirements

#### EASE-AI Test Cases

The application validates these specific scenarios:

1. **Case 1**: "Closed ticket #48219 and sent confirmation email" → **COMPLIES**
2. **Case 2**: "Closed ticket #48219 without sending confirmation email" → **DEVIATES**
3. **Case 3**: "Rebooted the server and checked logs" → **DEVIATES**
4. **Case 4**: "Skipped torque confirmation at Station 3" → **UNCLEAR**

## API Endpoints

### POST `/api/analyze`

Analyze a single action against one guideline.

**Request:**

```json
{
  "action": "Closed ticket #48219 and sent confirmation email",
  "guideline": "All closed tickets must include a confirmation email"
}
```

**Response:**

```json
{
  "id": 1,
  "action": "Closed ticket #48219 and sent confirmation email",
  "guideline": "All closed tickets must include a confirmation email",
  "result": "complies",
  "confidence": "0.94",
  "timestamp": "2025-01-15T10:15:00Z"
}
```

### POST `/api/classify` (Bonus Feature)

Analyze an action against multiple guidelines and return the highest priority result.

**Request:**

```json
{
  "action": "Closed ticket #48219 and sent confirmation email",
  "guidelineIds": [1, 2, 3]
}
```

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Prototyping**: v0.dev for initial UI design and project scaffolding
- **Styling**: Tailwind CSS, shadcn/ui components, Radix UI primitives
- **Database**: Neon Serverless PostgreSQL with Drizzle ORM
- **AI Integration**: Hugging Face Inference API
- **Testing**: Vitest, Testing Library
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx            # Feature components
├── lib/                  # Utility functions and API clients
├── db/                   # Database schema and configuration
├── __tests__/            # Test files
└── public/              # Static assets
```
