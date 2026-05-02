import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Schora API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Lessons endpoint: http://localhost:${PORT}/api/lessons`);
  console.log(`💬 Lesson feedback: http://localhost:${PORT}/api/lesson-feedback`);
  console.log(`📊 Weekly briefing: http://localhost:${PORT}/api/weekly-briefing`);
});

// Made with Bob
