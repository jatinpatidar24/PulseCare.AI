import numpy as np
import re
from sklearn.ensemble import RandomForestClassifier
from .dataset import (
    SYMPTOMS_LIST,
    DISEASE_METADATA,
    DISEASE_SYMPTOMS_TRAINING,
    SYMPTOM_SYNONYMS,
    SYMPTOM_CATEGORIES
)

class DiseasePredictionEngine:
    def __init__(self):
        self.symptoms = sorted(SYMPTOMS_LIST)
        self.symptom_to_idx = {symptom: i for i, symptom in enumerate(self.symptoms)}
        self.diseases = sorted(list(DISEASE_SYMPTOMS_TRAINING.keys()))
        self.disease_to_idx = {d: i for i, d in enumerate(self.diseases)}
        self.idx_to_disease = {i: d for i, d in enumerate(self.diseases)}
        self.model = None
        self._train_model()

    def _train_model(self):
        """Train Random Forest classifier on augmented symptom combinations"""
        X = []
        y = []

        np.random.seed(42)

        for disease, core_symptoms in DISEASE_SYMPTOMS_TRAINING.items():
            disease_idx = self.disease_to_idx[disease]
            
            # Base full profile
            vector = np.zeros(len(self.symptoms), dtype=int)
            for s in core_symptoms:
                if s in self.symptom_to_idx:
                    vector[self.symptom_to_idx[s]] = 1
            X.append(vector)
            y.append(disease_idx)

            # Generate variations (subsets of symptoms mimicking real-world presentations)
            num_variations = 40
            for _ in range(num_variations):
                # Pick a random subset of at least 2 or all core symptoms
                k = np.random.randint(max(2, len(core_symptoms) - 2), len(core_symptoms) + 1)
                selected = np.random.choice(core_symptoms, size=min(k, len(core_symptoms)), replace=False)
                
                var_vector = np.zeros(len(self.symptoms), dtype=int)
                for s in selected:
                    if s in self.symptom_to_idx:
                        var_vector[self.symptom_to_idx[s]] = 1
                
                # Small probability of 1 random mild unrelated noise symptom
                if np.random.rand() < 0.15:
                    random_symptom = np.random.choice(self.symptoms)
                    var_vector[self.symptom_to_idx[random_symptom]] = 1

                X.append(var_vector)
                y.append(disease_idx)

        X = np.array(X)
        y = np.array(y)

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)

    def extract_symptoms_from_text(self, text: str) -> list[str]:
        """Extract medical symptoms from raw natural language text using synonym mapping and n-grams"""
        text_lower = text.lower()
        cleaned_text = re.sub(r'[^a-z0-9\s]', ' ', text_lower)
        found_symptoms = set()

        # Check multi-word and single-word synonyms
        for phrase, mapped_symptoms in SYMPTOM_SYNONYMS.items():
            pattern = r'\b' + re.escape(phrase) + r'\b'
            if re.search(pattern, cleaned_text):
                for s in mapped_symptoms:
                    if s in self.symptom_to_idx:
                        found_symptoms.add(s)

        # Also check direct symptom tokens (with underscores replaced by spaces)
        for symptom in self.symptoms:
            spaced = symptom.replace('_', ' ')
            pattern = r'\b' + re.escape(spaced) + r'\b'
            if re.search(pattern, cleaned_text):
                found_symptoms.add(symptom)

        return sorted(list(found_symptoms))

    def predict(self, user_symptoms: list[str], top_k: int = 3):
        """Predict disease probabilities based on reported symptoms"""
        if not user_symptoms:
            return {
                "error": "No symptoms provided",
                "predictions": []
            }

        valid_symptoms = [s for s in user_symptoms if s in self.symptom_to_idx]
        if not valid_symptoms:
            return {
                "error": "None of the provided symptoms were recognized in the medical database",
                "predictions": []
            }

        vector = np.zeros(len(self.symptoms), dtype=int)
        for s in valid_symptoms:
            vector[self.symptom_to_idx[s]] = 1

        probs = self.model.predict_proba([vector])[0]
        top_indices = np.argsort(probs)[::-1][:top_k]

        results = []
        for idx in top_indices:
            confidence = float(probs[idx])
            if confidence > 0.02:  # Only return predictions with reasonable likelihood
                disease_name = self.idx_to_disease[idx]
                meta = DISEASE_METADATA.get(disease_name, {
                    "specialization": "General Physician",
                    "severity": "Moderate",
                    "description": "Consult a healthcare provider for comprehensive evaluation.",
                    "precautions": ["Rest", "Hydrate", "Seek medical evaluation"]
                })
                
                results.append({
                    "disease": disease_name,
                    "confidence_percentage": round(confidence * 100, 1),
                    "specialization": meta["specialization"],
                    "severity": meta["severity"],
                    "description": meta["description"],
                    "precautions": meta["precautions"]
                })

        # If probability is evenly split or lower confidence, ensure at least 1 primary result
        if not results and len(top_indices) > 0:
            primary_idx = top_indices[0]
            disease_name = self.idx_to_disease[primary_idx]
            meta = DISEASE_METADATA.get(disease_name, {
                "specialization": "General Physician",
                "severity": "Moderate",
                "description": "Consult a healthcare provider for comprehensive evaluation.",
                "precautions": ["Rest", "Hydrate"]
            })
            results.append({
                "disease": disease_name,
                "confidence_percentage": 50.0,
                "specialization": meta["specialization"],
                "severity": meta["severity"],
                "description": meta["description"],
                "precautions": meta["precautions"]
            })

        primary = results[0] if results else None

        return {
            "matched_symptoms": valid_symptoms,
            "primary_prediction": primary,
            "all_predictions": results,
            "recommended_specialty": primary["specialization"] if primary else "General Physician"
        }

# Singleton instance
prediction_engine = DiseasePredictionEngine()
