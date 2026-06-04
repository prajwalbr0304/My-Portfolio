import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}

export interface InterviewRound {
  question: string;
  options?: string[];
  sampleAnswer?: string;
  feedback?: string;
  score?: number;
}

export interface CopilotState {
  isOpen: boolean;
  messages: Message[];
  isThinking: boolean;

  // Resume Optimizer
  resumeJobDescription: string;
  resumeOptimizerScore: number;
  resumeOptimizerAnalysis: {
    matchingSkills: string[];
    gapSkills: string[];
    tailoredPitch: string;
  } | null;
  isOptimizing: boolean;

  // Voice Assistant
  isListening: boolean;
  isSpeaking: boolean;
  voiceTranscript: string;
  audioWaves: number[];

  // Interview Simulator
  interviewRole: "frontend" | "ai-systems" | "product-engineering" | null;
  interviewStep: "setup" | "active" | "grading" | "finished";
  interviewQuestions: InterviewRound[];
  currentQuestionIndex: number;
  userResponses: string[];
  finalScoreCard: {
    overall: number;
    feedback: string;
    strengths: string[];
    gaps: string[];
  } | null;

  // Live Code Explainer
  codeSelectedSnippet: "vectorSearch" | "ragPipeline";
  codeLineHighlight: number;
  codeExecutionLogs: string[];
  codeIsRunning: boolean;

  // Actions
  setOpen: (isOpen: boolean) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setThinking: (isThinking: boolean) => void;
  clearMessages: () => void;

  // Resume actions
  setResumeJobDescription: (jd: string) => void;
  setResumeOptimizerResult: (score: number, analysis: CopilotState["resumeOptimizerAnalysis"]) => void;
  setOptimizing: (isOptimizing: boolean) => void;

  // Voice actions
  setListening: (isListening: boolean) => void;
  setSpeaking: (isSpeaking: boolean) => void;
  setAudioWaves: (waves: number[]) => void;

  // Interview actions
  startInterview: (role: CopilotState["interviewRole"]) => void;
  submitInterviewAnswer: (answer: string) => void;
  finishInterview: () => void;
  resetInterview: () => void;

  // Code actions
  setCodeSnippet: (snippet: CopilotState["codeSelectedSnippet"]) => void;
  setCodeLineHighlight: (line: number) => void;
  addCodeLog: (log: string) => void;
  setCodeRunning: (isRunning: boolean) => void;
  clearCodeLogs: () => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: "initial-msg",
      role: "assistant",
      content:
        "Hi — I can answer questions about Prajwal’s background, projects, GitHub repos, publications, stack, and how this portfolio is built. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ],
  isThinking: false,

  resumeJobDescription: "",
  resumeOptimizerScore: 0,
  resumeOptimizerAnalysis: null,
  isOptimizing: false,

  isListening: false,
  isSpeaking: false,
  voiceTranscript: "",
  audioWaves: new Array(30).fill(2),

  interviewRole: null,
  interviewStep: "setup",
  interviewQuestions: [],
  currentQuestionIndex: 0,
  userResponses: [],
  finalScoreCard: null,

  codeSelectedSnippet: "vectorSearch",
  codeLineHighlight: -1,
  codeExecutionLogs: [],
  codeIsRunning: false,

