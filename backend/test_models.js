import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels on genAI instance in some versions, 
    // but usually it's on the client or via a specific call. 
    // Actually, for the JS SDK, it might not be directly exposed easily in all versions.
    // Let's try a simple generation with gemini-1.5-flash to see if it works now.

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        console.log('gemini-1.5-flash works:', result.response.text());
    } catch (e) {
        console.error('gemini-1.5-flash failed:', e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hello');
        console.log('gemini-pro works:', result.response.text());
    } catch (e) {
        console.error('gemini-pro failed:', e.message);
    }
}

listModels();
