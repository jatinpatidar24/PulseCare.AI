import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  RefreshCw, 
  Key, 
  Check, 
  ChevronDown,
  Stethoscope,
  Activity
} from 'lucide-react';
import { mlAPI } from '../services/api';

export const SymptomChatbot = ({ isOpen, onClose, onBookDoctor }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AI Health Assistant powered by clinical ML. Describe any symptoms you are feeling (e.g. *'I have had a high fever, severe headache, and joint pain'*), and I will triage your condition and recommend the best doctor."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [keyInput, setKeyInput] = useState(apiKey);
  const [keySaved, setKeySaved] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const historyPayload = newMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const res = await mlAPI.chat({
        message: userText,
        history: historyPayload,
        api_key: apiKey || undefined
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.reply,
          detected_symptoms: res.data.detected_symptoms,
          prediction: res.data.prediction,
          recommended_doctors: res.data.recommended_doctors
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered a temporary connection issue. Please check your symptoms or try rephrasing your message."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', keyInput);
    setApiKey(keyInput);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyModal(false);
    }, 1000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. What symptoms or health concerns would you like to discuss today?"
      }
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[420px] max-h-[640px] h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold tracking-tight">AI Health Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-teal-100">Clinical Triage & Doctor Matcher</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowKeyModal(!showKeyModal)}
            title="Configure Gemini API Key"
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-teal-100 hover:text-white"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetChat}
            title="Reset Chat"
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-teal-100 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-teal-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Optional API Key Setting Popover */}
      {showKeyModal && (
        <div className="p-3 bg-teal-50 border-b border-teal-100 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-teal-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Optional Gemini API Key</span>
            </span>
            <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600">
            Works 100% offline with local NLP! Optionally add a Google Gemini key for conversational dialogue.
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-teal-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleSaveKey}
              className="px-3 py-1 bg-teal-700 text-white rounded-lg font-medium text-xs hover:bg-teal-800 transition-colors flex items-center space-x-1"
            >
              {keySaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <span>Save</span>}
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Message body with basic markdown line breaks */}
                <div className="whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Detected Symptoms Badges */}
                {msg.detected_symptoms?.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Recognized:</span>
                    {msg.detected_symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-medium border border-teal-100"
                      >
                        {s.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* In-Chat Doctor Recommendation Card */}
              {msg.recommended_doctors?.length > 0 && (
                <div className="mt-2.5 w-full max-w-[90%] space-y-2">
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center space-x-1">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recommended Specialists:</span>
                  </span>
                  
                  {msg.recommended_doctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-xl p-2.5 border border-teal-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={doc.image_url}
                          alt={doc.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                          <p className="text-[10px] text-teal-600 font-medium">{doc.specialization} • ${doc.consultation_fee}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onBookDoctor(doc, msg.detected_symptoms?.join(', '));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold flex items-center space-x-1 transition-colors shrink-0"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 max-w-[200px]">
            <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
            <span>Analyzing clinical data...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        {[
          "High fever and severe chills",
          "Skin rash with itching",
          "Chest pain and breathlessness",
          "Joint pain and stiff neck"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(prompt);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms in natural words..."
          disabled={loading}
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
