import { Router, Request, Response } from 'express';
import { readLessons } from '../services/store';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const lessons = readLessons();
    return res.status(200).json({ lessons });
  } catch (error) {
    console.error('Error in lessons route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// Made with Bob
