/**
 * Medication Assistant Chat Component
 * AI-powered chatbot with integrated quiz mode
 * Seamlessly switch between conversational chat and structured quiz
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, X, Send, HeartHandshake, Check, Search,
  ChevronRight, ChevronLeft, Loader2, Pill, ExternalLink, RefreshCw,
  User, Building2, Heart, AlertCircle, Printer, Lock,
  ClipboardList, Sparkles, ArrowLeftRight, CheckCircle2, Circle
} from 'lucide-react';
import { useChatQuiz, QUIZ_QUESTIONS } from '../context/ChatQuizContext.jsx';

// Mode toggle tabs
const MODE_TABS = [
  { id: 'chat', label: 'Chat', icon: MessageCircle, description: 'Conversational guidance' },
  { id: 'quiz', label: 'My Path Quiz', icon: ClipboardList, description: 'Step-by-step questions' },
];

const MedicationAssistantChat = () => {
  // Context for shared state
  const {
    mode,
    setMode,
    isOpen,
    setIsOpen,
    answers,
    setAnswer,
    setAnswers,
    quizProgress,
    nextQuizQuestion,
    prevQuizQuestion,
    setQuizProgress,
    selectedMedications,
    addMedication,
    removeMedication,
    setSelectedMedications,
    results,
    setResults,
    hasProgress,
    currentQuizQuestion,
    quizCompletionPercent,
    profileSummary,
    questions,
    resetProgress,
    hasSeenResults,
    // Usage tracking
    usageTracking,
    isSearchLimitReached,
    remainingSearches,
    maxFreeSearches,
    incrementSearchCount,
    incrementQuizCompletions,
  } = useChatQuiz();

  // Local chat state (kept separate for API communication)
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [chatQuestionIndex, setChatQuestionIndex] = useState(0);
  const [isChatComplete, setIsChatComplete] = useState(false);

  // Medication search state
  const [medicationSearch, setMedicationSearch] = useState('');
  const [medicationResults, setMedicationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Free text input
  const [inputValue, setInputValue] = useState('');

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const lastUserMessageRef = useRef(null);

  // Scroll handling
  const scrollToLastUserMessage = useCallback(() => {
    setTimeout(() => {
      if (lastUserMessageRef.current && messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const userMessage = lastUserMessageRef.current;
        const offsetTop = userMessage.offsetTop - 16;
        container.scrollTop = offsetTop;
      } else if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 150);
  }, []);

  useEffect(() => {
    scrollToLastUserMessage();
  }, [messages, isLoading, scrollToLastUserMessage]);

  // Initialize chat when opened in chat mode
  useEffect(() => {
    if (isOpen && mode === 'chat' && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, mode]);

  // Sync chat answers with context when switching modes
  useEffect(() => {
    if (mode === 'quiz' && Object.keys(answers).length > 0) {
      // Answers are already synced via context
    }
  }, [mode, answers]);

  // Initialize the chat session
  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setConversationId(data.conversationId);
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }]);
      setChatQuestionIndex(0);
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: "Hi! I'm your Medication Navigator. I'll help you find assistance programs for your medications. Let's get started!\n\nFirst, who am I helping today?",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle option selection (chat mode)
  const handleChatOptionSelect = async (option) => {
    const question = QUIZ_QUESTIONS[chatQuestionIndex];

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: option.label,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Update both local and context answers
    const newAnswers = { ...answers, [question.id]: option.value };
    setAnswer(question.id, option.value);

    if (chatQuestionIndex >= QUIZ_QUESTIONS.length - 1) {
      await generateResults(newAnswers);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'answer',
            conversationId,
            questionId: question.id,
            answer: option.value,
            answers: newAnswers,
          }),
        });

        const data = await response.json();

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'assistant',
            content: data.message || QUIZ_QUESTIONS[chatQuestionIndex + 1]?.question || '',
            timestamp: new Date(),
          }]);
          setChatQuestionIndex(prev => prev + 1);
          setIsLoading(false);
        }, 300);
      } catch (err) {
        console.error('Failed to process answer:', err);
        setTimeout(() => {
          const nextQ = QUIZ_QUESTIONS[chatQuestionIndex + 1];
          if (nextQ) {
            setMessages(prev => [...prev, {
              id: Date.now(),
              role: 'assistant',
              content: nextQ.question,
              timestamp: new Date(),
            }]);
          }
          setChatQuestionIndex(prev => prev + 1);
          setIsLoading(false);
        }, 300);
      }
    }
  };

  // Handle quiz option selection
  const handleQuizOptionSelect = (option) => {
    const question = currentQuizQuestion;
    if (!question) return;

    setAnswer(question.id, option.value);

    // Auto-advance after a brief delay for visual feedback
    setTimeout(() => {
      if (quizProgress.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        nextQuizQuestion();
      } else {
        // Quiz complete - generate results
        const finalAnswers = { ...answers, [question.id]: option.value };
        setQuizProgress({ isComplete: true, completedAt: new Date().toISOString() });
        generateResults(finalAnswers);
      }
    }, 200);
  };

  // Search medications from database
  const searchMedications = async (query) => {
    if (!query || query.length < 2) {
      setMedicationResults([]);
      return;
    }

    // Check if search limit has been reached
    if (isSearchLimitReached) {
      setMedicationResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'searchMedications',
          query,
        }),
      });

      const data = await response.json();
      setMedicationResults(data.medications || []);

      // Increment search count after successful search
      incrementSearchCount();
    } catch (err) {
      console.error('Medication search failed:', err);
      setMedicationResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced medication search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (medicationSearch) {
        searchMedications(medicationSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [medicationSearch]);

  // Handle medication selection
  const handleMedicationSelect = (medication) => {
    if (selectedMedications.find(m => m.id === medication.id)) {
      return;
    }
    addMedication(medication);
    setMedicationSearch('');
    setMedicationResults([]);
  };

  // Handle medication removal
  const handleMedicationRemove = (medicationId) => {
    removeMedication(medicationId);
  };

  // Proceed with selected medications
  const handleMedicationsContinue = () => {
    if (selectedMedications.length === 0) {
      if (mode === 'chat') {
        handleChatOptionSelect({ value: 'general', label: 'General assistance (no specific medication)' });
      } else {
        setAnswer('medication', 'general');
        nextQuizQuestion();
      }
    } else {
      const medIds = selectedMedications.map(m => m.id);
      const medLabels = selectedMedications.map(m => `${m.brand_name} (${m.generic_name})`).join(', ');

      if (mode === 'chat') {
        handleChatOptionSelect({
          value: medIds.length === 1 ? medIds[0] : medIds,
          label: medLabels,
        });
      } else {
        setAnswer('medication', medIds.length === 1 ? medIds[0] : medIds);
        nextQuizQuestion();
      }
    }
    setMedicationSearch('');
    setMedicationResults([]);
  };

  // Generate final results
  const generateResults = async (finalAnswers) => {
    setIsLoading(true);
    setIsChatComplete(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateResults',
          conversationId,
          answers: finalAnswers,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Track quiz completion
      incrementQuizCompletions();

      // Store results in context
      setResults({
        programs: data.programs || [],
        medicationPrograms: data.medicationPrograms || [],
        costPlusMedications: data.costPlusMedications || [],
        message: data.message,
      });

      // Add to chat messages if in chat mode
      if (mode === 'chat') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: data.message,
          programs: data.programs,
          medicationPrograms: data.medicationPrograms,
          costPlusMedications: data.costPlusMedications,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error('Failed to generate results:', err);
      setError('Sorry, I had trouble finding programs. Please try again.');

      if (mode === 'chat') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting to our database right now. Please try again in a moment, or visit our Resources page to browse assistance programs manually.",
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle free text input
  const handleTextSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'freeText',
          conversationId,
          message: inputValue,
          answers,
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Failed to process message:', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: "I'm sorry, I couldn't process that. Please try selecting from the options above, or ask your question again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setMessages([]);
    setConversationId(null);
    setChatQuestionIndex(0);
    setIsChatComplete(false);
    setError(null);
    setMedicationSearch('');
    setMedicationResults([]);
    resetProgress();
    setTimeout(() => {
      if (mode === 'chat') {
        initializeChat();
      }
    }, 100);
  };

  // Switch mode
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'chat' && messages.length === 0) {
      initializeChat();
    }
  };

  // Print action plan
  const printActionPlan = () => {
    const programsData = results.medicationPrograms?.length > 0
      ? results.medicationPrograms
      : (messages.find(m => m.medicationPrograms)?.medicationPrograms || []);

    if (programsData.length === 0 && !results.programs?.length) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print your action plan');
      return;
    }

    let programsHtml = '';
    if (programsData.length > 0) {
      programsHtml = programsData.map(medGroup => `
        <div style="border: 2px solid #334155; border-radius: 12px; margin-bottom: 24px; overflow: hidden;">
          <div style="background: #f1f5f9; padding: 12px 16px; border-bottom: 1px solid #cbd5e1;">
            <h3 style="margin: 0; color: #1e293b; font-size: 18px;">${medGroup.medication_name}</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">${medGroup.generic_name}</p>
          </div>
          <div style="padding: 16px;">
            ${medGroup.programs?.length > 0 ? medGroup.programs.map(program => `
              <div style="border: 1px solid #10b981; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #ecfdf5;">
                <strong style="color: #065f46;">${program.program_name}</strong>
                ${program.max_benefit ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Benefit:</strong> ${program.max_benefit}</p>` : ''}
                ${program.eligibility_summary ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Eligibility:</strong> ${program.eligibility_summary}</p>` : ''}
                ${program.application_url ? `<p style="margin: 8px 0 0 0; font-size: 13px;"><strong>Apply:</strong> <a href="${program.application_url}" style="color: #059669;">${program.application_url}</a></p>` : ''}
              </div>
            `).join('') : '<p style="color: #64748b;">Contact your healthcare provider social worker for assistance.</p>'}
          </div>
        </div>
      `).join('');
    }

    const profileHtml = `
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #334155;">Your Profile</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Insurance:</strong> ${answers.insurance_type || 'Not specified'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>medication Stage:</strong> ${answers.medication_stage || 'Not specified'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Organ Type:</strong> ${answers.organ_type || 'Not specified'}</p>
      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medication Assistance Action Plan</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px; color: #1e293b; }
          h1 { color: #065f46; border-bottom: 2px solid #10b981; padding-bottom: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>Medication Assistance Action Plan</h1>
        <p style="color: #64748b;">Generated: ${new Date().toLocaleDateString()}</p>
        ${profileHtml}
        <h2>Recommended Programs</h2>
        ${programsHtml}
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p>Generated by MedicationNavigator.com</p>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  // Render message content
  const renderMessageContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');

    return lines.map((line, i) => {
      let processedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      processedLine = processedLine.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 underline">$1</a>'
      );

      if (line.startsWith('### ')) {
        return <h3 key={i} className="font-bold text-lg mt-4 mb-2 text-slate-900">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="font-bold text-xl mt-4 mb-2 text-slate-900">{line.slice(3)}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 mb-1" dangerouslySetInnerHTML={{ __html: processedLine.slice(2) }} />;
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={i} className="ml-4 mb-1 list-decimal" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
    });
  };

  // Render medication search UI
  const renderMedicationSearch = () => {
    // Show search limit reached UI
    if (isSearchLimitReached) {
      return (
        <div className="p-3 bg-slate-50 rounded-xl space-y-3">
          {/* Search Limit Reached Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <Lock className="mx-auto text-amber-600 mb-2" size={28} />
            <h4 className="font-bold text-amber-800 text-sm mb-1">Search Limit Reached</h4>
            <p className="text-xs text-amber-700 mb-3">
              You've used all {maxFreeSearches} free medication searches.
            </p>
            <a
              href="/pricing"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
            >
              Upgrade for Unlimited Searches
            </a>
          </div>

          {/* Still allow continuing with selected medications or skipping */}
          {selectedMedications.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Selected Medications:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMedications.map((med) => (
                    <span
                      key={med.id}
                      className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                    >
                      {med.brand_name}
                      <button
                        onClick={() => handleMedicationRemove(med.id)}
                        className="hover:bg-emerald-200 rounded-full p-0.5"
                        aria-label={`Remove ${med.brand_name}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleMedicationsContinue}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                Continue with {selectedMedications.length} medication{selectedMedications.length > 1 ? 's' : ''}
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <button
            onClick={() => {
              if (mode === 'chat') {
                handleChatOptionSelect({ value: 'general', label: 'General assistance' });
              } else {
                setAnswer('medication', 'general');
                nextQuizQuestion();
              }
            }}
            className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="font-medium text-slate-700">Skip this step</div>
            <div className="text-sm text-slate-500">Show general assistance programs</div>
          </button>
        </div>
      );
    }

    return (
      <div className="p-3 bg-slate-50 rounded-xl space-y-3">
        {/* Search Usage Indicator */}
        {remainingSearches <= maxFreeSearches && remainingSearches > 0 && (
          <div className={`text-xs px-3 py-1.5 rounded-lg flex items-center justify-between ${
            remainingSearches <= 1 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
          }`}>
            <span>
              {remainingSearches === 1 ? '⚠️ Last free search remaining' : `${remainingSearches} searches remaining`}
            </span>
            <a href="/pricing" className="underline hover:no-underline font-medium">
              Upgrade
            </a>
          </div>
        )}

        {selectedMedications.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Selected Medications:</div>
            <div className="flex flex-wrap gap-2">
              {selectedMedications.map((med) => (
                <span
                  key={med.id}
                  className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                >
                  {med.brand_name}
                  <button
                    onClick={() => handleMedicationRemove(med.id)}
                    className="hover:bg-emerald-200 rounded-full p-0.5"
                    aria-label={`Remove ${med.brand_name}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={medicationSearch}
            onChange={(e) => setMedicationSearch(e.target.value)}
            placeholder={selectedMedications.length > 0 ? "Add another medication..." : "Type medication name..."}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            autoFocus
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={18} />
          )}
        </div>

        {medicationResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white">
            {medicationResults.map((med) => {
              const isSelected = selectedMedications.find(m => m.id === med.id);
              return (
                <button
                  key={med.id}
                  onClick={() => handleMedicationSelect(med)}
                  disabled={isSelected}
                  className={`w-full text-left p-3 border-b border-slate-100 last:border-b-0 transition ${
                    isSelected ? 'bg-emerald-50 opacity-50' : 'hover:bg-emerald-50'
                  }`}
                >
                  <div className="font-medium text-slate-900 flex items-center gap-2">
                    {med.brand_name}
                    {isSelected && <Check size={16} className="text-emerald-600" />}
                  </div>
                  <div className="text-sm text-slate-500">{med.generic_name} {med.category && `* ${med.category}`}</div>
                </button>
              );
            })}
          </div>
        )}

        {medicationSearch && medicationSearch.length >= 2 && medicationResults.length === 0 && !isSearching && (
          <button
            onClick={() => handleMedicationSelect({ id: medicationSearch, brand_name: medicationSearch, generic_name: 'Custom entry' })}
            className="w-full text-left p-3 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition"
          >
            <div className="font-medium text-emerald-700">Add "{medicationSearch}"</div>
            <div className="text-sm text-slate-500">Add this medication to your list</div>
          </button>
        )}

        {selectedMedications.length > 0 && (
          <button
            onClick={handleMedicationsContinue}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            Continue with {selectedMedications.length} medication{selectedMedications.length > 1 ? 's' : ''}
            <ChevronRight size={18} />
          </button>
        )}

        {selectedMedications.length === 0 && (
          <button
            onClick={() => {
              if (mode === 'chat') {
                handleChatOptionSelect({ value: 'general', label: 'General assistance' });
              } else {
                setAnswer('medication', 'general');
                nextQuizQuestion();
              }
            }}
            className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="font-medium text-slate-700">Skip this step</div>
            <div className="text-sm text-slate-500">Show general assistance programs</div>
          </button>
        )}
      </div>
    );
  };

  // Render quiz progress indicator
  const renderQuizProgress = () => {
    return (
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Question {quizProgress.currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{quizCompletionPercent}% complete</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((quizProgress.currentQuestionIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Render quiz mode content
  const renderQuizMode = () => {
    if (quizProgress.isComplete || hasSeenResults) {
      return renderUnifiedResults();
    }

    const question = currentQuizQuestion;
    if (!question) return null;

    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
        {/* Question Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
          <h3 className="text-lg font-bold text-slate-800 mb-1">{question.question}</h3>
          {question.helpText && (
            <p className="text-sm text-slate-500 mb-4">{question.helpText}</p>
          )}
        </div>

        {/* Options or Medication Search */}
        {question.type === 'medication_search' ? (
          renderMedicationSearch()
        ) : (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const isSelected = answers[question.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleQuizOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : option.urgent
                      ? 'border-red-200 hover:border-red-400 hover:bg-red-50'
                      : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {option.label}
                        {option.hint && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {option.hint}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <div className="text-sm text-slate-500 mt-0.5">{option.description}</div>
                      )}
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <Circle size={20} className="text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        {quizProgress.currentQuestionIndex > 0 && (
          <button
            onClick={prevQuizQuestion}
            className="mt-4 flex items-center gap-1 text-slate-600 hover:text-emerald-700 text-sm"
          >
            <ChevronLeft size={16} />
            Previous question
          </button>
        )}
      </div>
    );
  };

  // Render unified results
  const renderUnifiedResults = () => {
    const programsData = results.medicationPrograms?.length > 0
      ? results.medicationPrograms
      : [];

    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
        {/* Success Header */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-center">
          <Sparkles className="mx-auto text-emerald-600 mb-2" size={28} />
          <h3 className="font-bold text-emerald-800 text-lg">Your Personalized Results</h3>
          <p className="text-sm text-emerald-600">Based on your profile, here are programs you may qualify for</p>
        </div>

        {/* Profile Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <User size={16} />
            Your Profile
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-slate-500">Insurance:</span> <span className="font-medium">{answers.insurance_type || '-'}</span></div>
            <div><span className="text-slate-500">Stage:</span> <span className="font-medium">{answers.medication_stage || '-'}</span></div>
            <div><span className="text-slate-500">Organ:</span> <span className="font-medium">{answers.organ_type || '-'}</span></div>
            <div><span className="text-slate-500">Cost:</span> <span className="font-medium">{answers.cost_burden || '-'}</span></div>
          </div>
        </div>

        {/* Programs by Medication */}
        {programsData.length > 0 ? (
          <div className="space-y-4">
            {programsData.map((medGroup, idx) => (
              <div key={idx} className="border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <Pill size={16} className="text-emerald-600" />
                    {medGroup.medication_name}
                  </div>
                  <div className="text-xs text-slate-500">{medGroup.generic_name}</div>
                </div>
                <div className="p-3 space-y-2">
                  {/* Cost Plus Drugs - show if available for this medication */}
                  {medGroup.cost_plus_available && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-blue-800 text-sm">Cost Plus Drugs</div>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Low Cost
                        </span>
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        <strong>Benefit:</strong> Wholesale cost + 15% + $5 pharmacy fee
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Mark Cuban's transparent pricing pharmacy - often 50-90% less than retail
                      </p>
                      <a
                        href={`https://costplusdrugs.com/medications/${medGroup.generic_name?.toLowerCase().replace(/\s+/g, '-') || ''}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg mt-2 font-medium transition"
                      >
                        Check Price <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {medGroup.programs?.length > 0 ? (
                    medGroup.programs.map((program, pIdx) => (
                      <div key={pIdx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-emerald-800 text-sm">{program.program_name}</div>
                          {program.program_type && (
                            <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {program.program_type === 'copay_card' && 'Copay Card'}
                              {program.program_type === 'pap' && 'Free Meds'}
                              {program.program_type === 'foundation' && 'Foundation'}
                            </span>
                          )}
                        </div>
                        {program.max_benefit && (
                          <div className="text-xs text-emerald-700 mt-1">
                            <strong>Benefit:</strong> {program.max_benefit}
                          </div>
                        )}
                        {program.application_url && (
                          <a
                            href={program.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg mt-2 font-medium transition"
                          >
                            Apply <ExternalLink size={12} />
                          </a>
                        )}
                        {program.program_type === 'foundation' && (
                          <p className="text-xs text-emerald-600 mt-2 italic">
                            💡 Tip: Funds open throughout the year—check back if currently closed!
                          </p>
                        )}
                      </div>
                    ))
                  ) : !medGroup.cost_plus_available && (
                    <p className="text-sm text-slate-500 p-2">
                      Contact your healthcare provider social worker for assistance options.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : results.message ? (
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-sm text-slate-700">{renderMessageContent(results.message)}</div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No specific programs found. Contact your healthcare provider for assistance.</p>
          </div>
        )}
      </div>
    );
  };

  // Render chat options
  const renderChatQuestionOptions = () => {
    if (isChatComplete || isLoading) return null;

    const question = QUIZ_QUESTIONS[chatQuestionIndex];
    if (!question) return null;

    if (question.type === 'medication_search') {
      return renderMedicationSearch();
    }

    return (
      <div className="p-3 bg-slate-50 rounded-xl space-y-2">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChatOptionSelect(option)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
              option.urgent
                ? 'border-red-200 hover:border-red-400 hover:bg-red-50'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium text-slate-900 flex items-center gap-2">
                  {option.label}
                  {option.hint && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      {option.hint}
                    </span>
                  )}
                </div>
                {option.description && (
                  <div className="text-sm text-slate-500 mt-0.5">{option.description}</div>
                )}
              </div>
              <ChevronRight size={18} className="text-slate-400 mt-1" />
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Render programs in messages
  const renderMessagePrograms = (message) => {
    if (!message.medicationPrograms?.length && !message.programs?.length) return null;

    const programsData = message.medicationPrograms?.length > 0
      ? message.medicationPrograms
      : null;

    if (programsData) {
      return (
        <div className="mt-4 space-y-4">
          {programsData.map((medGroup, medIdx) => (
            <div key={medIdx} className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Pill size={16} className="text-emerald-600" />
                  {medGroup.medication_name}
                </div>
                <div className="text-xs text-slate-500">{medGroup.generic_name}</div>
              </div>
              <div className="p-2 space-y-2">
                {/* Cost Plus Drugs - show if available */}
                {medGroup.cost_plus_available && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="font-semibold text-blue-800 text-sm">Cost Plus Drugs</div>
                    <p className="text-xs text-blue-600 mt-1">Low-cost transparent pricing</p>
                    <a
                      href={`https://costplusdrugs.com/medications/${medGroup.generic_name?.toLowerCase().replace(/\s+/g, '-') || ''}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg mt-2 font-medium transition"
                    >
                      Check Price <ExternalLink size={12} />
                    </a>
                  </div>
                )}
                {medGroup.programs?.length > 0 ? (
                  medGroup.programs.map((program, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="font-semibold text-emerald-800 text-sm">{program.program_name}</div>
                      {program.application_url && (
                        <a
                          href={program.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg mt-2 font-medium transition"
                        >
                          Apply <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))
                ) : !medGroup.cost_plus_available && (
                  <p className="text-sm text-slate-500 p-2">Contact your healthcare provider.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center gap-2 group hover:scale-105"
          aria-label="Open medication assistance"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
            {hasProgress ? 'Continue where you left off' : 'Need help with medication costs?'}
          </span>
        </button>
      )}

      {/* Chat/Quiz Window */}
      {isOpen && (
        <div
          className="bg-white rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[420px] h-[85vh] sm:h-[650px] max-h-[700px] flex flex-col border border-slate-200 animate-in slide-in-from-bottom-5"
          role="dialog"
          aria-modal="true"
          aria-label="Medication assistance"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-t-2xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Medication Navigator</h2>
                  <p className="text-xs text-emerald-100">Find assistance programs</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {(hasProgress || messages.length > 1 || isChatComplete) && (
                  <button
                    onClick={handleReset}
                    className="hover:bg-white/20 p-2 rounded-lg transition"
                    aria-label="Start over"
                    title="Start over"
                  >
                    <RefreshCw size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              {MODE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleModeSwitch(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-white text-emerald-700'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Progress Bar */}
          {mode === 'quiz' && !quizProgress.isComplete && !hasSeenResults && renderQuizProgress()}

          {/* Content Area */}
          {mode === 'quiz' ? (
            renderQuizMode()
          ) : (
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
              {messages.map((message, index) => {
                const isLastUserMessage = message.role === 'user' &&
                  index === messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop();

                return (
                  <div
                    key={message.id}
                    ref={isLastUserMessage ? lastUserMessageRef : null}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="text-sm leading-relaxed">
                        {renderMessageContent(message.content)}
                      </div>
                      {renderMessagePrograms(message)}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm">Finding the best options for you...</span>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !isChatComplete && messages.length > 0 && renderChatQuestionOptions()}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Footer / Input Area */}
          <div className="border-t border-slate-200 p-4 bg-white rounded-b-2xl">
            {(isChatComplete || (mode === 'quiz' && (quizProgress.isComplete || hasSeenResults))) ? (
              <div className="space-y-2">
                <button
                  onClick={printActionPlan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Printer size={18} />
                  Print Action Plan
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw size={18} />
                  Start New Search
                </button>
                <a
                  href="/wizard"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition block text-center"
                >
                  <Search size={18} />
                  Start My Path Quiz
                </a>
              </div>
            ) : mode === 'chat' ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="Or type a question..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500">
                <ArrowLeftRight size={16} className="inline mr-1" />
                Switch to Chat mode to ask questions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationAssistantChat;
