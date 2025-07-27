import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';


import Header from '../Header/Header';
import './ResumeAnalyzer.css';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a PDF or Word document.');
        setResumeFile(null);
      }
    }
  };

  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        try {
          if (file.type === 'application/pdf') {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => item.str).join(' ') + '\n';
            }
            resolve(text.trim());
          } else if (file.name.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
            resolve(result.value.trim());
          } else {
            reject(new Error('Unsupported file format.'));
          }
        } catch (err) {
          reject(new Error('Failed to extract text from file.'));
        }
      };
  
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsArrayBuffer(file);
    });
  };
  

  const analyzeWithGemini = async (resumeText, jobDesc) => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please check your .env file.');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
         {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume against the job description and return ONLY a valid JSON with this structure:

{
  "atsScore": <calculated_score_out_of_100>,
  "matchedKeywords": [list of matching keywords from the job description],
  "missingKeywords": [important keywords not found in the resume],
  "tips": [
    "Actionable suggestions to improve the resume"
  ],
  "insights": {
    "strengths": [
      "What’s working well in the resume"
    ],
    "weaknesses": [
      "What’s lacking or could be improved"
    ],
    "recommendations": [
      "Practical improvement steps"
    ]
  },
  "optimizedResume": "A newly formatted resume tailored for the job description based on best practices. Keep it concise and ATS friendly."
}

Resume:
${resumeText}

Job Description:
${jobDesc}

Instructions:
- Evaluate ATS score based on keyword and skill alignment
- List matched and missing keywords
- Include improvement tips
- Write a short optimized version of the resume using the same content and aligning it with the job description
- Respond with only the above JSON. No additional commentary or explanations.
`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Failed to analyze resume'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const content = data.candidates[0].content.parts[0].text;
      
      // Clean the response and extract JSON
      const cleanContent = content.trim();
      let jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        // Try to find JSON in the response
        const jsonStart = cleanContent.indexOf('{');
        const jsonEnd = cleanContent.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          jsonMatch = [cleanContent.substring(jsonStart, jsonEnd + 1)];
        }
      }
      
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          // Validate the result structure
          if (typeof result.atsScore !== 'number' || 
              !Array.isArray(result.matchedKeywords) || 
              !Array.isArray(result.missingKeywords) || 
              !Array.isArray(result.tips) ||
              !result.insights) {
            throw new Error('Invalid analysis result structure');
          }
          
          return result;
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Failed to parse analysis results');
        }
      } else {
        console.error('No JSON found in response:', content);
        throw new Error('No valid analysis results found in response');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    const hasResumeContent = useTextInput ? resumeText.trim() : resumeFile;
    
    if (!hasResumeContent || !jobDescription.trim()) {
      setError('Please provide your resume content and enter a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      let finalResumeText;
      
      if (useTextInput) {
        finalResumeText = resumeText.trim();
      } else {
        // Extract text from file
        console.log('Extracting text from file...');
        finalResumeText = await extractTextFromFile(resumeFile);
        console.log(finalResumeText)
        
        if (!finalResumeText || finalResumeText.trim().length < 10) {
          throw new Error('Could not extract meaningful text from the file. Please try using the "Paste Text" option instead.');
        }
      }

      console.log('Analyzing with Gemini...');
      const result = await analyzeWithGemini(finalResumeText, jobDescription);
      
      console.log('Analysis complete:', result);
      setAnalysisResult(result);
      
    } catch (err) {
      console.error('Analysis error:', err);
      
      // Provide more specific error messages
      if (err.message.includes('API key')) {
        setError('Gemini API key is missing or invalid. Please check your .env file.');
      } else if (err.message.includes('API Error')) {
        setError(`API Error: ${err.message}. Please check your API key and try again.`);
      } else if (err.message.includes('extract')) {
        setError('Could not read the file content. Please try using the "Paste Text" option instead.');
      } else if (err.message.includes('parse')) {
        setError('Received invalid response from the analysis service. Please try again.');
      } else {
        setError(`Analysis failed: ${err.message}. Please try again.`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const PieChart = ({ score }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="pie-chart-container">
        <svg className="pie-chart" width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#333"
            strokeWidth="8"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="pie-chart-progress"
            transform="rotate(-90 70 70)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="50%" stopColor="#0099CC" />
              <stop offset="100%" stopColor="#00FF88" />
            </linearGradient>
          </defs>
        </svg>
        <div className="pie-chart-text">
          <span className="score-number">{score}</span>
          <span className="score-label">ATS Score</span>
        </div>
      </div>
    );
  };

  return (
    <>
    <Header />
    <div className="analyzer-container">
      <div className="analyzer-content">
        <h1 className="analyzer-title">Resume Analyzer</h1>
        <p className="analyzer-subtitle">
          Upload your resume and job description to get detailed ATS analysis and improvement suggestions
        </p>

        <div className="upload-section">
          <div className="upload-group">
            <div className="input-toggle">
              <button 
                type="button"
                className={`toggle-btn ${!useTextInput ? 'active' : ''}`}
                onClick={() => setUseTextInput(false)}
              >
                Upload File
              </button>
              <button 
                type="button"
                className={`toggle-btn ${useTextInput ? 'active' : ''}`}
                onClick={() => setUseTextInput(true)}
              >
                Paste Text
              </button>
            </div>

            {!useTextInput ? (
              <>
                <label className="upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Resume (PDF/Word)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="file-upload-btn">
                  {resumeFile ? resumeFile.name : 'Choose File'}
                </label>
              </>
            ) : (
              <>
                <label className="textarea-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Resume Content
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="resume-text-area"
                  rows="8"
                />
              </>
            )}
          </div>

          <div className="textarea-group">
            <label className="textarea-label">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="job-description-textarea"
              rows="6"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!useTextInput && !resumeFile) || (useTextInput && !resumeText.trim()) || !jobDescription.trim()}
          className="analyze-button"
        >
          {isAnalyzing ? (
            <>
              <div className="spinner"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 4.21L12 6.81L16.5 4.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 19.79V14.6L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12L16.5 14.6V19.79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Analyze Resume
            </>
          )}
        </button>

        {analysisResult && (
          <div className="results-section">
            <div className="results-header">
              <h2>Analysis Results</h2>
            </div>

            <div className="results-grid">
              <div className="score-card">
                <PieChart score={analysisResult.atsScore} />
              </div>

              <div className="keywords-card">
                <h3>Keyword Analysis</h3>
                <div className="keywords-section">
                  <div className="matched-keywords">
                    <h4>Matched Keywords ({analysisResult.matchedKeywords?.length || 0})</h4>
                    <div className="keyword-tags">
                      {analysisResult.matchedKeywords?.map((keyword, index) => (
                        <span key={index} className="keyword-tag matched">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="missing-keywords">
                    <h4>Missing Keywords ({analysisResult.missingKeywords?.length || 0})</h4>
                    <div className="keyword-tags">
                      {analysisResult.missingKeywords?.map((keyword, index) => (
                        <span key={index} className="keyword-tag missing">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tips-card">
                <h3>Improvement Tips</h3>
                <ul className="tips-list">
                  {analysisResult.tips?.map((tip, index) => (
                    <li key={index} className="tip-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#00D4FF"/>
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="insights-card">
                <h3>Resume Insights</h3>
                <div className="insights-content">
                  <div className="strengths">
                    <h4>Strengths</h4>
                    <ul>
                      {analysisResult.insights?.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="weaknesses">
                    <h4>Areas for Improvement</h4>
                    <ul>
                      {analysisResult.insights?.weaknesses?.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                      {analysisResult.insights?.recommendations?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ResumeAnalyzer;