import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';

export default function SimulationChat({ sessionData, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('access_token');

  // Défiler automatiquement vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Charger l'historique des messages de la session si existant
  useEffect(() => {
    const fetchSessionMessages = async () => {
      if (!sessionData?.id) return;

      if (sessionData.messages && Array.isArray(sessionData.messages) && sessionData.messages.length > 0) {
        setMessages(sessionData.messages);
        return;
      }

      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/sessions/${sessionData.id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        
        if (res.data && res.data.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
      }
    };

    fetchSessionMessages();
  }, [sessionData]);

  // Fonction pour envoyer un message au backend Django
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    
    // Affichage immédiat du message dans le chat
    setMessages((prev) => [...prev, { sender: 'CANDIDATE', content: userText }]);
    setLoading(true);

    try {
      const token = getToken();
      
      const res = await axios.post(
        `${API_BASE_URL}/sessions/${sessionData.id}/send_message/`,
        { content: userText },
        { 
          headers: { 
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Le backend renvoie { candidate_message: {...}, ai_message: {...} } ou { content: "..." }
      if (res.data) {
        if (res.data.ai_message) {
          setMessages((prev) => [...prev, res.data.ai_message]);
        } else if (res.data.content) {
          setMessages((prev) => [...prev, { sender: 'RECRUITER', content: res.data.content }]);
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'RECRUITER', 
          content: "Désolé, une erreur s'est produite lors de la communication avec le serveur backend." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden mt-2">
      
      {/* En-tête du Chat */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
            title="Retour au tableau de bord"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white">Entretien : {sessionData?.job_title || 'Poste non défini'}</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-emerald-400 font-mono">Recruteur IA connecté</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone d'affichage des messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 && !loading && (
          <div className="text-center text-slate-500 text-sm mt-10">
            Envoyez votre premier message pour lancer la séance d'entretien.
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'CANDIDATE' || msg.sender === 'USER';
          return (
            <div
              key={idx}
              className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 border border-slate-700 text-cyan-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Bulle de message */}
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                isUser
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 rounded-tr-none'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Indicateur de chargement IA */}
        {loading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
               <Bot className="w-4 h-4" />
             </div>
             <div className="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-xs text-slate-400 font-mono">Le recruteur analyse votre réponse...</span>
             </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire de saisie */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre réponse ici..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}