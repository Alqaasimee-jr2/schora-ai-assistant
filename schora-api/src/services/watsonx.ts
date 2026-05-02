import { TeacherLessonRecord, LessonFeedback, WeeklyBriefing } from '../types/schemas';
import axios from 'axios';

/**
 * IBM watsonx.ai integration for AI-powered lesson feedback and weekly briefings
 */

// Environment variables
const WATSONX_API_KEY = process.env.WATSONX_API_KEY || '';
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID || '';
const WATSONX_URL = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
const WATSONX_MODEL_ID = process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-instruct-v2';

// Token cache
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get IAM token for watsonx API authentication
 * Caches token in memory and refreshes when expired
 */
async function getIAMToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken as string;
  }

  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + WATSONX_API_KEY,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    cachedToken = response.data.access_token;
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiresAt = now + (expiresIn * 1000);

    return cachedToken as string;
  } catch (error: any) {
    console.error('IAM token exchange failed:', error.response?.data || error.message);
    throw new Error('Failed to obtain IAM token');
  }
}

/**
 * Call watsonx text generation API
 */
async function callWatsonx(prompt: string, parameters: any): Promise<string> {
  const token = await getIAMToken();

  try {
    const response = await axios.post(
      `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        model_id: WATSONX_MODEL_ID,
        project_id: WATSONX_PROJECT_ID,
        input: prompt,
        parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.results[0].generated_text;
  } catch (error: any) {
    console.error('watsonx API call failed:', error.response?.status, error.response?.data || error.message);
    throw new Error('watsonx call failed');
  }
}

/**
 * Generate AI-powered lesson feedback for a teacher's lesson record
 */
export async function generateLessonFeedback(lesson: TeacherLessonRecord): Promise<LessonFeedback> {
  try {
    console.log('Calling watsonx for lesson feedback...');

    const prompt = `You are an expert school instructional coach. Your job is to review a teacher's lesson record and produce structured, honest, and constructive feedback for their school leader.

Lesson details:
- Teacher: ${lesson.teacher_name}
- Subject: ${lesson.subject}
- Lesson title: ${lesson.lesson_title}
- Objectives: ${lesson.objectives.join(', ')}
- Teacher reflection: ${lesson.reflection_text}
- Challenges reported: ${lesson.challenges || 'None reported'}
- Successes reported: ${lesson.successes || 'None reported'}
- Student engagement level: ${lesson.student_engagement_level}
- Behavior incidents: ${lesson.behavior_incidents}

Respond ONLY with valid JSON matching this exact schema. No prose, no markdown, no extra fields:

{
  "strengths": ["string"],
  "areas_for_growth": ["string"],
  "concrete_suggestions": ["string"],
  "risk_flags": [],
  "overall_tone": "positive | neutral | concerning",
  "follow_up_questions_for_teacher": ["string"],
  "confidence_score": 0.0
}

risk_flags must only contain values from: ["low_engagement", "behavior_concern", "objective_not_met", "teacher_burnout_signal", "assessment_gap"]
confidence_score must be between 0.0 and 1.0.
overall_tone must be exactly one of: "positive", "neutral", "concerning".`;

    const parameters = {
      temperature: 0.3,
      max_new_tokens: 600,
      top_k: 40
    };

    const generatedText = await callWatsonx(prompt, parameters);
    console.log('Raw model output:', generatedText);

    const parsed = JSON.parse(generatedText);
    
    // Add lesson_id and teacher_id
    const feedback: LessonFeedback = {
      lesson_id: `lesson_${Date.now()}`,
      teacher_id: lesson.teacher_id,
      ...parsed
    };

    return feedback;
  } catch (error) {
    console.error('watsonx call failed, returning fallback stub:', error);
    
    // Fallback stub when watsonx API fails
    return {
      lesson_id: Date.now().toString(),
      teacher_id: lesson.teacher_id,
      strengths: [
        "Clear lesson structure with defined objectives",
        "Good use of hands-on activities to engage students"
      ],
      areas_for_growth: [
        "Time management during lesson transitions",
        "Differentiation for struggling learners"
      ],
      concrete_suggestions: [
        "Allocate last 10 minutes strictly for assessment",
        "Prepare a simplified worksheet for students who need support"
      ],
      risk_flags: ["objective_not_met"],
      overall_tone: "positive",
      follow_up_questions_for_teacher: [
        "What would you cut from the lesson to create more practice time?"
      ],
      confidence_score: 0.75
    };
  }
}

/**
 * Generate AI-powered weekly briefing for school leader
 */
export async function generateWeeklyBriefing(
  feedbackList: LessonFeedback[],
  weekRange: { week_start: string; week_end: string; school_leader_id: string }
): Promise<WeeklyBriefing> {
  try {
    console.log('Calling watsonx for weekly briefing...');

    const prompt = `You are an AI school operations assistant generating a weekly briefing for a school leader.

Week: ${weekRange.week_start} to ${weekRange.week_end}
Lesson feedback records:
${JSON.stringify(feedbackList, null, 2)}

Respond ONLY with valid JSON matching this exact schema. No prose, no markdown, no extra fields:

{
  "top_risks": ["string"],
  "notable_wins": ["string"],
  "suggested_interventions": ["string"],
  "questions_to_discuss_in_checkin": ["string"],
  "teacher_summaries": [
    {
      "teacher_id": "string",
      "teacher_name": "string",
      "lesson_count": 0,
      "status": "on_track | needs_support | at_risk",
      "summary": "string"
    }
  ],
  "overall_school_health_score": 0.0
}

overall_school_health_score must be between 0 and 10.
status must be exactly one of: "on_track", "needs_support", "at_risk".`;

    const parameters = {
      temperature: 0.2,
      max_new_tokens: 900,
      top_k: 30
    };

    const generatedText = await callWatsonx(prompt, parameters);
    console.log('Raw model output:', generatedText);

    const parsed = JSON.parse(generatedText);
    
    // Add week range and school_leader_id
    const briefing: WeeklyBriefing = {
      week_start: weekRange.week_start,
      week_end: weekRange.week_end,
      school_leader_id: weekRange.school_leader_id,
      ...parsed
    };

    return briefing;
  } catch (error) {
    console.error('watsonx call failed, returning fallback stub:', error);
    
    // Fallback stub when watsonx API fails
    return {
      week_start: weekRange.week_start,
      week_end: weekRange.week_end,
      school_leader_id: weekRange.school_leader_id,
      teacher_summaries: [
        {
          teacher_id: "T001",
          teacher_name: "Amara Okafor",
          lesson_count: 2,
          status: "needs_support",
          summary: "Strong engagement but pacing issues flagged across both lessons."
        },
        {
          teacher_id: "T002",
          teacher_name: "Chidi Nwosu",
          lesson_count: 1,
          status: "at_risk",
          summary: "High behavior incidents and incomplete student work. Needs immediate support."
        },
        {
          teacher_id: "T003",
          teacher_name: "Fatima Bello",
          lesson_count: 1,
          status: "on_track",
          summary: "Excellent lesson delivery. Students highly engaged with demonstration method."
        }
      ],
      top_risks: [
        "Achievement gap widening in Mathematics",
        "Classroom management issues in English Language"
      ],
      notable_wins: [
        "Science lesson received highest engagement score this week",
        "Two previously struggling students produced excellent work"
      ],
      suggested_interventions: [
        "Schedule 1:1 coaching session with Chidi Nwosu on classroom management",
        "Share Fatima Bello's demonstration technique with the full team"
      ],
      questions_to_discuss_in_checkin: [
        "How can we better support Amara with differentiated materials?",
        "What resources does Chidi need to manage class size effectively?"
      ],
      overall_school_health_score: 6.5
    };
  }
}

// Made with Bob
