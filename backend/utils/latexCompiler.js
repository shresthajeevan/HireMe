// Removed local latex dependencies
// import latex from 'node-latex';
// import { Readable } from 'stream';

/**
 * Compile LaTeX code to PDF
 * @param {string} latexCode - Complete LaTeX document code
 * @returns {Promise<Buffer>} PDF buffer
 */
/**
 * Minify LaTeX code to reduce size for URL query
 * @param {string} latex
 * @returns {string}
 */
function minifyLatex(latex) {
    return latex
        .replace(/%.*$/gm, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

/**
 * Compile LaTeX code to PDF using remote service (latexonline.cc)
 * @param {string} latexCode - Complete LaTeX document code
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function compileToPDF(latexCode) {
    try {
        // Minify LaTeX to fit in URL
        const minifiedLatex = minifyLatex(latexCode);

        // Use latexonline.cc API (GET request)
        const response = await fetch('https://latexonline.cc/compile?text=' + encodeURIComponent(minifiedLatex));

        if (!response.ok) {
            throw new Error(`Remote compilation failed: ${response.statusText} (${response.status})`);
        }

        // Get the PDF as an ArrayBuffer and convert to Buffer
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
}

/**
 * Validate LaTeX code for common issues
 * @param {string} latexCode - LaTeX code to validate
 * @returns {Object} Validation result
 */
export function validateLatex(latexCode) {
    const errors = [];

    if (!latexCode || latexCode.trim().length === 0) {
        errors.push('LaTeX code is empty');
    }

    if (!latexCode.includes('\\documentclass')) {
        errors.push('Missing \\documentclass declaration');
    }

    if (!latexCode.includes('\\begin{document}')) {
        errors.push('Missing \\begin{document}');
    }

    if (!latexCode.includes('\\end{document}')) {
        errors.push('Missing \\end{document}');
    }

    // Check for unescaped special characters (basic check)
    const unescapedChars = latexCode.match(/(?<!\\)[%$#&_{}]/g);
    if (unescapedChars && unescapedChars.length > 10) {
        errors.push('Potentially unescaped special characters detected');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
