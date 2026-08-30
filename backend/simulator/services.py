import json
from ollama import Client
import random

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
    """Génère la réponse de l'IA pour la simulation d'entretien"""
    # 1. Récupération de la clé API propre à l'utilisateur
    profile = getattr(session.user, 'profile', None)
    user_api_key = profile.api_key if profile else None

    if not user_api_key:
        return "Erreur : Aucune clé API Ollama n'est configurée pour votre compte. Veuillez renseigner votre clé dans l'en-tête de l'application."

    # 2. Instanciation du client Ollama Cloud
    client = Client(
        host='https://ollama.com',
        headers={'Authorization': f"Bearer {user_api_key}"}
    )

    # 3. Construction du prompt système enrichi avec le CV
    system_prompt = build_system_prompt(session)
    messages = [
        {'role': 'system', 'content': system_prompt}
    ]

    # 4. Historique de la conversation
    for msg in session.messages.order_by('timestamp'):
        role = 'user' if msg.sender == 'CANDIDATE' else 'assistant'
        messages.append({'role': role, 'content': msg.content})

    try:
        response = client.chat(model='gpt-oss:120b-cloud', messages=messages)

        if isinstance(response, dict):
            return response['message']['content'].strip()
        elif hasattr(response, 'message'):
            return response.message.content.strip()
        return str(response)

    except Exception as e:
        return f"Erreur lors de la communication avec Ollama : {str(e)}"

def generate_quiz_with_ai(user, category='react', count=20):
    """Génère un QCM technique dynamique de questions à choix multiples via Ollama"""
    profile = getattr(user, 'profile', None)
    user_api_key = profile.api_key if profile else None

    if not user_api_key:
        raise ValueError("Aucune clé API Ollama n'est configurée pour votre compte.")

    client = Client(
        host='https://ollama.com',
        headers={'Authorization': f"Bearer {user_api_key}"}
    )

    # Ajout d'une graine d'aléatoire pour forcer la diversité
    random_seed = random.randint(1000, 9999)

    prompt = f"""
Génère une série aléatoire de {count} questions techniques à choix multiples sur le thème : '{category}'.
Graine de variabilité : {random_seed}. Diversifie les sujets (du niveau débutant à avancé).

Réponds EXCLUSIVEMENT sous la forme d'un tableau JSON valide (JSON pur), sans markdown :
[
  {{
    "id": 1,
    "question": "Intitulé de la question en français ?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0,
    "explanation": "Explication courte en français."
  }}
]
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un générateur de QCM techniques. Réponds uniquement en JSON pur sans texte additionnel.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)

    if isinstance(response, dict):
        raw_text = response['message']['content'].strip()
    elif hasattr(response, 'message'):
        raw_text = response.message.content.strip()
    else:
        raw_text = str(response)

    cleaned_text = raw_text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text[7:]
    if cleaned_text.startswith("```"):
        cleaned_text = cleaned_text[3:]
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text[:-3]

    return json.loads(cleaned_text.strip())