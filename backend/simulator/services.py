import google.generativeai as genai
import os
import json

def get_ai_response(session, user_message=None):
    """
    Génère la réponse de l'IA recruteur ou l'évaluation finale.
    """
    # Récupération de la clé API (soit celle du profil candidat, soit celle du système)
    profile = getattr(session.user, 'profile', None)
    api_key = profile.api_key if profile and profile.api_key else os.getenv("GEMINI_API_KEY")

    if not api_key:
        return "Erreur : Aucune clé API Gemini n'a été configurée."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Historique de la conversation
    messages_history = session.messages.order_by('timestamp')
    context = f"Tu es un recruteur professionnel qui fait passer un entretien pour le poste de : {session.job_title}.\n"
    context += f"Description du poste : {session.job_description}\n\n"
    
    if profile and profile.cv_text:
        context += f"Voici le CV du candidat : {profile.cv_text}\n\n"

    context += "Règles : Sois concis, pose UNE SEULE question claire à la fois, et adapte-toi aux réponses du candidat.\n\n"

    prompt = context
    for msg in messages_history:
        role = "Recruteur" if msg.sender == 'RECRUITER' else "Candidat"
        prompt += f"{role}: {msg.content}\n"

    if user_message:
        prompt += f"Candidat: {user_message}\nRecruteur:"

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Erreur lors de la génération de la réponse IA : {str(e)}"