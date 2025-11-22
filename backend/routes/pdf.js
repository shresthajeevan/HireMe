import express from 'express';
import { compileToPDF, validateLatex } from '../utils/latexCompiler.js';

const router = express.Router();

/**
 * POST /api/pdf
 * Compile LaTeX code to PDF
 */
router.post('/', async (req, res) => {
    try {
        const { latexCode } = req.body;

        // Validate input
        if (!latexCode) {
            return res.status(400).json({
                error: 'Missing latexCode in request body'
            });
        }

        // Validate LaTeX code
        const validation = validateLatex(latexCode);
        if (!validation.valid) {
            return res.status(400).json({
                error: 'Invalid LaTeX code',
                validationErrors: validation.errors
            });
        }

        console.log('Compiling LaTeX to PDF...');

        // Compile to PDF
        const pdfBuffer = await compileToPDF(latexCode);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF endpoint error:', error);
        res.status(500).json({
            error: 'Failed to compile PDF',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
