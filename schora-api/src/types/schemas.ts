export interface TeacherLessonRecord {
  teacher_id: string;
  teacher_name: string;
  subject: string;
  date: string;
  lesson_title: string;
  objectives: string[];
  activities_summary?: string;
  reflection_text: string;
  challenges?: string;
  successes?: string;
  student_engagement_level: "low" | "medium" | "high";
  behavior_incidents: number;
  assessment_snapshot?: string;
  free_text_notes?: string;
}

export interface LessonFeedback {
  lesson_id: string;
  teacher_id: string;
  teacher_name: string;
  strengths: string[];
  areas_for_growth: string[];
  concrete_suggestions: string[];
  risk_flags: Array<"low_engagement" | "behavior_concern" | "objective_not_met" | "teacher_burnout_signal" | "assessment_gap">;
  overall_tone: "positive" | "neutral" | "concerning";
  follow_up_questions_for_teacher: string[];
  confidence_score: number;
}

export interface WeeklyBriefing {
  week_start: string;
  week_end: string;
  school_leader_id: string;
  teacher_summaries: Array<{
    teacher_id: string;
    teacher_name: string;
    lesson_count: number;
    status: "on_track" | "needs_support" | "at_risk";
    summary: string;
  }>;
  top_risks: string[];
  notable_wins: string[];
  suggested_interventions: string[];
  questions_to_discuss_in_checkin: string[];
  overall_school_health_score: number;
}

// Made with Bob
