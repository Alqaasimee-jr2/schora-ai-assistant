# Schora - AI School Operations Platform

<div align="center">

![Schora Logo](https://img.shields.io/badge/Schora-AI%20School%20Ops-4CD7F6?style=for-the-badge&logo=graduation-cap&logoColor=white)

**AI-Powered School Operations Platform for African Private Schools**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![IBM watsonx](https://img.shields.io/badge/IBM-watsonx.ai-054ADA?style=flat&logo=ibm&logoColor=white)](https://www.ibm.com/watsonx)

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo-guide) • [Documentation](#-documentation) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Demo Guide](#-demo-guide)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Schora** transforms teacher lesson reflections into actionable intelligence using IBM watsonx.ai. Built specifically for African private schools, Schora provides:

- 🎓 **AI Lesson Feedback Coach** - Personalized coaching for every teacher
- 📊 **Weekly Executive Briefings** - Data-driven insights for school leaders
- 👥 **Dual-Role Interface** - Seamless admin and teacher experiences
- 📱 **Mobile-First Design** - Optimized for smartphones and tablets

### The Problem We Solve

African private schools face critical challenges:
- School leaders manage 20-50 teachers with minimal support staff
- Teachers receive generic feedback, not personalized coaching
- Critical patterns (struggling teachers, curriculum gaps) go unnoticed
- Decision-making is based on gut feeling, not data

### Our Solution

Schora leverages IBM watsonx.ai to provide:
- **Instant AI feedback** on every lesson (5 minutes → 30 seconds)
- **Personalized coaching** at scale for all teachers
- **Executive briefings** generated in 30 seconds (vs 3 hours manually)
- **Proactive interventions** based on data patterns

---

## ✨ Features

### 1. AI Lesson Feedback Coach 🎓

Teachers submit lesson reflections and receive instant AI-powered feedback:

- ✅ **Strengths** - What went well in the lesson
- 📈 **Growth Areas** - Specific areas to improve
- 💡 **Concrete Suggestions** - Actionable next steps
- 🚩 **Risk Flags** - Urgent issues requiring attention
- ❓ **Follow-up Questions** - Deepen teacher reflection
- 📊 **Confidence Score** - AI certainty level

**Powered by:** IBM watsonx.ai Granite 13B Instruct v2

### 2. Weekly Executive Briefing 📊

School leaders get comprehensive weekly reports:

- 🏥 **School Health Score** (0-10 scale)
- 👨‍🏫 **Teacher Status Summaries** (on-track, needs support, at-risk)
- ⚠️ **Top Risks** requiring immediate attention
- 🏆 **Notable Wins** to celebrate
- 🎯 **Suggested Interventions** with specific actions
- 💬 **Check-in Questions** for leadership meetings

### 3. Dual-Role Interface 👥

**Admin Dashboard:**
- School-wide KPIs and metrics
- All teachers and lessons view
- Weekly briefing generator
- Teacher performance tracking

**Teacher Dashboard:**
- Personal performance insights
- My lessons history
- AI career coach
- Growth trend charts

### 4. Mobile-First Design 📱

- Responsive at 375px width (iPhone SE)
- Touch-friendly 44x44px minimum targets
- Fixed top bar and bottom navigation
- iOS safe area support
- Progressive enhancement for desktop

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5.x
- **Language:** TypeScript 6.x
- **AI Platform:** IBM watsonx.ai
- **Testing:** Jest 30.x + Supertest 7.x
- **HTTP Client:** Axios 1.16.0

### Frontend
- **Framework:** React 19.x
- **Language:** TypeScript 4.9.x
- **Styling:** Tailwind CSS 3.x (CDN)
- **Icons:** Material Symbols
- **Fonts:** Inter, JetBrains Mono

### AI/ML
- **Model:** IBM Granite 13B Instruct v2
- **Platform:** IBM watsonx.ai
- **Authentication:** IAM token exchange
- **Fallback:** Stub responses for 100% uptime

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- IBM Cloud account (optional - app works without it)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Clasquera
```

2. **Install backend dependencies**
```bash
cd schora-api
npm install
```

3. **Install frontend dependencies**
```bash
cd ../schora-ui
npm install
```

### Running the Application

#### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd schora-api
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd schora-ui
npm start
```
Frontend opens automatically at `http://localhost:3000`

#### Option 2: Production Build

**Backend:**
```bash
cd schora-api
npm run build
npm start
```

**Frontend:**
```bash
cd schora-ui
npm run build
# Serve the build/ directory with your preferred static server
```

### Environment Configuration (Optional)

For real IBM watsonx.ai integration:

1. **Create `.env` file in `schora-api/`**
```bash
cp .env.example .env
```

2. **Add your IBM Cloud credentials**
```env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
```

**Note:** App works perfectly without credentials using fallback stubs!

---

## 📁 Project Structure

```
Clasquera/
├── schora-api/                 # Backend API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   ├── lessonFeedback.ts
│   │   │   ├── weeklyBriefing.ts
│   │   │   └── lessons.ts
│   │   ├── services/          # Business logic
│   │   │   ├── watsonx.ts    # AI integration
│   │   │   └── store.ts      # Data persistence
│   │   ├── types/            # TypeScript interfaces
│   │   │   └── schemas.ts
│   │   ├── app.ts            # Express config
│   │   └── server.ts         # Entry point
│   ├── data/                 # JSON data store
│   │   ├── lessons.json      # 12 seed lessons
│   │   └── briefings.json    # Generated briefings
│   ├── tests/                # Jest tests
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── schora-ui/                 # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # 9 reusable components
│   │   │   └── screens/      # 5 screen components
│   │   ├── api/
│   │   │   └── client.ts     # API integration
│   │   ├── App.tsx           # Root component
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── bobsessions/               # Development logs
├── PROJECT_OVERVIEW.md        # Comprehensive docs
└── README.md                  # This file
```

---

## 🎮 Demo Guide

### Getting Started

1. **Start both servers** (see [Quick Start](#-quick-start))
2. **Open browser** at `http://localhost:3000`
3. **App loads directly** - no login required (demo mode)

### Demo Flow

#### 1. Admin Dashboard (Default View)

**What to show:**
- School-wide KPIs (12 lessons, 5 teachers, engagement metrics)
- Recent lessons feed with real data
- Teacher quality metrics
- AI Weekly Briefing preview

**Actions:**
- Click **"Get Feedback"** on any lesson → Generates AI feedback
- View lesson detail with personalized coaching
- Click **"Generate Full Briefing"** → Creates executive summary

#### 2. Lessons Directory

**What to show:**
- All 12 lessons in searchable table
- Teacher names, subjects, dates, engagement levels
- Search functionality (try "Mathematics" or "Amara")

**Actions:**
- Click **"ANALYZE"** button → View AI feedback
- Search and filter lessons

#### 3. Weekly Briefing

**What to show:**
- School health score (0-10)
- Teacher status summaries (on-track, needs support, at-risk)
- Top risks and notable wins
- Suggested interventions
- Check-in questions

**Actions:**
- Click **"Regenerate Briefing"** → Fresh AI analysis
- Review all sections

#### 4. Teacher Dashboard

**What to show:**
- Switch to teacher view (click "SWITCH TO TEACHER" button)
- Personal KPIs (7 lessons, 86% engagement rate)
- My recent lessons
- AI Career Coach insights
- Performance trend charts

**Actions:**
- Browse personal lessons
- View AI coaching suggestions
- Check performance trends

### Demo Tips

✅ **Use Chrome DevTools** mobile view (F12 → Toggle Device Toolbar)  
✅ **Try iPhone SE (375px)** or iPhone 12 Pro (390px) for mobile  
✅ **Desktop view** shows sidebar navigation  
✅ **Role switching** works instantly (no page reload)  
✅ **AI fallback stubs** ensure 100% uptime  

### Sample Demo Script

> "Schora is an AI-powered school operations platform built for African private schools. Let me show you how it works..."
>
> **[Admin Dashboard]**  
> "Here's the school leader's view. We have 12 lessons from 5 teachers. Notice the real-time engagement metrics and behavior incident tracking."
>
> **[Click Get Feedback]**  
> "When I click 'Get Feedback', IBM watsonx.ai analyzes the lesson and generates personalized coaching. See the strengths, growth areas, and concrete suggestions? This is what every teacher receives instantly."
>
> **[Weekly Briefing]**  
> "Now let's generate the weekly executive briefing. This normally takes school leaders 3 hours to prepare manually. Watch..."
>
> **[After generation]**  
> "In 30 seconds, we have a comprehensive report: school health score, teacher summaries, top risks, and specific interventions. This is what the principal reviews every Monday morning."
>
> **[Switch to Teacher]**  
> "Now let's see the teacher's view. Here's Adebayo Johnson's personal dashboard. He can see his 7 lessons, 86% engagement rate, and AI career coaching suggestions tailored just for him."

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 1. GET /lessons
Fetch all lesson records

**Response:**
```json
{
  "lessons": [
    {
      "teacher_id": "T001",
      "teacher_name": "Amara Okafor",
      "subject": "Mathematics",
      "date": "2024-01-15",
      "lesson_title": "Introduction to Fractions",
      "objectives": ["Understand fractions"],
      "reflection_text": "Lesson went well...",
      "student_engagement_level": "high",
      "behavior_incidents": 0
    }
  ]
}
```

#### 2. POST /lesson-feedback
Generate AI feedback for a lesson

**Request:**
```json
{
  "lesson": {
    "teacher_id": "T001",
    "teacher_name": "Amara Okafor",
    "subject": "Mathematics",
    "date": "2024-01-15",
    "lesson_title": "Introduction to Fractions",
    "objectives": ["Understand fractions"],
    "reflection_text": "Lesson went well",
    "student_engagement_level": "high",
    "behavior_incidents": 0
  }
}
```

**Response:**
```json
{
  "feedback": {
    "lesson_id": "1777744575442",
    "teacher_id": "T001",
    "teacher_name": "Amara Okafor",
    "strengths": ["Clear objectives", "Good engagement"],
    "areas_for_growth": ["Time management"],
    "concrete_suggestions": ["Allocate 10 min for assessment"],
    "risk_flags": [],
    "overall_tone": "positive",
    "follow_up_questions_for_teacher": ["What would you improve?"],
    "confidence_score": 0.85
  }
}
```

#### 3. POST /weekly-briefing
Generate weekly executive briefing

**Request:**
```json
{
  "school_leader_id": "SL001",
  "week_start": "2024-01-15",
  "week_end": "2024-01-21",
  "feedback_list": [...]
}
```

**Response:**
```json
{
  "briefing": {
    "week_start": "2024-01-15",
    "week_end": "2024-01-21",
    "school_leader_id": "SL001",
    "teacher_summaries": [...],
    "top_risks": [...],
    "notable_wins": [...],
    "suggested_interventions": [...],
    "questions_to_discuss_in_checkin": [...],
    "overall_school_health_score": 7.5
  }
}
```

#### 4. GET /weekly-briefing/latest
Get most recent briefing

**Response:**
```json
{
  "briefing": { ... }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## ⚙️ Configuration

### Backend Configuration

**Environment Variables (.env):**
```env
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# Server Configuration
PORT=3001
NODE_ENV=development
```

**TypeScript Configuration (tsconfig.json):**
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps enabled

### Frontend Configuration

**Tailwind Configuration (public/index.html):**
- Dark mode always on
- Custom color palette
- Material Symbols icons
- Inter and JetBrains Mono fonts

**API Configuration (src/api/client.ts):**
```typescript
export const API = 'http://localhost:3001/api';
```

---

## 💻 Development

### Backend Development

**Start development server:**
```bash
cd schora-api
npm run dev
```
- Auto-reloads on file changes
- TypeScript compilation on-the-fly
- Runs on port 3001

**Build for production:**
```bash
npm run build
```
- Compiles TypeScript to JavaScript
- Output in `dist/` directory

**Run production build:**
```bash
npm start
```

### Frontend Development

**Start development server:**
```bash
cd schora-ui
npm start
```
- Opens browser automatically
- Hot module replacement
- Runs on port 3000

**Build for production:**
```bash
npm run build
```
- Optimized production build
- Output in `build/` directory

### Code Quality

**Backend:**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Jest for testing

**Frontend:**
- TypeScript strict mode
- React best practices
- Tailwind CSS utilities
- Component-based architecture

---

## 🧪 Testing

### Backend Tests

**Run all tests:**
```bash
cd schora-api
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Test Coverage:**
- 20 test cases total
- Lesson feedback endpoint: 8 tests
- Weekly briefing endpoint: 10 tests
- Latest briefing endpoint: 2 tests

### Frontend Tests

```bash
cd schora-ui
npm test
```

### Manual Testing

**Test Checklist:**
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Dashboard shows 12 lessons
- [ ] Get Feedback generates AI response
- [ ] Weekly Briefing generates successfully
- [ ] Role switching works (Admin ↔ Teacher)
- [ ] Search functionality works
- [ ] Mobile view responsive at 375px
- [ ] Desktop view shows sidebar
- [ ] All API endpoints return 200

---

## 🚢 Deployment

### Backend Deployment

**Recommended Platforms:**
- Heroku
- Railway
- AWS Elastic Beanstalk
- Google Cloud Run

**Deployment Steps:**
1. Set environment variables
2. Build TypeScript: `npm run build`
3. Start server: `npm start`
4. Configure CORS for production domain

**Environment Variables:**
```env
WATSONX_API_KEY=<production-key>
WATSONX_PROJECT_ID=<production-project>
PORT=3001
NODE_ENV=production
```

### Frontend Deployment

**Recommended Platforms:**
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Deployment Steps:**
1. Update API base URL in `src/api/client.ts`
2. Build: `npm run build`
3. Deploy `build/` directory
4. Configure custom domain (optional)

**Production API URL:**
```typescript
export const API = 'https://your-api-domain.com/api';
```

### Docker Deployment (Optional)

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests
6. Submit a pull request

### Coding Standards

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Use meaningful commit messages
- Follow existing code style

### Pull Request Process

1. Update README.md with details of changes
2. Update API documentation if needed
3. Ensure all tests pass
4. Request review from maintainers

---

## 📄 License

[Specify your license here - MIT, Apache 2.0, etc.]

---

## 🙏 Acknowledgments

- **IBM watsonx.ai** - AI/ML platform
- **IBM Bob** - Development assistant
- **React Team** - Frontend framework
- **Express Team** - Backend framework
- **TypeScript Team** - Type safety
- **Tailwind CSS** - Styling framework

---

## 📞 Support

For issues, questions, or feedback:

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Email:** support@schora.ai
- **Documentation:** [Full Documentation](./PROJECT_OVERVIEW.md)

---

## 🗺️ Roadmap

### Phase 4: Enhanced Features (Q3 2026)
- Real authentication with JWT
- User management
- Form validation
- Data caching
- Error boundaries

### Phase 5: Desktop Support (Q4 2026)
- Desktop layout components
- Responsive breakpoints
- Keyboard shortcuts
- Print-friendly views

### Phase 6: Advanced Features (Q1 2027)
- Search functionality
- Filtering and sorting
- Pagination
- Data export (PDF, CSV)
- Notifications system

### Phase 7: Database & Scale (Q2 2027)
- PostgreSQL migration
- Redis caching
- Prisma ORM
- Performance monitoring

### Phase 8: AI Enhancements (Q3 2027)
- Custom fine-tuned models
- Multi-model support
- Predictive analytics
- Automated interventions

### Phase 9: Mobile Apps (Q4 2027)
- React Native iOS app
- React Native Android app
- Offline support
- Push notifications

---

## 📊 Project Stats

- **Development Time:** ~7 hours
- **Lines of Code:** ~3,500
- **Components:** 17
- **API Endpoints:** 4
- **Test Cases:** 20
- **Supported Languages:** English
- **Target Market:** African Private Schools
- **Students Impacted:** 15M+ potential

---

<div align="center">

**Built with ❤️ for African Schools**

**Powered by IBM watsonx.ai**

**Made with Bob 🤖**

[⬆ Back to Top](#schora---ai-school-operations-platform)

</div>