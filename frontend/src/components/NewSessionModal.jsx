import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, Loader2, X, Briefcase } from 'lucide-react';

export default function NewSessionModal({ isOpen, onClose, onSuccess }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getToken = () => localStorage.getItem('authToken');

  // 1. Sélection et vérification du fichier PDF
  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else if (file) {
      alert('Veuillez sélectionner un fichier au format PDF.');
    }
  };

  // 2. Envoi des données (CV + Offre d'emploi) au Backend Django
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert("Veuillez remplir l'intitulé et la description de l'offre d'emploi.");
      return;
    }

    setLoading(true);
    const token = getToken();

    try {
      // Étape A : Si un fichier CV est sélectionné, on le téléverse vers l'endpoint /api/profiles/upload_cv/
      if (cvFile) {
        const formData = new FormData();
        formData.append('cv_file', cvFile);

        await axios.post('http://localhost:8000/api/profiles/upload_cv/', formData, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Étape B : Création de la session d'entretien
      const sessionRes = await axios.post(
        'http://localhost:8000/api/sessions/',
        {
          job_title: jobTitle,
          job_description: jobDescription,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setLoading(false);
      onSuccess(sessionRes.data);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création de la session :", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Titre */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" /> Nouvelle Simulation d'Entretien
          </h3>
          <p className="text-xs text-slate-400">Ajoutez le poste visé et votre CV pour générer des questions sur-mesure.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section CV */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Votre CV (PDF)</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-colors bg-slate-950/50 flex flex-col items-center justify-center text-center cursor-pointer relative">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleCvChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {cvFile ? (
                <div className="flex items-center gap-2 text-cyan-400 font-medium text-xs">
                  <FileText className="w-5 h-5" />
                  <span className="truncate max-w-[200px]">{cvFile.name}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400 ml-1" />
                </div>
              ) : (
                <div className="space-y-1 text-slate-400">
                  <Upload className="w-6 h-6 mx-auto text-slate-500" />
                  <p className="text-xs">Glissez votre CV ici ou <span className="text-cyan-400 underline">parcourez</span></p>
                  <p className="text-[10px] text-slate-600">Format PDF uniquement</p>
                </div>
              )}
            </div>
          </div>

          {/* Intitulé du poste */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Intitulé du poste *</label>
            <input
              type="text"
              required
              placeholder="ex: Développeur Web Fullstack"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Description de l'offre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Fiche de poste / Offre d'emploi *</label>
            <textarea
              rows={4}
              required
              placeholder="Collez l'offre d'emploi ici (stack technique, responsabilités...)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Bouton de confirmation */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyse du CV et création de la session...</span>
              </>
            ) : (
              <span>Lancer la simulation</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}