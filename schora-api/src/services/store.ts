import * as fs from 'fs';
import * as path from 'path';
import { TeacherLessonRecord, WeeklyBriefing } from '../types/schemas';

const DATA_DIR = path.join(__dirname, '../../data');
const LESSONS_FILE = path.join(DATA_DIR, 'lessons.json');
const BRIEFINGS_FILE = path.join(DATA_DIR, 'briefings.json');

export function readLessons(): TeacherLessonRecord[] {
  try {
    const data = fs.readFileSync(LESSONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading lessons.json:', error);
    return [];
  }
}

export function readBriefings(): WeeklyBriefing[] {
  try {
    const data = fs.readFileSync(BRIEFINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading briefings.json:', error);
    return [];
  }
}

export function saveBriefing(briefing: WeeklyBriefing): void {
  try {
    const briefings = readBriefings();
    briefings.push(briefing);
    fs.writeFileSync(BRIEFINGS_FILE, JSON.stringify(briefings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving briefing:', error);
    throw error;
  }
}

export function getLatestBriefing(): WeeklyBriefing | null {
  try {
    const briefings = readBriefings();
    return briefings.length > 0 ? briefings[briefings.length - 1] : null;
  } catch (error) {
    console.error('Error getting latest briefing:', error);
    return null;
  }
}

// Made with Bob
