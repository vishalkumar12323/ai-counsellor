# 🚀 AI Counsellor

**AI Counsellor** is a guided, stage-based platform designed to help students make confident and informed study-abroad decisions.

## 📖 About Project

Instead of overwhelming users with listings or generic chat responses, AI Counsellor uses a structured AI that deeply understands a student’s academic background, goals, budget, and readiness. It guides them step-by-step from profile building to university shortlisting and application preparation.

The AI Counsellor doesn't just answer questions; it actively reasons, recommends, explains risks, shortlists universities, locks decisions, and creates actionable tasks based on the user’s current stage. It acts as a decision and execution system built to remove confusion and provide clarity, direction, and momentum throughout the admission journey.

## ✨ Features

-   **User Onboarding:** Structured collection of academic background, study goals, budget, and readiness (exams, SOP).
-   **Smart Dashboard:** Answers key questions: "Where am I?", "What next?", and "How strong is my profile?".
-   **AI Counsellor (Core):** Persistent AI agent using Google's Gemini that recommends universities (Dream, Target, Safe), explains fits/risks, and manages tasks.
-   **University Shortlisting & Locking:** Facilitates decision making by allowing users to shortlist and eventually "lock" universities to unlock application guidance.
-   **Application Guidance:** Provides document requirements, timelines, and AI-generated tasks for locked universities.
-   **Reactive Profile:** Any profile edit triggers implicit recalculations of recommendations and acceptance chances.

## 🛠️ Tech-Stack

**Frontend:**
-   **Framework:** Next.js 16 (React 19)
-   **Styling:** Tailwind CSS 4, Framer Motion (animations), Lucide React (icons)
-   **Components:** Custom components

**Backend:**
-   **Runtime:** Node.js (via Next.js API Routes / Server Actions)
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** Custom (Bcryptjs, Jose)

**AI:**
-   **Model:** Google Gemini (@google/genai)

**DevOps & Tools:**
-   **Containerization:** Docker (for Database)
-   **Linting:** ESLint

## ⚙️ Local Setup

Follow these steps to get the project running locally:

### 1. Prerequisites
-   Node.js (v20 or later recommended)
-   Docker & Docker Compose

### 2. Clone the Repository
```bash
git clone <repository-url>
cd ai-counsellor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root of the `ai-counsellor` directory (same level as `package.json`) and configure the following:

```env
# Database (Matches docker-compose.yml default)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai-counsellor?schema=public"

# AI Service
GEMINI_API_KEY="your_google_gemini_api_key"

# Authentication
JWT_SECRET="your_secure_random_string"
```

### 5. Start the Database
Run the Docker Compose file located in the parent directory (or move it to root if preferred) to start PostgreSQL.

```bash
# Assuming you are in the ai-counsellor inner folder
cd ..
docker-compose up -d
cd ai-counsellor
```

### 6. Initialize Database
Push the Prisma schema to your database.

```bash
npx prisma db push
```

### 7. Run the Application
Start the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
