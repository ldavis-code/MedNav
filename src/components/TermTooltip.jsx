import { useState, useEffect, useRef } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import GLOSSARY from '../data/glossary.json';

/**
 * Normalize a term key for glossary lookup
 */
function normalizeKey(term) {
  return term.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * TermTooltip - Interactive tooltip that shows glossary definitions
 * Supports hover, focus, and click interactions for accessibility.
 */
export const TermTooltip = ({ term, children, showIcon = true, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);
  const termKey = normalizeKey(term);
  const entry = GLOSSARY.terms?.[termKey];

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  if (!entry) {
    return <span className={className}>{children || term}</span>;
  }

  const tooltipId = `tooltip-${termKey}`;

  return (
    <span ref={tooltipRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-emerald-700 underline decoration-dotted underline-offset-2 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded cursor-help"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
      >
        {children || entry.term || term}
        {showIcon && <HelpCircle size={14} aria-hidden="true" className="inline-block opacity-60" />}
      </button>
      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg max-w-xs z-50 animate-in fade-in duration-150"
        >
          <span className="font-semibold block mb-1">{entry.term || term}</span>
          <span className="text-slate-200">{entry.definition}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" aria-hidden="true" />
        </span>
      )}
    </span>
  );
};

/**
 * DefineInline - Shows a term with its definition in parentheses
 */
export const DefineInline = ({ term, className = '' }) => {
  const termKey = normalizeKey(term);
  const entry = GLOSSARY.terms?.[termKey];

  if (!entry) {
    return <span className={className}>{term}</span>;
  }

  return (
    <span className={className}>
      <strong>{entry.term || term}</strong>{' '}
      <span className="text-slate-500">({entry.definition})</span>
    </span>
  );
};

/**
 * GlossaryLink - "What's this?" expandable definition
 */
export const GlossaryLink = ({ term, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const termKey = normalizeKey(term);
  const entry = GLOSSARY.terms?.[termKey];

  if (!entry) return null;

  return (
    <span className={`inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
        aria-expanded={isExpanded}
      >
        What&apos;s this?
        {isExpanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
      </button>
      {isExpanded && (
        <span className="block mt-1 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-slate-700">
          <strong>{entry.term || term}:</strong> {entry.definition}
        </span>
      )}
    </span>
  );
};

export default TermTooltip;
