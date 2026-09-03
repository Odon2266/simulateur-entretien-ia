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
  Send,
  ArrowLeft
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
          explanation: "Veuillez vérifier votre connexion à l'API backend."
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

  const handleResetToCategories = () => {
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsQuizFinished(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header d'entraînement avec gestion du Retour */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          {selectedCategory ? (
            <button
              onClick={handleResetToCategories}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Choix des catégories</span>
            </button>
          ) : onBack ? (
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          ) : null}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Entraînement & QCM</h2>
            <p className="text-xs text-slate-400">Testez et validez vos compétences techniques.</p>
          </div>
        </div>
      </div>

      {/* Écran d'accueil & choix de la technologie */}
      {!selectedCategory && (
        <div className="space-y-6">
          
          {/* Section 1 : Saisie d'une technologie sur-mesure */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-4 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-white">Générer un quiz IA sur-mesure</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Entrez n'importe quelle technologie ou concept informatique (ex: Docker, GraphQL, Kubernetes, Rust, Spring Boot...) pour générer un QCM personnalisé.
            </p>
            
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3 pt-1">
              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Ex: Docker & Containers, Redis, C++..."
                className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!customCategoryInput.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
              >
                <span>Générer</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Section 2 : Domaines suggérés */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ou choisissez un domaine prédéfini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startQuiz(cat)}
                  className="group relative overflow-hidden bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 sm:p-5 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-1 z-10 min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors truncate">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400">20 questions aléatoires générées par l'IA</p>
                  </div>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg`}>
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3 bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-cyan-400" />
          <p className="text-xs sm:text-sm font-medium text-slate-300 text-center">
            L'IA prépare les questions sur <span className="text-cyan-400 font-bold">{selectedCategory?.name}</span>...
          </p>
        </div>
      )}

      {/* Écran du Quiz */}
      {selectedCategory && !loading && !isQuizFinished && questions.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Entête du Quiz & Barre de progression */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-wider block truncate">{selectedCategory.name}</span>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-300">Question {currentIndex + 1} sur {questions.length}</h3>
              </div>
              <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 shrink-0">
                Score: <strong className="text-cyan-400">{score}</strong>
              </span>
            </div>

            {/* Barre de progression visuelle */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Intitulé de la question */}
          <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
            {questions[currentIndex].question}
          </div>

          {/* Options de réponse */}
          <div className="space-y-2.5">
            {questions[currentIndex].options.map((opt, idx) => {
              let btnStyle = "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300";
              
              if (selectedOption === idx) {
                btnStyle = "bg-cyan-500/10 border-cyan-500 text-cyan-300 font-medium";
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
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-normal">{opt}</span>
                  {showExplanation && idx === questions[currentIndex].correctIndex && (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  )}
                  {showExplanation && selectedOption === idx && idx !== questions[currentIndex].correctIndex && (
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explication de la réponse */}
          {showExplanation && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-400">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Explication :</span>
              </div>
              <p className="leading-relaxed text-slate-300">{questions[currentIndex].explanation}</p>
            </div>
          )}

          {/* Actions : Valider / Question suivante */}
          <div className="flex justify-end pt-2">
            {!showExplanation ? (
              <button
                onClick={handleValidate}
                disabled={selectedOption === null}
                className="w-full sm:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Valider la réponse
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer"
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">Quiz Terminé !</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Résultat sur <span className="text-cyan-400 font-bold">{selectedCategory?.name}</span> : <span className="text-cyan-400 font-bold">{score}</span> / <span className="text-white font-bold">{questions.length}</span> bonnes réponses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => startQuiz(selectedCategory)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>
            <button
              onClick={handleResetToCategories}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Changer de domaine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}