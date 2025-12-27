/**
 * Chat Quiz Context
 * Shared state management for integrated chat and quiz functionality
 * Enables seamless switching between chat and quiz modes with progress persistence
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ChatQuizContext = createContext(null);

// Storage key for localStorage persistence
const STORAGE_KEY = 'medication_navigator_progress';

// Maximum number of medication searches allowed in free tier
const MAX_FREE_SEARCHES = 4;

// Question definitions for the quiz mode
const QUIZ_QUESTIONS = [
  {
    id: 'role',
    question: "Who am I helping today?",
    type: 'single',
    options: [
      { value: 'patient', label: 'Patient', description: "I'm the patient" },
      { value: 'carepartner', label: 'Carepartner / Family', description: "I'm helping a loved one" },
      { value: 'social_worker', label: 'Social Worker / Coordinator', description: "I'm a healthcare professional" },
    ],
  },
  {
    id: 'medication_stage',
    question: "Where are you in the medication process?",
    type: 'single',
    options: [
      { value: 'pre', label: 'Pre-medication', description: 'On the waitlist or in evaluation' },
      { value: 'post_1yr', label: 'Post-medication (< 1 year)', description: 'Within the first year' },
      { value: 'post_1yr_plus', label: 'Post-medication (1+ years)', description: 'More than a year post-medication' },
    ],
  },
  {
    id: 'organ_type',
    question: "What type of medication?",
    type: 'single',
    options: [
      { value: 'kidney', label: 'Kidney' },
      { value: 'liver', label: 'Liver' },
      { value: 'heart', label: 'Heart' },
      { value: 'lung', label: 'Lung' },
      { value: 'pancreas', label: 'Pancreas' },
      { value: 'multi', label: 'Multi-organ' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'insurance_type',
    question: "What's your primary insurance?",
    helpText: "This determines which assistance programs you're eligible for.",
    type: 'single',
    options: [
      { value: 'commercial', label: 'Commercial / Employer', description: 'Private insurance through work or marketplace', hint: 'Copay cards available!' },
      { value: 'medicare', label: 'Medicare', description: 'Federal program (65+ or disability)', hint: 'Foundations & PAPs available' },
      { value: 'medicaid', label: 'Medicaid', description: 'State program based on income', hint: 'Usually well covered' },
      { value: 'tricare_va', label: 'TRICARE / VA', description: 'Military or veterans benefits' },
      { value: 'ihs', label: 'Indian Health Service', description: 'Tribal health programs' },
      { value: 'uninsured', label: 'Uninsured / Self-pay', description: 'No current insurance', hint: 'PAPs can provide FREE meds' },
    ],
  },
  {
    id: 'medication',
    question: "Which medication do you need help with?",
    type: 'medication_search',
    allowSkip: true,
    skipLabel: "I'm not sure / Show all options",
  },
  {
    id: 'cost_burden',
    question: "How would you describe your current medication costs?",
    type: 'single',
    options: [
      { value: 'manageable', label: 'Manageable', description: "I can afford my medications" },
      { value: 'challenging', label: 'Challenging', description: "It's tight, but I manage" },
      { value: 'unaffordable', label: 'Unaffordable', description: "I struggle to pay for meds" },
      { value: 'crisis', label: 'Crisis', description: "I've skipped or rationed doses", urgent: true },
    ],
  },
];

// Initial state
const initialState = {
  // Current mode: 'chat' or 'quiz'
  mode: 'chat',

  // User profile answers (shared between chat and quiz)
  answers: {},

  // Usage tracking for free tier limits
  usageTracking: {
    searchCount: 0,           // Number of medication searches performed
    quizCompletionsCount: 0,  // Number of completed quizzes
    searchLimitReached: false, // Whether the user has hit the search limit
    lastResetDate: null,      // For potential monthly reset functionality
  },

  // Quiz-specific state
  quizProgress: {
    currentQuestionIndex: 0,
    isComplete: false,
    startedAt: null,
    completedAt: null,
  },

  // Chat-specific state
  chatState: {
    messages: [],
    conversationId: null,
    currentQuestionIndex: 0,
    isComplete: false,
  },

  // Selected medications (shared)
  selectedMedications: [],

  // Results data (shared)
  results: {
    programs: [],
    medicationPrograms: [],
    costPlusMedications: [],
    guidance: null,
  },

  // UI state
  isOpen: false,
  hasSeenResults: false,
};

/**
 * Load saved progress from localStorage
 */
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate and return saved state
      if (parsed && typeof parsed === 'object') {
        return {
          ...initialState,
          ...parsed,
          // Don't persist UI open state
          isOpen: false,
        };
      }
    }
  } catch (e) {
    console.warn('Failed to load saved progress:', e);
  }
  return initialState;
}

