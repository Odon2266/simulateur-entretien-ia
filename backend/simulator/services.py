from ollama import Client

def get_ai_response(session, user_message=None):
    # 1. Récupération de la clé API propre à l'utilisateur
    profile = getattr(session.user, 'profile', None)
    user_api_key = profile.api_key if profile else None

    if not user_api_key:
        return "Erreur : Aucune clé API Ollama n'est configurée pour votre compte. Veuillez renseigner votre clé dans vos paramètres."

    # 2. Instanciation du client Ollama Cloud
    client = Client(
        host='https://ollama.com',
        headers={'Authorization': f"Bearer {user_api_key}"}
    )

    # 3. Construction du prompt système et de l'historique
    messages = [
        {
            'role': 'system',
            'content': (
                f"Tu es un recruteur professionnel qui fait passer un entretien d'embauche pour le poste de : {session.job_title}. "
                f"Description du poste : {session.job_description}. "
                "Sois concis, pose une seule question à la fois, et réagis directement aux réponses du candidat de manière réaliste."
            )
        }
    ]

    # Récupération de tous les messages déjà enregistrés dans la session (y compris le dernier)
    for msg in session.messages.order_by('timestamp'):
        role = 'user' if msg.sender == 'CANDIDATE' else 'assistant'
        messages.append({'role': role, 'content': msg.content})

    try:
        response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
        return response['message']['content'].strip()
    except Exception as e:
        return f"Erreur lors de la communication avec Ollama : {str(e)}"