  setOpen: (isOpen) => set({ isOpen }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    })),
  setThinking: (isThinking) => set({ isThinking }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "initial-msg",
          role: "assistant",
          content:
            "Chat reset. Ask me anything about Prajwal’s portfolio, repositories, skills, or experience.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }),

  setResumeJobDescription: (resumeJobDescription) => set({ resumeJobDescription }),
  setResumeOptimizerResult: (resumeOptimizerScore, resumeOptimizerAnalysis) =>
    set({ resumeOptimizerScore, resumeOptimizerAnalysis }),
  setOptimizing: (isOptimizing) => set({ isOptimizing }),

  setListening: (isListening) => set({ isListening }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setAudioWaves: (audioWaves) => set({ audioWaves }),

  startInterview: (role) => {
    let questions: InterviewRound[] = [];
    if (role === "frontend") {
      questions = [
        {
          question:
            "How would you handle progressive hydration lag in dynamic React 19 surfaces with heavy motion layouts?",
          sampleAnswer:
            "By isolating critical nodes in server-rendered containers, utilizing Server Actions for layout state synchronization, and keeping visual springs in deferred hydration blocks so interaction hooks load after the primary render paint.",
        },
        {
          question:
            "Explain the visual layer difference between Tailwind v4 variables and traditional Tailwind utilities for dark/light transitions.",
          sampleAnswer:
            "Tailwind v4 declares theme tokens at the CSS root variable layer under `@theme`. Dark theme transitions map instantly via CSS variable swaps on custom selectors instead of appending multiple `.dark:` variant classes across the DOM.",
        },
      ];
    } else if (role === "ai-systems") {
      questions = [
        {
          question:
            "Explain the vector search RAG pipeline. How do you ensure low latency in a Supabase edge query setup?",
          sampleAnswer:
            "By running the similarity query via an index-optimized pgvector match function, limiting retrieve constraints, caching structural embedding outputs in Edge storage, and streaming the initial token chunks using serverless edge channels.",
        },
        {
          question:
            "What is your fallback strategy when an LLM provider incurs high latency or hits rate-limits during a streaming flow?",
          sampleAnswer:
            "Implement exponential backoffs, switch model endpoints (e.g. fallback from OpenAI to Gemini 1.5 Flash), and dynamically switch the interface to a browser-resident local agent engine to complete standard tool actions synchronously.",
        },
      ];
    } else {
      questions = [
        {
          question: "How do you coordinate design requirements with execution speed in an engineering-led team?",
          sampleAnswer:
            "By establishing strict design tokens, sharing local primitive libraries, keeping components highly focused, and implementing direct Playwright smoke tests to catch visual regressions during rapid deploys.",
        },
        {
          question: "Describe your experience shipping AI-assisted board narratives or GTM intelligence interfaces.",
          sampleAnswer:
            "Shredding dashboard load time to under 50ms using edge route pre-renders, compiling pipeline anomalies, and formatting raw logs into actionable markdown executive briefs using structured schema model outputs.",
        },
      ];
    }

    set({
      interviewRole: role,
      interviewStep: "active",
      interviewQuestions: questions,
      currentQuestionIndex: 0,
      userResponses: [],
      finalScoreCard: null,
    });
  },

  submitInterviewAnswer: (answer) =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const responses = [...state.userResponses, answer];
      const isFinished = nextIndex >= state.interviewQuestions.length;

      if (isFinished) {
        const randomScore = Math.floor(Math.random() * 15) + 82;
        const overall = randomScore;
        const feedback = `Excellent demonstration of production depth and system-centric vocabulary. The responses successfully outline engineering strategies for progressive rendering, robust LLM error handling, and component encapsulation.`;
        const strengths = [
          "Strong command of React 19 hydration cycles and optimization paradigms.",
          "Practical understanding of pgvector RAG mechanics and local fail-safes.",
        ];
        const gaps = [
          "Consider expanding on cache invalidation policies under heavy transactional loads.",
          "Add details about visual testing thresholds.",
        ];

        return {
          userResponses: responses,
          interviewStep: "grading",
          finalScoreCard: { overall, feedback, strengths, gaps },
        };
      }
      return {
        currentQuestionIndex: nextIndex,
        userResponses: responses,
      };
    }),

  finishInterview: () => set({ interviewStep: "finished" }),
  resetInterview: () =>
    set({
      interviewRole: null,
      interviewStep: "setup",
      interviewQuestions: [],
      currentQuestionIndex: 0,
      userResponses: [],
      finalScoreCard: null,
    }),

  setCodeSnippet: (codeSelectedSnippet) => set({ codeSelectedSnippet }),
  setCodeLineHighlight: (codeLineHighlight) => set({ codeLineHighlight }),
  addCodeLog: (log) => set((state) => ({ codeExecutionLogs: [...state.codeExecutionLogs, log] })),
  setCodeRunning: (codeIsRunning) => set({ codeIsRunning }),
  clearCodeLogs: () => set({ codeExecutionLogs: [] }),
}));
