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



def build_system_prompt(session):
    """Construit le prompt système pour l'IA en intégrant le CV et l'offre d'emploi"""
    profile = getattr(session.user, 'profile', None)
    cv_text = profile.cv_text if profile and profile.cv_text else "Aucun CV fourni."

    return f"""
Tu es un recruteur technique expert qui mène un entretien d'embauche.

--- CONTEXTE DE L'OFFRE D'EMPLOI ---
Intitulé du poste : {session.job_title}
Fiche de poste : {session.job_description}

--- RENSEIGNEMENTS SUR LE CANDIDAT (CV) ---
{cv_text}

--- INSTRUCTIONS DE COMPORTEMENT ---
1. Analyse la cohérence entre le CV du candidat et les exigences de l'offre d'emploi.
2. Pose des questions techniques précises, réalistes et adaptées au niveau demandé.
3. Ne pose qu'UNE SEULE question à la fois.
4. Reste professionnel, constructif et immersif dans ton rôle de recruteur.
"""


def get_ai_response(session, user_message=None):
    """Génère la réponse de l'IA (Simulé ou via appel Ollama/Gemini)"""
    system_prompt = build_system_prompt(session)
    
    # Si vous utilisez Ollama / OpenRouter / LangChain, insérez l'appel d'API ici.
    # Pour l'instant, voici une logique de base :
    
    if not user_message:
        return f"Bonjour ! Ravi de vous rencontrer pour ce poste de {session.job_title}. Pour commencer, pouvez-vous vous présenter brièvement en lien avec cette offre ?"
    
    # Exemple de réponse générique (à remplacer par votre appel LLM)
    return f"Merci pour votre réponse. Au vu de votre expérience et des exigences du poste de {session.job_title}, pouvez-vous me détailler un projet technique similaire que vous avez mené ?"