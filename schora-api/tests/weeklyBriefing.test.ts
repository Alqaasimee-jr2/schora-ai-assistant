import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import app from '../src/app';
import { LessonFeedback } from '../src/types/schemas';

const BRIEFINGS_FILE = path.join(__dirname, '../data/briefings.json');

describe('POST /api/weekly-briefing', () => {
  const validFeedbackList: LessonFeedback[] = [
    {
      lesson_id: 'lesson_001',
      teacher_id: 'T001',
      strengths: ['Clear objectives', 'Good engagement'],
      areas_for_growth: ['Time management'],
      concrete_suggestions: ['Use timer for activities'],
      risk_flags: [],
      overall_tone: 'positive',
      follow_up_questions_for_teacher: ['What worked well?'],
      confidence_score: 0.85
    },
    {
      lesson_id: 'lesson_002',
      teacher_id: 'T002',
      strengths: ['Creative activities'],
      areas_for_growth: ['Classroom management'],
      concrete_suggestions: ['Establish clear routines'],
      risk_flags: ['behavior_concern'],
      overall_tone: 'neutral',
      follow_up_questions_for_teacher: ['How can we support you?'],
      confidence_score: 0.75
    }
  ];

  const validRequest = {
    school_leader_id: 'SL001',
    week_start: '2024-01-15',
    week_end: '2024-01-21',
    feedback_list: validFeedbackList
  };

  // Reset briefings.json before each test
  beforeEach(() => {
    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify([]), 'utf-8');
  });

  // Clean up after all tests
  afterAll(() => {
    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify([]), 'utf-8');
  });

  it('should return 200 with briefing for valid request', async () => {
    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(validRequest)
      .expect(200);

    expect(response.body).toHaveProperty('briefing');
    expect(response.body.briefing).toHaveProperty('week_start', validRequest.week_start);
    expect(response.body.briefing).toHaveProperty('week_end', validRequest.week_end);
    expect(response.body.briefing).toHaveProperty('school_leader_id', validRequest.school_leader_id);
    expect(response.body.briefing).toHaveProperty('teacher_summaries');
    expect(response.body.briefing).toHaveProperty('top_risks');
    expect(response.body.briefing).toHaveProperty('notable_wins');
    expect(response.body.briefing).toHaveProperty('suggested_interventions');
    expect(response.body.briefing).toHaveProperty('questions_to_discuss_in_checkin');
    expect(response.body.briefing).toHaveProperty('overall_school_health_score');

    expect(Array.isArray(response.body.briefing.teacher_summaries)).toBe(true);
    expect(Array.isArray(response.body.briefing.top_risks)).toBe(true);
    expect(Array.isArray(response.body.briefing.notable_wins)).toBe(true);
    expect(Array.isArray(response.body.briefing.suggested_interventions)).toBe(true);
    expect(Array.isArray(response.body.briefing.questions_to_discuss_in_checkin)).toBe(true);
    expect(typeof response.body.briefing.overall_school_health_score).toBe('number');
  });

  it('should save briefing to briefings.json', async () => {
    await request(app)
      .post('/api/weekly-briefing')
      .send(validRequest)
      .expect(200);

    const briefingsData = fs.readFileSync(BRIEFINGS_FILE, 'utf-8');
    const briefings = JSON.parse(briefingsData);

    expect(Array.isArray(briefings)).toBe(true);
    expect(briefings.length).toBe(1);
    expect(briefings[0]).toHaveProperty('week_start', validRequest.week_start);
    expect(briefings[0]).toHaveProperty('school_leader_id', validRequest.school_leader_id);
  });

  it('should return 400 when school_leader_id is missing', async () => {
    const invalidRequest = { ...validRequest };
    delete (invalidRequest as any).school_leader_id;

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(invalidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when week_start is missing', async () => {
    const invalidRequest = { ...validRequest };
    delete (invalidRequest as any).week_start;

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(invalidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when week_end is missing', async () => {
    const invalidRequest = { ...validRequest };
    delete (invalidRequest as any).week_end;

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(invalidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when feedback_list is missing', async () => {
    const invalidRequest = { ...validRequest };
    delete (invalidRequest as any).feedback_list;

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(invalidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should return 400 when feedback_list is not an array', async () => {
    const invalidRequest = { ...validRequest, feedback_list: 'not an array' };

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(invalidRequest)
      .expect(400);

    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  it('should handle empty feedback_list', async () => {
    const requestWithEmptyList = { ...validRequest, feedback_list: [] };

    const response = await request(app)
      .post('/api/weekly-briefing')
      .send(requestWithEmptyList)
      .expect(200);

    expect(response.body).toHaveProperty('briefing');
    expect(response.body.briefing.teacher_summaries).toEqual([]);
  });
});

describe('GET /api/weekly-briefing/latest', () => {
  // Reset briefings.json before each test
  beforeEach(() => {
    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify([]), 'utf-8');
  });

  // Clean up after all tests
  afterAll(() => {
    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify([]), 'utf-8');
  });

  it('should return null when no briefings exist', async () => {
    const response = await request(app)
      .get('/api/weekly-briefing/latest')
      .expect(200);

    expect(response.body).toEqual({ briefing: null });
  });

  it('should return the latest briefing when briefings exist', async () => {
    const briefing1 = {
      week_start: '2024-01-08',
      week_end: '2024-01-14',
      school_leader_id: 'SL001',
      teacher_summaries: [],
      top_risks: [],
      notable_wins: [],
      suggested_interventions: [],
      questions_to_discuss_in_checkin: [],
      overall_school_health_score: 7.0
    };

    const briefing2 = {
      week_start: '2024-01-15',
      week_end: '2024-01-21',
      school_leader_id: 'SL001',
      teacher_summaries: [],
      top_risks: [],
      notable_wins: [],
      suggested_interventions: [],
      questions_to_discuss_in_checkin: [],
      overall_school_health_score: 8.0
    };

    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify([briefing1, briefing2]), 'utf-8');

    const response = await request(app)
      .get('/api/weekly-briefing/latest')
      .expect(200);

    expect(response.body).toHaveProperty('briefing');
    expect(response.body.briefing).toEqual(briefing2);
    expect(response.body.briefing.week_start).toBe('2024-01-15');
  });
});

// Made with Bob
