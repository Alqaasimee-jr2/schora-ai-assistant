import { Router, Request, Response } from 'express';
import { TeacherLessonRecord } from '../types/schemas';
import { generateLessonFeedback } from '../services/watsonx';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { lesson } = req.body;

    // Validate required fields
    if (!lesson || typeof lesson !== 'object') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const requiredFields: (keyof TeacherLessonRecord)[] = [
      'teacher_id',
      'teacher_name',
      'subject',
      'date',
      'lesson_title',
      'objectives',
      'reflection_text',
      'student_engagement_level',
      'behavior_incidents'
    ];

    for (const field of requiredFields) {
      if (lesson[field] === undefined || lesson[field] === null) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    }

    // Validate objectives is an array
    if (!Array.isArray(lesson.objectives)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate feedback using stubbed service
    const feedback = generateLessonFeedback(lesson as TeacherLessonRecord);

    return res.status(200).json({ feedback });
  } catch (error) {
    console.error('Error in lesson feedback route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// Made with Bob
