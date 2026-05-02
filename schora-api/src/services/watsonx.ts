import { TeacherLessonRecord, LessonFeedback, WeeklyBriefing } from '../types/schemas';

/**
 * Stubbed AI service - returns hardcoded responses
 * Will be replaced with real IBM watsonx.ai integration in later milestones
 */

export function generateLessonFeedback(lesson: TeacherLessonRecord): LessonFeedback {
  // Stubbed response - deterministic hardcoded feedback
  return {
    lesson_id: `lesson_${Date.now()}`,
    teacher_id: lesson.teacher_id,
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

export function generateWeeklyBriefing(
  feedbackList: LessonFeedback[],
  weekRange: { week_start: string; week_end: string; school_leader_id: string }
): WeeklyBriefing {
  // Stubbed response - deterministic hardcoded briefing
  const teacherMap = new Map<string, { count: number; flags: string[] }>();
  
  feedbackList.forEach(feedback => {
    const existing = teacherMap.get(feedback.teacher_id) || { count: 0, flags: [] };
    existing.count++;
    existing.flags.push(...feedback.risk_flags);
    teacherMap.set(feedback.teacher_id, existing);
  });

  const teacher_summaries = Array.from(teacherMap.entries()).map(([teacher_id, data]) => ({
    teacher_id,
    teacher_name: `Teacher ${teacher_id}`,
    lesson_count: data.count,
    status: data.flags.length > 2 ? "at_risk" as const : data.flags.length > 0 ? "needs_support" as const : "on_track" as const,
    summary: `Completed ${data.count} lesson(s) this week with ${data.flags.length} risk flag(s) identified.`
  }));

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

// Made with Bob
