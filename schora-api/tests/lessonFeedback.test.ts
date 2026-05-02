import request from 'supertest';
import app from '../src/app';
import { TeacherLessonRecord } from '../src/types/schemas';

describe('POST /api/lesson-feedback', () => {
  const validLesson: TeacherLessonRecord = {
    teacher_id: 'T001',
    teacher_name: 'Test Teacher',
    subject: 'Mathematics',
    date: '2024-01-15',
    lesson_title: 'Test Lesson',
    objectives: ['Objective 1', 'Objective 2'],
    reflection_text: 'This is a test reflection',
    student_engagement_level: 'high',
    behavior_incidents: 0
  };

  it('should return 200 with feedback for valid lesson record', async () => {
    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: validLesson })
      .expect(200);

    expect(response.body).toHaveProperty('feedback');
    expect(response.body.feedback).toHaveProperty('lesson_id');
    expect(response.body.feedback).toHaveProperty('teacher_id', validLesson.teacher_id);
    expect(response.body.feedback).toHaveProperty('strengths');
    expect(response.body.feedback).toHaveProperty('areas_for_growth');
    expect(response.body.feedback).toHaveProperty('concrete_suggestions');
    expect(response.body.feedback).toHaveProperty('risk_flags');
    expect(response.body.feedback).toHaveProperty('overall_tone');
    expect(response.body.feedback).toHaveProperty('follow_up_questions_for_teacher');
    expect(response.body.feedback).toHaveProperty('confidence_score');
    
    expect(Array.isArray(response.body.feedback.strengths)).toBe(true);
    expect(Array.isArray(response.body.feedback.areas_for_growth)).toBe(true);
    expect(Array.isArray(response.body.feedback.concrete_suggestions)).toBe(true);
    expect(Array.isArray(response.body.feedback.risk_flags)).toBe(true);
    expect(Array.isArray(response.body.feedback.follow_up_questions_for_teacher)).toBe(true);
    expect(typeof response.body.feedback.confidence_score).toBe('number');
  });

  it('should return 400 when lesson is missing', async () => {
    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({})
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when lesson is not an object', async () => {
    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: 'not an object' })
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when required field teacher_id is missing', async () => {
    const invalidLesson = { ...validLesson };
    delete (invalidLesson as any).teacher_id;

    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: invalidLesson })
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when required field objectives is missing', async () => {
    const invalidLesson = { ...validLesson };
    delete (invalidLesson as any).objectives;

    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: invalidLesson })
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when objectives is not an array', async () => {
    const invalidLesson = { ...validLesson, objectives: 'not an array' };

    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: invalidLesson })
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when required field reflection_text is missing', async () => {
    const invalidLesson = { ...validLesson };
    delete (invalidLesson as any).reflection_text;

    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: invalidLesson })
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should accept lesson with optional fields', async () => {
    const lessonWithOptionals: TeacherLessonRecord = {
      ...validLesson,
      activities_summary: 'Test activities',
      challenges: 'Test challenges',
      successes: 'Test successes',
      assessment_snapshot: 'Test assessment',
      free_text_notes: 'Test notes'
    };

    const response = await request(app)
      .post('/api/lesson-feedback')
      .send({ lesson: lessonWithOptionals })
      .expect(200);

    expect(response.body).toHaveProperty('feedback');
    expect(response.body.feedback.teacher_id).toBe(validLesson.teacher_id);
  });
});

// Made with Bob
