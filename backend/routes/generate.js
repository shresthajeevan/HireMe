import express from 'express';
import { enhanceResume, generateLatexFromData } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/generate
 * Generate AI-enhanced LaTeX resume
 */
router.post('/', async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        // Validate input
        if (!resumeData) {
            return res.status(400).json({
                error: 'Missing resumeData in request body'
            });
        }

        // Job description is optional but recommended
        const jd = jobDescription || 'General software engineering position';

        // Removed debug logs

        // Enhance resume using AI
        const enhancedData = await enhanceResume(resumeData, jd);

        console.log('Generating LaTeX code...');

        // Generate LaTeX from enhanced data
        const latexCode = generateLatexFromData(enhancedData);

        // Return both the enhanced data and LaTeX code
        res.json({
            success: true,
            latexCode,
            enhancedData
        });

    } catch (error) {
        console.error('Generate endpoint error:', error);
        res.status(500).json({
            error: 'Failed to generate resume',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
