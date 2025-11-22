#!/usr/bin/env node

/**
 * Test script for the Resume Builder Backend
 * Tests both /api/generate and /api/pdf endpoints
 */

const API_BASE = 'http://localhost:3001';

// Sample resume data
const sampleResumeData = {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 123-4567',
    linkedin: 'linkedin.com/in/janesmith',
    github: 'github.com/janesmith',
    education: [
        {
            university: 'State University',
            degree: 'Bachelor of Science in Computer Science',
            graduationDate: 'May 2024',
            location: 'City, State',
            gpa: '3.8',
            coursework: 'Data Structures, Algorithms, Web Development, Machine Learning'
        }
    ],
    technicalSkills: {
        languages: 'Python, JavaScript, TypeScript, Java, SQL',
        frameworks: 'React, Node.js, Express, Django, Flask',
        tools: 'Git, Docker, AWS, PostgreSQL, MongoDB'
    },
    experience: [
        {
            jobTitle: 'Software Engineer Intern',
            company: 'Tech Solutions Inc',
            location: 'Remote',
            startDate: 'May 2023',
            endDate: 'Aug 2023',
            achievements: [
                'Built and optimized UI components for the main web application',
                'Improved application performance by 30% through code optimization',
                'Participated in agile sprints and code reviews with senior engineers'
            ]
        }
    ],
    projects: [
        {
            name: 'E-Commerce Platform',
            techStack: 'React, Node.js, PostgreSQL',
            githubUrl: 'https://github.com/janesmith/ecommerce',
            descriptions: [
                'Developed full-stack e-commerce platform with user authentication and payment processing',
                'Implemented RESTful API with Express and PostgreSQL database'
            ]
        }
    ]
};

const sampleJobDescription = `
Frontend Engineer - Core Platform

We are seeking a talented Frontend Engineer to join our Core Platform team.

Responsibilities:
- Develop, test, and maintain high-quality user-facing features using React
- Collaborate with product managers, designers, and backend engineers
- Optimize application performance across devices and browsers
- Write clean, maintainable, and well-documented code
- Participate in code reviews and mentor junior developers

Requirements:
- 2+ years of experience with React and TypeScript
- Strong understanding of modern JavaScript (ES6+)
- Experience with state management (Redux, Context API)
- Familiarity with RESTful APIs and GraphQL
- Knowledge of responsive design and CSS frameworks
- Experience with Git and CI/CD pipelines
- Bachelor's degree in Computer Science or related field

Nice to have:
- Experience with Next.js or other React frameworks
- Knowledge of Node.js and Express
- AWS or cloud platform experience
- Open source contributions
`;

async function testHealthCheck() {
    console.log('\n🔍 Testing Health Check...');
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('✅ Health check passed:', data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

async function testGenerateEndpoint() {
    console.log('\n🤖 Testing /api/generate endpoint...');
    try {
        const response = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                resumeData: sampleResumeData,
                jobDescription: sampleJobDescription
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Generate endpoint failed');
        }

        const data = await response.json();

        if (!data.success || !data.latexCode) {
            throw new Error('Invalid response format');
        }

        console.log('✅ Generate endpoint passed');
        console.log(`   - LaTeX code length: ${data.latexCode.length} characters`);
        console.log(`   - Enhanced data received: ${Object.keys(data.enhancedData).join(', ')}`);

        return data.latexCode;
    } catch (error) {
        console.error('❌ Generate endpoint failed:', error.message);
        return null;
    }
}

async function testPDFEndpoint(latexCode) {
    console.log('\n📄 Testing /api/pdf endpoint...');
    try {
        const response = await fetch(`${API_BASE}/api/pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latexCode })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'PDF endpoint failed');
        }

        const contentType = response.headers.get('content-type');
        if (contentType !== 'application/pdf') {
            throw new Error(`Expected PDF, got ${contentType}`);
        }

        const buffer = await response.arrayBuffer();
        console.log('✅ PDF endpoint passed');
        console.log(`   - PDF size: ${buffer.byteLength} bytes`);

        return true;
    } catch (error) {
        console.error('❌ PDF endpoint failed:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('='.repeat(60));
    console.log('🧪 Resume Builder Backend Test Suite');
    console.log('='.repeat(60));

    // Test 1: Health Check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('\n❌ Server is not running. Please start the server first:');
        console.log('   cd backend && npm start');
        process.exit(1);
    }

    // Test 2: Generate Endpoint
    const latexCode = await testGenerateEndpoint();
    if (!latexCode) {
        console.log('\n⚠️  Generate endpoint failed. Check your GEMINI_API_KEY in .env');
        process.exit(1);
    }

    // Test 3: PDF Endpoint
    const pdfOk = await testPDFEndpoint(latexCode);
    if (!pdfOk) {
        console.log('\n⚠️  PDF endpoint failed. Make sure pdflatex is installed:');
        console.log('   macOS: brew install --cask mactex-no-gui');
        console.log('   Linux: sudo apt-get install texlive-latex-base texlive-fonts-recommended');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Test suite completed!');
    console.log('='.repeat(60));
}

// Run tests
runTests().catch(console.error);
