import json
import random
from ollama import Client


def _get_ollama_client(user):
    """Fonction utilitaire pour récupérer la clé API et instancier le client Ollama Cloud."""
    profile = getattr(user, 'profile', None)
    user_api_key = profile.api_key if profile else None

    if not user_api_key:
        raise ValueError("Aucune clé API Ollama n'est configurée pour votre compte.")

    return Client(
        host='https://ollama.com',
        headers={'Authorization': f"Bearer {user_api_key}"}
    )


def _clean_json_response(raw_response):
    """Fonction utilitaire pour nettoyer et parser les réponses JSON renvoyées par l'IA."""
    if isinstance(raw_response, dict):
        raw_text = raw_response['message']['content'].strip()
    elif hasattr(raw_response, 'message'):
        raw_text = raw_response.message.content.strip()
    else:
        raw_text = str(raw_response)

    cleaned_text = raw_text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text[7:]
    if cleaned_text.startswith("```"):
        cleaned_text = cleaned_text[3:]
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text[:-3]

    return json.loads(cleaned_text.strip())


# ==========================================
# SIMULATION D'ENTRETIEN (SIMULATION CHAT)
# ==========================================

def build_system_prompt(session):
    """Construit le prompt système pour l'IA en intégrant le CV et l'offre d'emploi."""
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
    """Génère la réponse de l'IA pour la simulation d'entretien."""
    try:
        client = _get_ollama_client(session.user)
    except ValueError as e:
        return f"Erreur : {str(e)}"

    system_prompt = build_system_prompt(session)
    messages = [
        {'role': 'system', 'content': system_prompt}
    ]

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


# ==========================================
# MODULE QCM & QUIZ IA
# ==========================================

def generate_quiz_with_ai(user, category='react', count=20):
    """Génère un QCM technique dynamique de questions à choix multiples via Ollama."""
    client = _get_ollama_client(user)
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
    return _clean_json_response(response)


# ==========================================
# MODULE SYSTEM DESIGN
# ==========================================

def evaluate_system_design_with_ai(user, scenario_title, database_choice, cache_strategy, messaging_strategy, architecture_details):
    """Évalue une proposition d'architecture système (System Design) via Ollama."""
    client = _get_ollama_client(user)

    prompt = f"""
En tant qu'Architecte Système Senior / Lead Tech, évalue la proposition d'architecture suivante.

--- ÉTUDE DE CAS ---
Sujet : {scenario_title}
Choix Base de données : {database_choice}
Stratégie de Cache : {cache_strategy}
Communication / Message Broker : {messaging_strategy}
Détails de l'architecture proposée : {architecture_details}

Réponds EXCLUSIVEMENT sous la forme d'un objet JSON valide (JSON pur), sans blocs markdown ni texte superflu :
{{
  "score": 85,
  "strengths": [
    "Point fort 1",
    "Point fort 2"
  ],
  "weaknesses": [
    "Point faible ou SPOF 1",
    "Point faible ou SPOF 2"
  ],
  "scalability_notes": "Analyse de la montée en charge et résilience.",
  "recommendations": "Recommandations précises pour améliorer l'architecture."
}}
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un expert en System Design et architecture distribuée. Réponds uniquement en JSON pur sans texte additionnel.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
    return _clean_json_response(response)


# ==========================================
# MODULE REVUE DE CODE & DÉBOGAGE
# ==========================================

def generate_code_review_with_ai(user, language='python'):
    """Génère un extrait de code contenant un bug ou une faille de sécurité."""
    client = _get_ollama_client(user)
    random_seed = random.randint(1000, 9999)

    prompt = f"""
