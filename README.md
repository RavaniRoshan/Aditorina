<div align="center">
  <img width="1200" height="475" alt="PhotoCursor AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>PhotoCursor AI</h1>
</div>

<div align="center">
  <strong>The Future of Photo Editing is Here.</strong>
  <br />
  <p>Unleash your creativity with PhotoCursor AI. Describe your edits in plain English and watch our powerful AI bring your vision to life instantly.</p>
</div>

---

## ✨ Features

PhotoCursor AI combines a familiar, intuitive interface with the power of generative AI to make professional-level photo editing accessible to everyone.

*   **🪄 AI Magic Edit**: Simply type what you want. "Add a pirate hat," "change the background to a beach," or "make it a watercolor painting." It's that easy. Our app uses the latest Google Gemini model to understand your prompts and edit your images.
*   **🎨 Intuitive Interface**: A familiar, Photoshop-style layout makes powerful tools accessible to everyone, from beginners to pros. No steep learning curve.
*   **🛠️ Pro-Level Tools**: Go beyond AI with layers, adjustments, cropping, and more. All the essential tools you need for pixel-perfect results are at your fingertips.

---

## 🚀 How to Run Locally

To run PhotoCursor AI on your local machine, please follow these steps:

**Prerequisites:**
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [Git](https://git-scm.com/)
*   A [Google AI Gemini API Key](https://ai.google.dev/pricing).

**1. Clone the Repository**
```bash
git clone https://github.com/your-username/photocursor-ai.git
cd photocursor-ai
```

**2. Install Dependencies**
```bash
npm install
```
_Or if you use Yarn:_
```bash
yarn install
```

**3. Set Up Environment Variables**
Create a new file named `.env` in the root of your project directory and add your Google Gemini API key as follows:

```
GEMINI_API_KEY="your_google_ai_api_key_here"
```
> **Note:** The application uses Vite to load this environment variable and make it available to the application as `process.env.API_KEY`.

**4. Run the Development Server**
```bash
npm run dev
```
_Or with Yarn:_
```bash
yarn dev
```

The application should now be running at `http://localhost:5173` (or the next available port).

---

## 📂 Project Structure

The codebase is organized to separate concerns and make development scalable.

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   │   ├── editor/       # Components specific to the editor interface
│   │   └── ...
│   ├── pages/            # Top-level page components (LandingPage, Editor)
│   ├── services/         # Modules for external API calls (geminiService.ts)
│   ├── styles/           # Global styles (if any)
│   ├── types.ts          # TypeScript type definitions
│   ├── App.tsx           # Main application component with routing logic
│   └── index.tsx         # Entry point of the React application
├── .env                  # Environment variables (needs to be created)
├── package.json          # Project dependencies and scripts
└── vite.config.ts        # Vite configuration
```

---

## 💻 Technology Stack

*   **Framework**: [React](https://reactjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **AI**: [Google Gemini API](https://ai.google.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (inferred from class names)

---

<div align="center">
  <p>&copy; 2024 PhotoCursor AI. All Rights Reserved.</p>
</div>
