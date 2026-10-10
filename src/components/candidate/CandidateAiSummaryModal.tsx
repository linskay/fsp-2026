import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  BrainCircuit, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Copy, 
  Check, 
  ArrowRight, 
  Sliders, 
  Key, 
  ExternalLink, 
  Server, 
  Globe, 
  ShieldAlert,
  Flame
} from 'lucide-react';
import { CandidateAiSummary, CandidateProfile } from '../../types';
import { api } from '../../services/api';

interface CandidateAiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  onSaveSummary: (summary: CandidateAiSummary) => void;
}

type AiProviderType = 'gemini' | 'yandexgpt' | 'openrouter' | 'ollama';

interface AiStorageSettings {
  geminiKey?: string;
  geminiModel?: string;
  yandexKey?: string;
  yandexFolderId?: string;
  openrouterKey?: string;
  openrouterModel?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
}

const STORAGE_KEY = 'fsp_ai_custom_keys';

export const CandidateAiSummaryModal: React.FC<CandidateAiSummaryModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSaveSummary
}) => {
  const [provider, setProvider] = useState<AiProviderType>('gemini');
  const [selectedFocus, setSelectedFocus] = useState<'highload' | 'algo' | 'lead' | 'balanced'>('highload');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<CandidateAiSummary | null>(candidate.aiSummary || null);
  const [copied, setCopied] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Provider configuration states
  const [geminiKey, setGeminiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');

  const [yandexKey, setYandexKey] = useState('');
  const [yandexFolderId, setYandexFolderId] = useState('');
  const [yandexModel, setYandexModel] = useState('yandexgpt');

  const [openrouterKey, setOpenrouterKey] = useState('');
  const [openrouterModel, setOpenrouterModel] = useState('meta-llama/llama-3.1-8b-instruct:free');

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434/v1/chat/completions');
  const [ollamaModel, setOllamaModel] = useState('llama3:8b');

  // Load saved keys from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AiStorageSettings = JSON.parse(saved);
        if (parsed.geminiKey) setGeminiKey(parsed.geminiKey);
        if (parsed.geminiModel) setGeminiModel(parsed.geminiModel);
        if (parsed.yandexKey) setYandexKey(parsed.yandexKey);
        if (parsed.yandexFolderId) setYandexFolderId(parsed.yandexFolderId);
        if (parsed.openrouterKey) setOpenrouterKey(parsed.openrouterKey);
        if (parsed.openrouterModel) setOpenrouterModel(parsed.openrouterModel);
        if (parsed.ollamaUrl) setOllamaUrl(parsed.ollamaUrl);
        if (parsed.ollamaModel) setOllamaModel(parsed.ollamaModel);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save keys to localStorage when updated
  const saveSettings = () => {
    const data: AiStorageSettings = {
      geminiKey,
      geminiModel,
      yandexKey,
      yandexFolderId,
      openrouterKey,
      openrouterModel,
      ollamaUrl,
      ollamaModel
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorStatus(null);
    saveSettings();

    let apiKey = '';
    let model = '';
    let folderId = '';
    let endpointUrl = '';

    if (provider === 'gemini') {
      apiKey = geminiKey;
      model = geminiModel;
    } else if (provider === 'yandexgpt') {
      apiKey = yandexKey;
      model = yandexModel;
      folderId = yandexFolderId;
    } else if (provider === 'openrouter') {
      apiKey = openrouterKey;
      model = openrouterModel;
    } else if (provider === 'ollama') {
      model = ollamaModel;
      endpointUrl = ollamaUrl;
    }

    try {
      const realSummary = await api.generateAiSummary({
        candidateId: candidate.id,
        provider,
        model,
        apiKey: apiKey || undefined,
        folderId: folderId || undefined,
        endpointUrl: endpointUrl || undefined,
        focus: selectedFocus,
        forceRefresh: true
      });

      if (realSummary) {
        setGeneratedSummary(realSummary);
      } else {
        // Fallback to get or generate
        const fallback = await api.getAiSummary(candidate.id);
        if (fallback) {
          setGeneratedSummary(fallback);
        } else {
          setErrorStatus('Сервис AI временно недоступен. Проверьте соединение с бэкендом.');
        }
      }
    } catch (e: any) {
      setErrorStatus(e?.message || 'Ошибка генерации саммари нейросетью');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedSummary) {
      navigator.clipboard.writeText(generatedSummary.summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (generatedSummary) {
      setIsSaving(true);
      try {
        await api.saveAiProfile({
          candidateId: candidate.id,
          summaryText: generatedSummary.summaryText,
          codeCleanlinessScore: 98,
          keyStrengths: generatedSummary.keyStrengths,
          recommendedRoles: generatedSummary.recommendedRoles
        });
      } catch (err) {
        console.warn("Save profile fallback to local callback", err);
      } finally {
        setIsSaving(false);
      }
      onSaveSummary(generatedSummary);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d121f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-6 modal-animate font-['JetBrains_Mono']">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-[#0d121f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                AI-Summary & Технический портрет кандидата
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  Live Neural Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Глубокий анализ профиля: ELO {candidate.fspRating}, {candidate.fspRank}, GitHub и LeetCode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151f38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* 1. Multi-Provider Switcher Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                Выберите нейросетевого провайдера (LLM):
              </span>
              <span className="text-[10px] text-slate-400">
                Переключатель в реальном времени
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Gemini (Default) */}
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  provider === 'gemini'
                    ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-blue-500/10'
                    : 'bg-[#0b1021] border-[#162038] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    Gemini
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                    Дефолт
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Google AI Studio</span>
              </button>

              {/* YandexGPT */}
              <button
                type="button"
                onClick={() => setProvider('yandexgpt')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  provider === 'yandexgpt'
                    ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-blue-500/10'
                    : 'bg-[#0b1021] border-[#162038] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    YandexGPT
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Yandex Cloud Foundation</span>
              </button>

              {/* OpenRouter */}
              <button
                type="button"
                onClick={() => setProvider('openrouter')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  provider === 'openrouter'
                    ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-blue-500/10'
                    : 'bg-[#0b1021] border-[#162038] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    OpenRouter
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Llama 3, DeepSeek</span>
              </button>

              {/* Local / Docker Ollama */}
              <button
                type="button"
                onClick={() => setProvider('ollama')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  provider === 'ollama'
                    ? 'bg-blue-600/20 border-cyan-400 text-white shadow-md shadow-blue-500/10'
                    : 'bg-[#0b1021] border-[#162038] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-amber-400" />
                    Ollama
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-cyan-300 text-[9px] font-bold">
                    Docker
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Локальная модель</span>
              </button>
            </div>
          </div>

          {/* 2. Provider Settings & Keys Box */}
          <div className="p-3.5 rounded-2xl bg-[#070b16] border border-[#162038] space-y-3">
            
            {/* Gemini Settings */}
            {provider === 'gemini' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Key className="w-3 h-3 text-cyan-400" />
                    Google Gemini API-Key (по умолчанию зашит серверный ключ):
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] underline underline-offset-2"
                  >
                    Получить свой ключ в Google AI Studio
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AQ... / Оставьте пустым для серверного ключа"
                    className="sm:col-span-2 px-3 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Быстрый)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Глубокий)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Эксперимент)</option>
                  </select>
                </div>
              </div>
            )}

            {/* YandexGPT Settings */}
            {provider === 'yandexgpt' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Key className="w-3 h-3 text-rose-400" />
                    Yandex Cloud API-Key и Folder ID:
                  </span>
                  <a
                    href="https://cloud.yandex.ru/docs/foundation-models/quickstart/yandexgpt"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[10px] underline underline-offset-2"
                  >
                    Консоль Yandex Cloud (выпустить ключ)
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="password"
                    value={yandexKey}
                    onChange={(e) => setYandexKey(e.target.value)}
                    placeholder="AQVN... (API-Key Yandex)"
                    className="px-3 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                  <input
                    type="text"
                    value={yandexFolderId}
                    onChange={(e) => setYandexFolderId(e.target.value)}
                    placeholder="b1g... (Folder ID)"
                    className="px-3 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                  <select
                    value={yandexModel}
                    onChange={(e) => setYandexModel(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-400"
                  >
                    <option value="yandexgpt">YandexGPT Pro</option>
                    <option value="yandexgpt-lite">YandexGPT Lite</option>
                  </select>
                </div>
              </div>
            )}

            {/* OpenRouter Settings */}
            {provider === 'openrouter' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Key className="w-3 h-3 text-purple-400" />
                    OpenRouter API-Key (или предустановленный ключ):
                  </span>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[10px] underline underline-offset-2"
                  >
                    Получить API-ключ на OpenRouter
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="password"
                    value={openrouterKey}
                    onChange={(e) => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-v1-... (по умолчанию из .env)"
                    className="sm:col-span-2 px-3 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                  <select
                    value={openrouterModel}
                    onChange={(e) => setOpenrouterModel(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                  >
                    <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Free)</option>
                    <option value="deepseek/deepseek-chat">DeepSeek Chat</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                </div>
              </div>
            )}

            {/* Ollama Settings */}
            {provider === 'ollama' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Server className="w-3 h-3 text-amber-400" />
                    Локальный Ollama Endpoint (Docker/Host):
                  </span>
                  <a
                    href="https://ollama.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] underline underline-offset-2"
                  >
                    Документация Ollama в Docker
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1/chat/completions"
                    className="sm:col-span-2 px-3 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#090d1a] border border-[#1e2a4a] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="llama3:8b">llama3:8b</option>
                    <option value="qwen2.5-coder:7b">qwen2.5-coder:7b</option>
                    <option value="mistral:latest">mistral:latest</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* 3. Focus Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Фокус саммари для работодателя:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'highload', label: 'HighLoad & Core' },
                { id: 'algo', label: 'Алгоритмы & Олимпиады' },
                { id: 'lead', label: 'Tech Lead & Менторство' },
                { id: 'balanced', label: 'Сбалансированный' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFocus(f.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all truncate cursor-pointer ${
                    selectedFocus === f.id
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-sm'
                      : 'bg-[#0b1021] border-[#162038] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error notice if any */}
          {errorStatus && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Generate Action Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Единый системный промпт ФСП РФ + реальный вызов нейросети</span>
            </div>

            <button
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Нейросеть генерирует портрет...' : 'Сгенерировать реальный AI-портрет'}</span>
            </button>
          </div>

          {/* Generated Result Container */}
          {generatedSummary && (
            <div className="p-5 rounded-2xl bg-[#0c1224] border border-[#1e2a4a] space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#141b2e]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Модель: {generatedSummary.modelUsed}
                  </span>
                  {generatedSummary.recommendationLevel && (
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {generatedSummary.recommendationLevel}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    Чистота кода: <strong className="text-emerald-400">{generatedSummary.codeCleanlinessScore}/100</strong>
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Скопировано' : 'Копировать'}</span>
                </button>
              </div>

              {/* Main Text Content */}
              <div className="p-4 rounded-xl bg-[#070b16] border border-[#162038] text-xs text-slate-200 leading-relaxed font-mono">
                "{generatedSummary.summaryText}"
              </div>

              {/* Strengths & Projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ключевые подтвержденные преимущества:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {generatedSummary.keyStrengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Рекомендуемые роли и позиции:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {(generatedSummary.recommendedRoles || generatedSummary.recommendedProjects).map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#060811] border-t border-[#141b2e] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Закрыть
          </button>
          
          <button
            disabled={!generatedSummary}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Сохранить в профиле соискателя</span>
          </button>
        </div>

      </div>
    </div>
  );
};
