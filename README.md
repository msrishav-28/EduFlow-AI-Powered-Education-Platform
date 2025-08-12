# EduFlow: AI-Powered Education Platform

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

EduFlow is a web-based platform designed to assist students and educators by leveraging the power of Artificial Intelligence. It provides a suite of tools to simplify complex topics, generate study materials, and offer instant academic support.

## ✨ Features

-   **🤖 AI-Powered Chatbot:** Engage in a dynamic conversation to get quick answers and explanations on any subject.
-   **❓ Question Answering:** Ask specific academic questions and receive detailed, AI-generated answers.
-   **📝 Text Summarizer:** Condense long articles, research papers, or notes into concise, key summary points.
-   **✍️ MCQ Generator:** Automatically create multiple-choice questions from a block of text to test comprehension and create quizzes.
-   **💻 Code Explainer:** Paste a snippet of code (in any popular language) to get a clear, line-by-line explanation of its functionality.

## 🛠️ Tech Stack

Legacy prototype (Flask) plus new production Next.js frontend (`project/eduflow-next`).

-   **Frontend (Next.js 14 App Router):** TypeScript, Tailwind CSS, Framer Motion, React Query, Zustand, PWA (next-pwa)
-   **AI Providers:** Google Gemini, Local Ollama (configurable, streaming)
-   **Auth/Analytics:** Firebase Auth & Firestore session logging
-   **Parsing:** pdfjs-dist, mammoth for PDF/DOCX, custom MCQ parser
-   **Legacy Backend:** Python / Flask (original prototype)

## 🚀 Getting Started (Next.js Frontend)

1. `cd project/eduflow-next`
2. `cp .env.example .env.local` and fill keys (Firebase optional)
3. `npm install`
4. `npm run dev` → http://localhost:3000
5. Optional: hit `/api/health/ai` for provider readiness

Run quality gates:

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## 🚀 Getting Started (Legacy Flask Prototype)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following installed on your system:
-   Python 3.8+
-   `pip` (Python package installer)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/msrishav-28/EduFlow-AI-Powered-Education-Platform.git](https://github.com/msrishav-28/EduFlow-AI-Powered-Education-Platform.git)
    cd EduFlow-AI-Powered-Education-Platform
    ```

2.  **Create and activate a virtual environment (recommended):**
    -   **On macOS/Linux:**
        ```sh
        python3 -m venv venv
        source venv/bin/activate
        ```
    -   **On Windows:**
        ```sh
        python -m venv venv
        .\venv\Scripts\activate
        ```

3.  **Install the required dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Set up your environment variables:**
    -   Rename the `.env.example` file to `.env`.
    -   Open the `.env` file and add your secret OpenAI API key:
        ```
        OPENAI_API_KEY="sk-YourSecretOpenAI_API_KeyHere"
        ```

### Running the Application

1.  **Start the Flask server:**
    ```sh
    flask run
    ```
    or
    ```sh
    python app.py
    ```

2.  **Access the application:**
    Open your favorite web browser and navigate to:
    ```
    [http://127.0.0.1:5000](http://127.0.0.1:5000)
    ```

## 🔧 Usage

Once the server is running, you can interact with the platform through your browser:
1.  Navigate to the homepage.
2.  Choose one of the available tools (e.g., "Summarize Text", "Generate MCQs").
3.  Enter your text or question into the provided input field.
4.  Click the "Submit" button and wait for the AI-generated response to appear.

## ⚙️ How It Works

EduFlow is built using the **Flask** web framework.
-   The **frontend** (HTML, CSS, JS) captures user input (like text to summarize or a question).
-   This input is sent via an HTTP request to the **Flask backend**.
-   The backend server receives the request, processes the data, and makes an API call to the appropriate **OpenAI endpoint**.
-   OpenAI's model generates the AI-powered response (e.g., a summary, an answer, or MCQs).
-   The Flask backend sends this response back to the frontend, where it is dynamically displayed to the user.

## 🤝 Contributing

CI pipeline (GitHub Actions) runs lint, type-check, tests, and build on pushes / PRs to `master`.

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