Génère un extrait de code réaliste en langage '{language}' (entre 8 et 15 lignes) contenant un bug, une faille de sécurité (ex: SQLi, Memory Leak, XSS, mauvaise gestion d'état) ou un problème de performance.
Graine de variabilité : {random_seed}.

Réponds EXCLUSIVEMENT sous la forme d'un objet JSON valide (JSON pur), sans blocs markdown ni texte superflu :
{{
  "title": "Intitulé concis du problème",
  "language": "{language}",
  "code": "code source ici"
}}
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un générateur d\'exercices de revue de code. Réponds uniquement en JSON pur.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
    return _clean_json_response(response)


def evaluate_code_review_with_ai(user, code_snippet, candidate_analysis):
    """Évalue l'analyse et les corrections de code soumises par le candidat."""
    client = _get_ollama_client(user)

    prompt = f"""
En tant qu'Architecte Logiciel Senior, évalue l'analyse et la correction du code suivant par le candidat.

--- EXTRAIT DE CODE SOUMIS ---
{code_snippet}

--- ANALYSE / CORRECTION DU CANDIDAT ---
{candidate_analysis}

Réponds EXCLUSIVEMENT sous la forme d'un objet JSON valide (JSON pur), sans blocs markdown ni texte superflu :
{{
  "score": 90,
  "identified_bugs": ["Bug 1", "Bug 2"],
  "code_quality_feedback": "Commentaire sur la propreté du code.",
  "security_notes": "Remarques sur les failles potentielles.",
  "improved_code": "Code corrigé si nécessaire"
}}
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un expert en code review et en sécurité logicielle. Réponds uniquement en JSON pur sans texte additionnel.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
    return _clean_json_response(response)


# ==========================================
# MODULE ALGORITHMIQUE & COMPLEXITÉ
# ==========================================

def generate_algo_problem_with_ai(user, topic='Structures de données', difficulty='moyen'):
    """Génère un problème d'algorithme avec contraintes de complexité."""
    client = _get_ollama_client(user)
    random_seed = random.randint(1000, 9999)

    prompt = f"""
Génère un défi algorithmique inédit.
Thème : {topic}
Niveau : {difficulty}
Graine de variabilité : {random_seed}

Réponds EXCLUSIVEMENT sous la forme d'un objet JSON valide (JSON pur), sans blocs markdown ni texte superflu :
{{
  "title": "Titre du problème",
  "description": "Énoncé détaillé du problème avec les entrées/sorties attendues et exemples.",
  "initial_code": "def solution(...):\n    # Votre code ici\n    pass",
  "expected_time_complexity": "O(n)",
  "expected_space_complexity": "O(1)"
}}
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un concepteur d\'épreuves techniques en algorithmique. Réponds uniquement en JSON pur.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
    return _clean_json_response(response)


def evaluate_algo_complexity_with_ai(user, problem_statement, candidate_code, time_complexity_claim, space_complexity_claim):
    """Évalue la solution algorithmique du candidat et son analyse de complexité Big-O."""
    client = _get_ollama_client(user)

    prompt = f"""
En tant qu'expert en algorithmique et structures de données, évalue la réponse et l'analyse du candidat.

--- ÉNONCÉ DU PROBLÈME ---
{problem_statement}

--- CODE SOUMIS PAR LE CANDIDAT ---
{candidate_code}

--- COMPLEXITÉS AFFIRMÉES PAR LE CANDIDAT ---
Complexité Temporelle estimée : {time_complexity_claim}
Complexité Spatiale estimée : {space_complexity_claim}

Réponds EXCLUSIVEMENT sous la forme d'un objet JSON valide (JSON pur), sans blocs markdown ni texte superflu :
{{
  "score": 85,
  "correctness": "Analyse de la justesse et validité du code...",
  "actual_time_complexity": "O(n)",
  "actual_space_complexity": "O(1)",
  "complexity_analysis": "Évaluation des complexités temporelle et spatiale affirmées par le candidat par rapport à la réalité du code.",
  "optimizations": ["Conseil d'optimisation 1", "Conseil d'optimisation 2"]
}}
"""

    messages = [
        {'role': 'system', 'content': 'Tu es un expert en analyse d\'algorithmes et complexité Big-O. Réponds uniquement en JSON pur.'},
        {'role': 'user', 'content': prompt}
    ]

    response = client.chat(model='gpt-oss:120b-cloud', messages=messages)
    return _clean_json_response(response)