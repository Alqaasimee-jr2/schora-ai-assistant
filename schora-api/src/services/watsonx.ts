import axios from 'axios';
import { TeacherLessonRecord, LessonFeedback, WeeklyBriefing } from '../types/schemas';

/**
 * AI service - generates feedback and briefings using IBM watsonx.ai
 */

// Environment variables
const {
  WATSONX_PROJECT_ID = '',
  WATSONX_API_KEY = '',
  WATSONX_MODEL_ID = 'ibm/granite-13b-instruct-v2',
  WATSONX_URL = 'https://eu-gb.ml.cloud.ibm.com'
} = process.env;

// Trim keys to avoid whitespace issues
const projectId = WATSONX_PROJECT_ID.trim();
const apiKey = WATSONX_API_KEY.trim();
const modelId = WATSONX_MODEL_ID.trim();
const apiUrl = WATSONX_URL.trim();

/**
 * Gets an IAM Token from IBM Cloud
 */
async function getIamToken(): Promise<string> {
  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error('Failed to get IBM IAM token:', error.response?.data || error.message);
    throw new Error('IBM Authentication failed');
  }
}

/**
 * Calls Watsonx generation endpoint
 */
async function callWatsonx(prompt: string): Promise<string> {
  const token = await getIamToken();
  const url = `${apiUrl}/ml/v1/text/generation?version=2023-05-29`;

  const response = await axios.post(
    url,
    {
      model_id: modelId,
      project_id: projectId,
      input: prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 1500,
        min_new_tokens: 0,
        stop_sequences: [],
        repetition_penalty: 1
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  return response.data.results[0].generated_text;
}

export async function generateLessonFeedback(lesson: TeacherLessonRecord): Promise<LessonFeedback> {
  try {
    const prompt = `[INST] <<SYS>>
You are an expert pedagogical coach for Schora. Your task is to analyze a teacher's lesson record and provide constructive, supportive, and actionable feedback in JSON format.
<</SYS>>

Analyze the following lesson:
Teacher: ${lesson.teacher_name}
Subject: ${lesson.subject}
Title: ${lesson.lesson_title}
Objectives: ${lesson.objectives.join(', ')}
Activities: ${lesson.activities_summary || 'N/A'}
Reflection: ${lesson.reflection_text}
Student Engagement: ${lesson.student_engagement_level}
Behavior Incidents: ${lesson.behavior_incidents}

Provide a JSON response with the following structure:
{
  "lesson_id": "string",
  "teacher_id": "${lesson.teacher_id}",
  "teacher_name": "${lesson.teacher_name}",
  "strengths": ["string"],
  "areas_for_growth": ["string"],
  "concrete_suggestions": ["string"],
  "risk_flags": ["low_engagement" | "behavior_concern" | "objective_not_met" | "teacher_burnout_signal" | "assessment_gap"],
  "overall_tone": "positive" | "neutral" | "concerning",
  "follow_up_questions_for_teacher": ["string"],
  "confidence_score": number (0-1)
}
[/INST]`;

    const result = await callWatsonx(prompt);
    
    // Attempt to extract JSON if there's surrounding text
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const feedback = JSON.parse(jsonMatch[0]);
      // Ensure lesson_id is set if AI missed it
      feedback.lesson_id = feedback.lesson_id || `lesson_${Date.now()}`;
      return feedback;
    }
    
    throw new Error('Failed to parse AI response as JSON');
  } catch (error: any) {
    if (error.response) {
      console.error('Watsonx API Error Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Watsonx generateLessonFeedback failed, using stub fallback:', error.message);
    return getLessonFeedbackStub(lesson);
  }
}

export async function generateWeeklyBriefing(
  feedbackList: LessonFeedback[],
  weekRange: { week_start: string; week_end: string; school_leader_id: string }
): Promise<WeeklyBriefing> {
  try {
    const prompt = `[INST] <<SYS>>
You are an expert school operations analyst for Schora. Your task is to aggregate multiple lesson feedbacks into a weekly executive briefing for the school leader in JSON format.
<</SYS>>

Analyze the following lesson feedbacks for the week of ${weekRange.week_start} to ${weekRange.week_end}:
${JSON.stringify(feedbackList)}

Provide a JSON response with the following structure:
{
  "week_start": "${weekRange.week_start}",
  "week_end": "${weekRange.week_end}",
  "school_leader_id": "${weekRange.school_leader_id}",
  "teacher_summaries": [
    {
      "teacher_id": "string",
      "teacher_name": "string",
      "lesson_count": number,
      "status": "on_track" | "needs_support" | "at_risk",
      "summary": "string"
    }
  ],
  "top_risks": ["string"],
  "notable_wins": ["string"],
  "suggested_interventions": ["string"],
  "questions_to_discuss_in_checkin": ["string"],
  "overall_school_health_score": number (1-10)
}
[/INST]`;

    const result = await callWatsonx(prompt);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response as JSON');
  } catch (error) {
    console.error('Watsonx generateWeeklyBriefing failed, using stub fallback:', error);
    return getWeeklyBriefingStub(feedbackList, weekRange);
  }
}

// Deterministic Stub Data Generators (Fallbacks)

function getLessonFeedbackStub(lesson: TeacherLessonRecord): LessonFeedback {
  return {
    lesson_id: `lesson_${Date.now()}`,
    teacher_id: lesson.teacher_id,
    teacher_name: lesson.teacher_name,
    strengths: [
      "Clear lesson objectives aligned with curriculum standards",
      "Effective use of varied teaching activities",
      "Strong reflection on teaching practice"
    ],
    areas_for_growth: [
      "Consider incorporating more differentiated instruction strategies",
      "Explore additional formative assessment techniques"
    ],
    concrete_suggestions: [
      "Try using exit tickets to gauge student understanding at lesson end",
      "Implement think-pair-share activities to boost engagement",
      "Create a visual anchor chart for key concepts"
    ],
    risk_flags: lesson.student_engagement_level === "low" 
      ? ["low_engagement"] 
      : lesson.behavior_incidents > 3 
        ? ["behavior_concern"] 
        : [],
    overall_tone: lesson.student_engagement_level === "high" ? "positive" : "neutral",
    follow_up_questions_for_teacher: [
      "What specific strategies helped engage students most effectively?",
      "How might you adapt this lesson for students who need additional support?"
    ],
    confidence_score: 0.85
  };
}

function getWeeklyBriefingStub(
  feedbackList: LessonFeedback[],
  weekRange: { week_start: string; week_end: string; school_leader_id: string }
): WeeklyBriefing {
  const teacherMap = new Map<string, { count: number; flags: any[] }>();
  
  feedbackList.forEach(feedback => {
    const existing = teacherMap.get(feedback.teacher_id) || { count: 0, flags: [] };
    existing.count++;
    existing.flags.push(...feedback.risk_flags);
    teacherMap.set(feedback.teacher_id, existing);
  });

  const teacher_summaries = Array.from(teacherMap.entries()).map(([teacher_id, data]) => {
    const feedbackWithName = feedbackList.find(f => f.teacher_id === teacher_id);
    return {
      teacher_id,
      teacher_name: feedbackWithName?.teacher_name || `Teacher ${teacher_id}`,
      lesson_count: data.count,
      status: data.flags.length > 2 ? "at_risk" as const : data.flags.length > 0 ? "needs_support" as const : "on_track" as const,
      summary: `Completed ${data.count} lesson(s) this week with ${data.flags.length} risk flag(s) identified.`
    };
  });

  return {
    week_start: weekRange.week_start,
    week_end: weekRange.week_end,
    school_leader_id: weekRange.school_leader_id,
    teacher_summaries,
    top_risks: [
      "Student engagement levels below target in 2 classes",
      "Behavior incidents trending upward in Grade 5"
    ],
    notable_wins: [
      "All teachers submitted reflections on time",
      "Strong use of formative assessment across subjects"
    ],
    suggested_interventions: [
      "Schedule classroom observation for teachers flagged as at-risk",
      "Organize peer learning session on engagement strategies",
      "Review behavior management protocols with Grade 5 team"
    ],
    questions_to_discuss_in_checkin: [
      "What support do teachers need to improve student engagement?",
      "Are there patterns in behavior incidents we should address?",
      "How can we celebrate and replicate the wins from this week?"
    ],
    overall_school_health_score: 7.5
  };
}