/**
 * Save progress to localStorage
 */
function saveToStorage(state) {
  try {
    const toSave = {
      answers: state.answers,
      quizProgress: state.quizProgress,
      selectedMedications: state.selectedMedications,
      results: state.results,
      hasSeenResults: state.hasSeenResults,
      mode: state.mode,
      usageTracking: state.usageTracking,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export function ChatQuizProvider({ children }) {
  const [state, setState] = useState(() => loadFromStorage());

  // Save to localStorage whenever relevant state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state.answers, state.quizProgress, state.selectedMedications, state.results, state.hasSeenResults, state.mode, state.usageTracking]);

  // Set mode (chat or quiz)
  const setMode = useCallback((mode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  // Toggle widget open/closed
  const setIsOpen = useCallback((isOpen) => {
    setState(prev => ({ ...prev, isOpen }));
  }, []);

  // Update a single answer
  const setAnswer = useCallback((questionId, value) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  }, []);

  // Update multiple answers at once
  const setAnswers = useCallback((answers) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        ...answers,
      },
    }));
  }, []);

  // Update quiz progress
  const setQuizProgress = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      quizProgress: {
        ...prev.quizProgress,
        ...updates,
      },
    }));
  }, []);

  // Advance to next quiz question
  const nextQuizQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.quizProgress.currentQuestionIndex + 1;
      const isComplete = nextIndex >= QUIZ_QUESTIONS.length;
      return {
        ...prev,
        quizProgress: {
          ...prev.quizProgress,
          currentQuestionIndex: nextIndex,
          isComplete,
          completedAt: isComplete ? new Date().toISOString() : null,
        },
      };
    });
  }, []);

  // Go to previous quiz question
  const prevQuizQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      quizProgress: {
        ...prev.quizProgress,
        currentQuestionIndex: Math.max(0, prev.quizProgress.currentQuestionIndex - 1),
        isComplete: false,
      },
    }));
  }, []);

  // Update chat state
  const setChatState = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      chatState: {
        ...prev.chatState,
        ...updates,
      },
    }));
  }, []);

  // Add a chat message
  const addChatMessage = useCallback((message) => {
    setState(prev => ({
      ...prev,
      chatState: {
        ...prev.chatState,
        messages: [...prev.chatState.messages, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...message,
        }],
      },
    }));
  }, []);

  // Update selected medications
  const setSelectedMedications = useCallback((medications) => {
    setState(prev => ({
      ...prev,
      selectedMedications: medications,
    }));
  }, []);

  // Add a medication to selection
  const addMedication = useCallback((medication) => {
    setState(prev => {
      if (prev.selectedMedications.find(m => m.id === medication.id)) {
        return prev;
      }
      return {
        ...prev,
        selectedMedications: [...prev.selectedMedications, medication],
      };
    });
  }, []);

  // Remove a medication from selection
  const removeMedication = useCallback((medicationId) => {
    setState(prev => ({
      ...prev,
      selectedMedications: prev.selectedMedications.filter(m => m.id !== medicationId),
    }));
  }, []);

  // Set results
  const setResults = useCallback((results) => {
    setState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        ...results,
      },
      hasSeenResults: true,
    }));
  }, []);

  // Reset all progress (but preserve usage tracking)
  const resetProgress = useCallback(() => {
    setState(prev => ({
      ...initialState,
      isOpen: true, // Keep widget open after reset
      // Preserve usage tracking across resets
      usageTracking: prev.usageTracking,
    }));
  }, []);

  // Increment search count and check limit
  const incrementSearchCount = useCallback(() => {
    setState(prev => {
      const newSearchCount = prev.usageTracking.searchCount + 1;
      const searchLimitReached = newSearchCount >= MAX_FREE_SEARCHES;
      return {
        ...prev,
        usageTracking: {
          ...prev.usageTracking,
          searchCount: newSearchCount,
          searchLimitReached,
        },
      };
    });
  }, []);

  // Increment quiz completion count
  const incrementQuizCompletions = useCallback(() => {
    setState(prev => ({
      ...prev,
      usageTracking: {
        ...prev.usageTracking,
        quizCompletionsCount: prev.usageTracking.quizCompletionsCount + 1,
      },
    }));
  }, []);

  // Check if search limit is reached
  const isSearchLimitReached = useMemo(() => {
    return state.usageTracking.searchCount >= MAX_FREE_SEARCHES;
  }, [state.usageTracking.searchCount]);

  // Get remaining searches
  const remainingSearches = useMemo(() => {
    return Math.max(0, MAX_FREE_SEARCHES - state.usageTracking.searchCount);
  }, [state.usageTracking.searchCount]);

  // Check if user has any saved progress
  const hasProgress = useMemo(() => {
    return Object.keys(state.answers).length > 0 ||
           state.selectedMedications.length > 0 ||
           state.quizProgress.currentQuestionIndex > 0;
  }, [state.answers, state.selectedMedications, state.quizProgress.currentQuestionIndex]);

  // Get current quiz question
  const currentQuizQuestion = useMemo(() => {
    return QUIZ_QUESTIONS[state.quizProgress.currentQuestionIndex] || null;
  }, [state.quizProgress.currentQuestionIndex]);

  // Calculate quiz completion percentage
  const quizCompletionPercent = useMemo(() => {
    const answered = Object.keys(state.answers).length;
    return Math.round((answered / QUIZ_QUESTIONS.length) * 100);
  }, [state.answers]);

  // Get profile summary from answers
  const profileSummary = useMemo(() => {
    const { answers, selectedMedications } = state;
    return {
      role: answers.role,
      medicationStage: answers.medication_stage,
      organType: answers.organ_type,
      insuranceType: answers.insurance_type,
      costBurden: answers.cost_burden,
      medications: selectedMedications,
      isComplete: Object.keys(answers).length >= QUIZ_QUESTIONS.length - 1, // -1 for optional medication
    };
  }, [state.answers, state.selectedMedications]);

  const value = useMemo(() => ({
    // State
    mode: state.mode,
    isOpen: state.isOpen,
    answers: state.answers,
    quizProgress: state.quizProgress,
    chatState: state.chatState,
    selectedMedications: state.selectedMedications,
    results: state.results,
    hasSeenResults: state.hasSeenResults,
    usageTracking: state.usageTracking,

    // Computed values
    hasProgress,
    currentQuizQuestion,
    quizCompletionPercent,
    profileSummary,
    questions: QUIZ_QUESTIONS,
    isSearchLimitReached,
    remainingSearches,
    maxFreeSearches: MAX_FREE_SEARCHES,

    // Actions
    setMode,
    setIsOpen,
    setAnswer,
    setAnswers,
    setQuizProgress,
    nextQuizQuestion,
    prevQuizQuestion,
    setChatState,
    addChatMessage,
    setSelectedMedications,
    addMedication,
    removeMedication,
    setResults,
    resetProgress,
    incrementSearchCount,
    incrementQuizCompletions,
  }), [
    state,
    hasProgress,
    currentQuizQuestion,
    quizCompletionPercent,
    profileSummary,
    isSearchLimitReached,
    remainingSearches,
    setMode,
    setIsOpen,
    setAnswer,
    setAnswers,
    setQuizProgress,
    nextQuizQuestion,
    prevQuizQuestion,
    setChatState,
    addChatMessage,
    setSelectedMedications,
    addMedication,
    removeMedication,
    setResults,
    resetProgress,
    incrementSearchCount,
    incrementQuizCompletions,
  ]);

  return (
    <ChatQuizContext.Provider value={value}>
      {children}
    </ChatQuizContext.Provider>
  );
}

export function useChatQuiz() {
  const context = useContext(ChatQuizContext);
  if (!context) {
    throw new Error('useChatQuiz must be used within a ChatQuizProvider');
  }
  return context;
}

export { QUIZ_QUESTIONS };
export default ChatQuizContext;
