# FixYourCode - AI-powered Code Analysis Platform

FixYourCode is a comprehensive web application that helps developers improve their programming skills by providing automated code analysis, suggestions, and explanations using advanced AI technology.

## Features

- Analyze code in multiple programming languages
- Get improved versions of your code with best practices and detailed comments explaining changes
- Receive suggestions for code improvements
- Get line-by-line explanations of what your code does
- Access learning resources with links to reputable programming tutorial sites
- Automatic language detection
- User-friendly tabbed interface for easy navigation

## Supported Languages

- JavaScript
- Python
- Java
- C++
- C#
- PHP
- Ruby
- Go
- Swift
- Kotlin
- Rust
- TypeScript
- And more...

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- API key for Gemini AI

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory
```
cd fixyourcode
```

3. Install dependencies
```
npm install
```

4. Create a `.env` file in the root directory
```
cp .env.example .env
```

5. Add your API key to the `.env` file
```
PORT=3000
GEMINI_API_KEY=your_api_key_here
```

### Running the Application

For development:
```
npm run dev
```

For production:
```
npm start
```

Then open your browser and navigate to `http://localhost:3000`.

## How to Use

1. Paste your code into the text area
2. (Optional) Select the programming language if auto-detection doesn't work
3. Click "Analyze Code"
4. View the analysis results in the tabbed interface:
   - Code & Suggestions: View improved code with explanatory comments
   - Line-by-Line Explanation: Get a detailed breakdown of how the code works
   - Learning Resources: Access links to tutorials and documentation for further learning

## Technologies Used

- Node.js and Express.js for the backend
- EJS for templating
- Axios for API requests
- Highlight.js for syntax highlighting
- AI-powered analysis
- Responsive design with custom CSS

## License

This project is licensed under the ISC License.

## Acknowledgments

- Google Gemini AI for powering the code analysis
- Highlight.js for syntax highlighting 