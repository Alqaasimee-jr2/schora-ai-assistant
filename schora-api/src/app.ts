import express, { Application } from 'express';
import cors from 'cors';
import lessonFeedbackRouter from './routes/lessonFeedback';
import weeklyBriefingRouter from './routes/weeklyBriefing';
import lessonsRouter from './routes/lessons';

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/lesson-feedback', lessonFeedbackRouter);
app.use('/api/weekly-briefing', weeklyBriefingRouter);
app.use('/api/lessons', lessonsRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Schora API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

// Made with Bob
