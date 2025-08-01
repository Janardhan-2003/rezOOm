# 🚀 rezOOm – AI-Powered Resume Analyzer & Generator

rezOOm is a smart resume tool that helps job seekers analyze and improve their resumes using **AI (Gemini Pro)**. It evaluates your resume against any job description, gives you an **ATS (Applicant Tracking System) score**, suggests improvements, and even **generates a new resume** tailored to the job — all with a clean, intuitive UI.

![GitHub repo size](https://img.shields.io/github/repo-size/Janardhan-2003/Rezoom?color=blue&style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/Janardhan-2003/Rezoom?color=brightgreen&style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/Janardhan-2003/Rezoom?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Janardhan-2003/Rezoom?color=orange&style=flat-square)
![GitHub license](https://img.shields.io/github/license/Janardhan-2003/Rezoom?style=flat-square)

[![Live](https://img.shields.io/badge/Live%20App-rezOOm-00bcd4?style=flat-square&logo=vercel&logoColor=white)](https://rezoom9.vercel.app)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Gemini Pro](https://img.shields.io/badge/Gemini-Pro-blueviolet?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

---

## 🔗 Live Demo

👉 [Live Demo](https://rezoom9.vercel.app)

---

## 🧠 Features

- 📄 Upload resumes in **PDF or DOCX** format
- 🧾 Paste any **Job Description**
- 📊 Get a full **ATS analysis**:
  - ATS Score
  - Matched & Missing Keywords
  - Resume Strengths & Weaknesses
- ✨ Auto-generate a **new personalized resume**
- 📥 Download the resume in **DOCX format**
- 🔐 **User Authentication** with Firebase (Email & Google)
- 🌙 Modern, responsive UI with light/dark gradient animations

---

## 🛠️ Built With

| Frontend       | Backend/API          | Other Integrations |
|----------------|----------------------|---------------------|
| React.js       | Gemini Pro (Google AI) | Firebase Auth       |
| CSS3           | Gemini Text API       | react-pdftotext     |
| Bootstrap      | .env for security     | mammoth.js (DOCX)   |
| JavaScript     |                       | Vercel (Hosting)    |

---

## 🚧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Janardhan-2003/Rezoom.git
cd Rezoom
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env file in the root folder:

env
Copy
Edit
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
(You can also refer to .env.example)

4. Start the app locally
bash
Copy
Edit
npm run dev
Then open http://localhost:3000 in your browser.

🧪 How It Works
User uploads resume in PDF or DOCX format

JD is entered or pasted in text area

Resume content and JD are sent to Gemini Pro using a prompt

Gemini returns:

ATS score

Keywords matched/missing

Tips & insights

A brand new resume structure

Users can download the new resume in .docx format

🖼 Preview


✅ Future Enhancements
Customize prompt behavior for different job types

Store user history and resume versions

Resume builder interface with live editing

👤 Author
Janardhan Reddy
[Connect with me on LinkedIn](https://www.linkedin.com/in/kokatam-janardhan-reddy)


📄 License
This project is open source under the MIT License.

🤝 Feedback & Contributions
Have ideas to improve ReZoom? Found a bug?
Feel free to open an issue or submit a pull request!