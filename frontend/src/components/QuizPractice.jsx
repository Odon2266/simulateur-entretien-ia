import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Loader2, 
  Award,
  BookOpen,
  Sparkles,
  Send
} from 'lucide-react';

const PRESET_CATEGORIES = [
  { id: 'react', name: 'React & Frontend', color: 'from-cyan-500 to-blue-500' },
  { id: 'nodejs', name: 'Node.js & Express', color: 'from-emerald-500 to-green-600' },
  { id: 'python', name: 'Python & Django', color: 'from-amber-500 to-yellow-600' },
  { id: 'databases', name: 'Bases de données (SQL/NoSQL)', color: 'from-purple-500 to-indigo-600' }
];

export default function QuizPractice({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';
  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

  // Enregistrement automatique du score à la fin du quiz
  useEffect(() => {
    if (isQuizFinished && selectedCategory && questions.length > 0) {
      const saveResult = async () => {
        try {
          const token = getToken();
          await axios.post(
            `${API_BASE_URL}/practice-results/`,
            {
              category: selectedCategory.name,
              score: score,
              total_questions: questions.length,
            },
            {
              headers: { Authorization: `Token ${token}` }
            }
          );
        } catch (err) {
          console.error("Erreur lors de l'enregistrement de l'entraînement :", err);
        }
      };

      saveResult();
    }
  }, [isQuizFinished]);

  // Lancement du quiz pour une catégorie prédéfinie ou personnalisée
  const startQuiz = async (categoryObj) => {
    setSelectedCategory(categoryObj);
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsQuizFinished(false);

    try {
      const token = getToken();
      const res = await axios.get(
        `${API_BASE_URL}/quiz/?category=${encodeURIComponent(categoryObj.name)}&count=20`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setQuestions(res.data);
    } catch (err) {
      console.warn("Impossible de joindre l'API quiz, chargement de secours.", err);
      setQuestions([
        {
          id: 1,
          question: `Question de démonstration sur ${categoryObj.name} ?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "Veuillez vérifier votre connexion à l'API et votre clé Ollama."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;

    const customCategory = {
      id: 'custom',
      name: customCategoryInput.trim(),
      color: 'from-pink-500 to-rose-600'
    };

    startQuiz(customCategory);
  };

  const handleSelectOption = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  const handleValidate = () => {
    if (selectedOption === null) return;
    if (selectedOption === questions[currentIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Écran d'accueil & choix de la technologie */}
      {!selectedCategory && (
        <div className="space-y-6">
          
          {/* Section 1 : Saisie d'une technologie sur-mesure */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h2 className="text-base font-bold text-white">Générer un quiz IA sur-mesure</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Entrez n'importe quelle technologie, framework ou concept informatique (ex: Docker, GraphQL, Kubernetes, Rust, Spring Boot...) pour générer un QCM personnalisé.
            </p>
            
            <form onSubmit={handleCustomSubmit} className="flex gap-3 pt-1">
              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Ex: Docker & Containers, Redis, C++..."
                className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!customCategoryInput.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
              >
                <span>Générer</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Section 2 : Domaines suggérés */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Ou choisissez un domaine prédéfini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startQuiz(cat)}
                  className="group relative overflow-hidden bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl text-left transition-all flex items-center justify-between"
                >
                  <div className="space-y-1 z-10">
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400">20 questions aléatoires générées par l'IA</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg`}>
                    <BookOpen className="w-5 h-5 text-slate-950" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <p className="text-sm font-medium text-slate-300">
            L'IA prépare 20 questions sur <span className="text-cyan-400 font-bold">{selectedCategory?.name}</span>...
          </p>
        </div>
      )}

      {/* Écran du Quiz */}
      {selectedCategory && !loading && !isQuizFinished && questions.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{selectedCategory.name}</span>
              <h3 className="text-sm font-semibold text-slate-300">Question {currentIndex + 1} sur {questions.length}</h3>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              Score: {score}
            </span>
          </div>

          <div className="text-base font-semibold text-white leading-relaxed">
            {questions[currentIndex].question}
          </div>

          <div className="space-y-3">
            {questions[currentIndex].options.map((opt, idx) => {
              let btnStyle = "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300";
              
              if (selectedOption === idx) {
                btnStyle = "bg-cyan-500/10 border-cyan-500 text-cyan-300";
              }

              if (showExplanation) {
                if (idx === questions[currentIndex].correctIndex) {
                  btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold";
                } else if (selectedOption === idx) {
                  btnStyle = "bg-rose-500/10 border-rose-500 text-rose-300";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {showExplanation && idx === questions[currentIndex].correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {showExplanation && selectedOption === idx && idx !== questions[currentIndex].correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-cyan-400">
                <HelpCircle className="w-4 h-4" />
                <span>Explication :</span>
              </div>
              <p className="leading-relaxed">{questions[currentIndex].explanation}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!showExplanation ? (
              <button
                onClick={handleValidate}
                disabled={selectedOption === null}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Valider la réponse
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition-all"
              >
                <span>{currentIndex + 1 === questions.length ? "Voir le bilan" : "Question suivante"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Écran Bilan du Quiz */}
      {isQuizFinished && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Quiz Terminé !</h3>
            <p className="text-sm text-slate-400">
              Résultat sur <span className="text-cyan-400 font-bold">{selectedCategory?.name}</span> : <span className="text-cyan-400 font-bold">{score}</span> / <span className="text-white font-bold">{questions.length}</span> bonnes réponses.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => startQuiz(selectedCategory)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCustomCategoryInput('');
              }}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
            >
              Changer de domaine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}