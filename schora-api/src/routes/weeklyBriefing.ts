import { Router, Request, Response } from 'express';
import { LessonFeedback } from '../types/schemas';
import { generateWeeklyBriefing } from '../services/watsonx';
import { saveBriefing, getLatestBriefing } from '../services/store';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { school_leader_id, week_start, week_end, feedback_list } = req.body;

    // Validate required fields
    if (!school_leader_id || !week_start || !week_end || !feedback_list) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate feedback_list is an array
    if (!Array.isArray(feedback_list)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate briefing using stubbed service
    const briefing = await generateWeeklyBriefing(
      feedback_list as LessonFeedback[],
      { school_leader_id, week_start, week_end }
    );

    // Save briefing to JSON file
    saveBriefing(briefing);

    return res.status(200).json({ briefing });
  } catch (error) {
    console.error('Error in weekly briefing route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/latest', (req: Request, res: Response) => {
  try {
    const briefing = getLatestBriefing();
    return res.status(200).json({ briefing });
  } catch (error) {
    console.error('Error getting latest briefing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// Made with Bob
