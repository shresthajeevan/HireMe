import express from 'express';
import { chatAboutResume } from '../services/aiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { rawResume, jobDescription, message } = req.body;
    if (!rawResume || !message) {
        return res.status(400).json({ error: 'rawResume and message are required' });
    }
    try {
        const reply = await chatAboutResume(rawResume, jobDescription || '', message);
        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message || 'Chat failed' });
    }
});

export default router;
