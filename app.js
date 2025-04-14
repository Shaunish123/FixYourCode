/**
 * FixYourCode - AI-powered code analysis application
 * This application helps developers improve their code by providing analysis,
 * suggestions, and educational resources using Google's Gemini AI.
 */
import 'dotenv/config';                     // Loads environment variables from .env file for API keys and configuration
import express from 'express';              // Web framework to handle routing and HTTP requests
import bodyParser from 'body-parser';       // Middleware to parse incoming request bodies
import axios from 'axios';                  // HTTP client for making API requests to Gemini AI
import path from 'path';                    // Utility for working with file and directory paths
import hljs from 'highlight.js';            // Library for code syntax highlighting and language detection
import { fileURLToPath } from 'url';        // Utility to convert file URL to path

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware for parsing requests and serving static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set EJS as view engine for rendering dynamic content
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Helper function to detect programming language of code snippets
 * Uses highlight.js for language detection based on code syntax
 */
function detectLanguage(code) {
  try {
    const result = hljs.highlightAuto(code);
    return result.language || 'plaintext';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'plaintext';
  }
}

// ===== ROUTES =====

/**
 * Home page route - renders the index page with code input form
 * This is where users enter their code for analysis
 */
app.get('/', (req, res) => {
  res.render('index', { 
    codeResult: null, 
    languages: [
      'plaintext', 'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 
      'ruby', 'go', 'swift', 'kotlin', 'rust', 'typescript'
    ]
  });
});

/**
 * About page route - displays information about the project and developer
 */
app.get('/about', (req, res) => {
  res.render('about');
});

/**
 * Code analysis route - processes the submitted code and returns AI analysis
 * This is the core functionality of the application:
 * 1. Takes user's code input
 * 2. Sends it to Gemini AI API
 * 3. Returns structured analysis with suggestions and improvements
 */
app.post('/analyze', async (req, res) => {
  try {
    // Extract code and language from form submission
    const { code, language } = req.body;
    
    // Validate that code was submitted
    if (!code) {
      return res.render('index', { 
        error: 'Please provide code to analyze',
        languages: [
          'plaintext', 'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 
          'ruby', 'go', 'swift', 'kotlin', 'rust', 'typescript'
        ]
      });
    }

    // Auto-detect programming language if not specified by user
    const detectedLanguage = language || detectLanguage(code);
    
    // Prepare the prompt for Gemini AI with detailed instructions
    // This carefully crafted prompt ensures consistent and helpful responses
    const data = {
      contents: [{
        parts: [{
          text: `You are a code tutor. Analyze the following ${detectedLanguage} code and provide feedback in JSON format:
            
${code}

Respond with a JSON object with the following structure:
{
  "language": "detected language name",
  "isCorrect": true/false, // Set to true if the code is already well-structured and follows best practices
  "fix": "improved version of the code with better practices and fixed issues (if needed, otherwise same as original)",
  "suggestions": ["list of best practices and improvements", "or praise if code is already well-structured"],
  "descriptions": ["line-by-line explanation of what the code is doing"],
  "learn": [
    {
      "text": "Topic name or description",
      "url": "URL to a learning resource like W3Schools, GeeksforGeeks, MDN, etc."
    }
  ]
}

IMPORTANT: For the "fix" field, if you make changes to the code, please add comments explaining what you changed and why, but make sure to place these comments INSIDE the code string, not in the JSON structure itself.

Example of CORRECT way (comments inside the code string):
"fix": "function example() {\\n  // Changed var to const for better scoping\\n  const x = 5;\\n  return x;\\n}"

Example of INCORRECT way (comments in JSON structure):
"fix": function example() { // Changed var to const for better scoping
  const x = 5;
  return x;
}

For the "learn" field, include at least 3-5 learning resources with URLs to sites like W3Schools, GeeksforGeeks, MDN Web Docs, or other reputable programming tutorial sites related to the code's language and concepts.

If the code is already well-structured and follows best practices, set "isCorrect" to true, keep "fix" the same as the original code, and provide positive feedback in "suggestions".

IMPORTANT: Return ONLY the JSON object without any markdown formatting, explanation, or code blocks. Do not wrap the JSON in \`\`\` or any other formatting.`
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    };
    
    // Call the Gemini AI API with our prepared prompt
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.post(API_URL, data);
    
    // Extract the AI response text
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Clean up the response if it contains markdown formatting
    let jsonText = responseText;
    if (jsonText.includes('```')) {
      const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
      const match = jsonText.match(jsonRegex);
      if (match && match[1]) {
        jsonText = match[1].trim();
      }
    }
    
    // Parse the JSON response from Gemini AI
    const result = JSON.parse(jsonText);
    
    // Render the results page with the AI analysis
    res.render('index', { 
      codeResult: result, 
      originalCode: code,
      languages: [
        'plaintext', 'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 
        'ruby', 'go', 'swift', 'kotlin', 'rust', 'typescript'
      ],
      selectedLanguage: detectedLanguage
    });
  } catch (error) {
    // Log the actual error details for debugging
    console.error('Error:', error.message);
    
    // Show a simple, user-friendly error message
    res.render('index', { 
      error: 'Something went wrong. Please try again later.',
      languages: [
        'plaintext', 'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 
        'ruby', 'go', 'swift', 'kotlin', 'rust', 'typescript'
      ] 
    });
  }
});

// Start the server and listen on configured port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});