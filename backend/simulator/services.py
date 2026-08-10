import os
from ollama import Client

def get_ai_response(session, user_message=None):
    """
    Génère la réponse de l'IA recruteur via Ollama Cloud.
    """
    api_key = os.getenv("OLLAMA_API_KEY")

    if not api_key:
        return "Erreur : Aucune clé API Ollama n'a été configurée."

    # Initialisation du client pointant vers le cloud d'Ollama
    client = Client(
        host='https://ollama.com',
        headers={'Authorization': f"Bearer {api_key}"}
    )

    # Construction du contexte système
    profile = getattr(session.user, 'profile', None)
    context = f"Tu es un recruteur professionnel qui fait passer un entretien pour le poste de : {session.job_title}.\n"
    context += f"Description du poste : {session.job_description}\n\n"
    
    if profile and profile.cv_text:
        context += f"Voici le CV du candidat : {profile.cv_text}\n\n"

    context += "Règles : Sois concis, pose UNE SEULE question claire à la fois, et adapte-toi aux réponses du candidat.\n\n"

    # Construction de l'historique des messages
    messages = [{'role': 'system', 'content': context}]
    messages_history = session.messages.order_by('timestamp')
    
    for msg in messages_history:
        role = "assistant" if msg.sender == 'RECRUITER' else "user"
        messages.append({'role': role, 'content': msg.content})

    if user_message and not messages_history.filter(content=user_message).exists():
        messages.append({'role': 'user', 'content': user_message})

    try:
        # Appel d'un modèle cloud d'Ollama (par exemple gpt-oss:120b-cloud ou un autre modèle disponible)
        response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
        return response['message']['content'].strip()
    except Exception as e:
        return f"Erreur lors de la génération de la réponse IA : {str(e)}"