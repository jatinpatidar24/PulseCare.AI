"""
Comprehensive disease and symptoms dataset, synonym dictionaries,
disease metadata (precautions, descriptions, severity, recommended specialization).
"""

SYMPTOMS_LIST = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering",
    "chills", "joint_pain", "stomach_pain", "acidity", "ulcers_on_tongue",
    "muscle_wasting", "vomiting", "burning_micturition", "spotting_urination", "fatigue",
    "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings", "weight_loss",
    "restlessness", "lethargy", "patches_in_throat", "irregular_sugar_level", "cough",
    "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration",
    "indigestion", "headache", "yellowish_skin", "dark_urine", "nausea",
    "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
    "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes", "acute_liver_failure",
    "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision",
    "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose",
    "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements",
    "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness",
    "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels",
    "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "excessive_hunger",
    "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", "knee_pain", "hip_joint_pain",
    "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements",
    "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell", "bladder_discomfort",
    "foul_smell_of_urine", "continuous_feel_of_urine", "passage_of_gases", "internal_itching", "toxic_look_(typhos)",
    "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body",
    "belly_pain", "abnormal_menstruation", "dischromic_patches", "watering_from_eyes", "increased_appetite",
    "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration",
    "visual_disturbances", "receiving_blood_transfusion", "receiving_unsterile_injections", "coma", "stomach_bleeding",
    "distention_of_abdomen", "history_of_alcohol_consumption", "blood_in_sputum", "prominent_veins_on_calf", "palpitations",
    "painful_walking", "pus_filled_pimples", "blackheads", "scurring", "skin_peeling",
    "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails", "blister", "red_sore_around_nose",
    "yellow_crust_ooze"
]

# Categorized symptoms for user-friendly UI selection
SYMPTOM_CATEGORIES = {
    "General & Systemic": [
        "fatigue", "high_fever", "mild_fever", "chills", "sweating", "shivering",
        "malaise", "weight_loss", "weight_gain", "lethargy", "restlessness", "toxic_look_(typhos)"
    ],
    "Head, ENT & Eyes": [
        "headache", "dizziness", "loss_of_balance", "blurred_and_distorted_vision", "redness_of_eyes",
        "watering_from_eyes", "pain_behind_the_eyes", "sinus_pressure", "runny_nose", "congestion",
        "throat_irritation", "patches_in_throat", "loss_of_smell", "continuous_sneezing", "visual_disturbances"
    ],
    "Chest & Cardiopulmonary": [
        "chest_pain", "breathlessness", "cough", "phlegm", "fast_heart_rate", "palpitations",
        "blood_in_sputum", "mucoid_sputum", "rusty_sputum"
    ],
    "Abdominal & Digestive": [
        "abdominal_pain", "stomach_pain", "belly_pain", "acidity", "indigestion", "vomiting", "nausea",
        "diarrhoea", "constipation", "loss_of_appetite", "excessive_hunger", "increased_appetite",
        "swelling_of_stomach", "distention_of_abdomen", "passage_of_gases", "stomach_bleeding"
    ],
    "Musculoskeletal & Joints": [
        "joint_pain", "back_pain", "neck_pain", "knee_pain", "hip_joint_pain", "muscle_pain",
        "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "painful_walking",
        "cramps", "weakness_in_limbs"
    ],
    "Skin & Nails": [
        "itching", "skin_rash", "nodal_skin_eruptions", "yellowish_skin", "red_spots_over_body",
        "pus_filled_pimples", "blackheads", "skin_peeling", "blister", "silver_like_dusting",
        "small_dents_in_nails", "inflammatory_nails", "yellow_crust_ooze", "dischromic_patches"
    ],
    "Urinary & Renal": [
        "burning_micturition", "spotting_urination", "dark_urine", "yellow_urine", "bladder_discomfort",
        "foul_smell_of_urine", "continuous_feel_of_urine", "polyuria"
    ],
    "Neurological & Psychological": [
        "anxiety", "depression", "irritability", "mood_swings", "lack_of_concentration",
        "slurred_speech", "spinning_movements", "unsteadiness", "altered_sensorium", "coma",
        "weakness_of_one_body_side"
    ]
}

# Conversational Synonyms for Natural Language Extraction
SYMPTOM_SYNONYMS = {
    "fever": ["high_fever", "mild_fever"],
    "high fever": ["high_fever"],
    "low fever": ["mild_fever"],
    "temperature": ["high_fever"],
    "headache": ["headache"],
    "head ache": ["headache"],
    "head hurts": ["headache"],
    "migraine": ["headache"],
    "chest pain": ["chest_pain"],
    "heart pain": ["chest_pain"],
    "angina": ["chest_pain"],
    "short of breath": ["breathlessness"],
    "shortness of breath": ["breathlessness"],
    "breathless": ["breathlessness"],
    "difficulty breathing": ["breathlessness"],
    "hard to breathe": ["breathlessness"],
    "cough": ["cough"],
    "coughing": ["cough"],
    "runny nose": ["runny_nose"],
    "running nose": ["runny_nose"],
    "cold": ["continuous_sneezing", "runny_nose"],
    "sneezing": ["continuous_sneezing"],
    "sneeze": ["continuous_sneezing"],
    "stomach pain": ["abdominal_pain", "stomach_pain"],
    "stomach ache": ["abdominal_pain", "stomach_pain"],
    "belly ache": ["belly_pain"],
    "abdominal cramp": ["abdominal_pain"],
    "vomit": ["vomiting"],
    "vomiting": ["vomiting"],
    "threw up": ["vomiting"],
    "nausea": ["nausea"],
    "queasy": ["nausea"],
    "feeling sick": ["nausea", "malaise"],
    "loose motions": ["diarrhoea"],
    "diarrhea": ["diarrhoea"],
    "diarrhoea": ["diarrhoea"],
    "constipation": ["constipation"],
    "can't poop": ["constipation"],
    "tired": ["fatigue"],
    "tiredness": ["fatigue"],
    "fatigue": ["fatigue"],
    "exhausted": ["fatigue", "lethargy"],
    "weak": ["lethargy", "muscle_weakness"],
    "weakness": ["lethargy"],
    "dizzy": ["dizziness"],
    "dizziness": ["dizziness"],
    "lightheaded": ["dizziness"],
    "vertigo": ["spinning_movements", "loss_of_balance"],
    "joint pain": ["joint_pain"],
    "body ache": ["muscle_pain"],
    "muscle pain": ["muscle_pain"],
    "back pain": ["back_pain"],
    "backache": ["back_pain"],
    "neck pain": ["neck_pain"],
    "stiff neck": ["stiff_neck"],
    "knee pain": ["knee_pain"],
    "skin rash": ["skin_rash"],
    "rash": ["skin_rash"],
    "itch": ["itching"],
    "itching": ["itching"],
    "itchy": ["itching"],
    "pimples": ["pus_filled_pimples", "blackheads"],
    "acne": ["pus_filled_pimples", "blackheads"],
    "yellow skin": ["yellowish_skin", "yellowing_of_eyes"],
    "jaundice": ["yellowish_skin", "yellowing_of_eyes"],
    "dark urine": ["dark_urine"],
    "burning urination": ["burning_micturition"],
    "burn when peeing": ["burning_micturition"],
    "frequent urination": ["polyuria", "continuous_feel_of_urine"],
    "peeing a lot": ["polyuria"],
    "loss of appetite": ["loss_of_appetite"],
    "not hungry": ["loss_of_appetite"],
    "weight loss": ["weight_loss"],
    "lost weight": ["weight_loss"],
    "weight gain": ["weight_gain"],
    "anxiety": ["anxiety"],
    "anxious": ["anxiety"],
    "nervous": ["anxiety"],
    "racing heart": ["palpitations", "fast_heart_rate"],
    "palpitations": ["palpitations"],
    "blurred vision": ["blurred_and_distorted_vision"],
    "can't see clearly": ["blurred_and_distorted_vision"],
    "sore throat": ["throat_irritation", "patches_in_throat"],
    "throat pain": ["throat_irritation"],
    "chills": ["chills", "shivering"],
    "shivering": ["shivering"]
}

# Disease database metadata: descriptions, precautions, severity, and medical specialization
DISEASE_METADATA = {
    "Fungal infection": {
        "specialization": "Dermatologist",
        "severity": "Mild",
        "description": "A common skin condition caused by fungal growth on warm, moist areas of the skin.",
        "precautions": ["Keep affected areas clean and dry", "Use antifungal dusting powder/cream", "Do not share towels or personal items", "Wear loose cotton clothes"]
    },
    "Allergy": {
        "specialization": "General Physician",
        "severity": "Mild to Moderate",
        "description": "An immune system reaction to a foreign substance such as pollen, pet dander, or foods.",
        "precautions": ["Identify and avoid allergen triggers", "Take prescribed antihistamines", "Use air filters indoors", "Seek immediate care if breathing is affected"]
    },
    "GERD": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate",
        "description": "Gastroesophageal reflux disease occurs when stomach acid frequently flows back into the food pipe.",
        "precautions": ["Avoid spicy and greasy foods", "Eat smaller, frequent meals", "Do not lie down immediately after eating", "Elevate head while sleeping"]
    },
    "Chronic cholestasis": {
        "specialization": "Gastroenterologist",
        "severity": "High",
        "description": "Impaired bile flow from the liver leading to jaundice, severe itching, and digestive issues.",
        "precautions": ["Consult a liver specialist promptly", "Avoid alcohol completely", "Follow a low-fat diet", "Take liver supportive medications as prescribed"]
    },
    "Peptic ulcer diseae": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate to High",
        "description": "Painful sores in the lining of the stomach, small intestine, or esophagus.",
        "precautions": ["Avoid NSAID painkillers and aspirin", "Avoid smoking and alcohol", "Consume a bland diet", "Take proton pump inhibitors as recommended"]
    },
    "AIDS": {
        "specialization": "Infectious Disease Specialist",
        "severity": "Critical",
        "description": "Advanced HIV infection that compromises the immune system.",
        "precautions": ["Adhere strictly to antiretroviral therapy (ART)", "Practice safe intimacy", "Avoid exposure to infections", "Regular clinical monitoring"]
    },
    "Diabetes": {
        "specialization": "Endocrinologist",
        "severity": "Moderate to High",
        "description": "A metabolic disorder characterized by elevated blood glucose levels due to insulin deficiency or resistance.",
        "precautions": ["Monitor blood glucose regularly", "Follow a low-glycemic balanced diet", "Engage in daily aerobic exercise", "Take medications or insulin consistently"]
    },
    "Gastroenteritis": {
        "specialization": "General Physician",
        "severity": "Moderate",
        "description": "Inflammation of the digestive tract caused by viral or bacterial infections, causing diarrhea and vomiting.",
        "precautions": ["Drink oral rehydration solutions (ORS)", "Eat light foods (bananas, rice, applesauce, toast)", "Avoid dairy and fatty foods", "Wash hands thoroughly"]
    },
    "Bronchial Asthma": {
        "specialization": "Pulmonologist",
        "severity": "Moderate to Critical",
        "description": "Chronic inflammatory condition causing airways to narrow, swell, and produce extra mucus.",
        "precautions": ["Keep rescue inhaler readily accessible", "Avoid dust, cold air, and pet dander", "Track peak flow readings", "Take preventive inhalers regularly"]
    },
    "Hypertension": {
        "specialization": "Cardiologist",
        "severity": "Moderate to High",
        "description": "Persistently high blood pressure against artery walls, increasing heart attack and stroke risk.",
        "precautions": ["Reduce dietary sodium (salt)", "Exercise 30 mins daily", "Manage stress through relaxation", "Take antihypertensive medicines regularly"]
    },
    "Migraine": {
        "specialization": "Neurologist",
        "severity": "Moderate",
        "description": "Intense, throbbing headache often accompanied by sensitivity to light, sound, and nausea.",
        "precautions": ["Rest in a dark and quiet room", "Stay adequately hydrated", "Avoid known migraine triggers (aged cheese, caffeine crashes)", "Take prescribed acute migraine relief"]
    },
    "Cervical spondylosis": {
        "specialization": "Orthopedic",
        "severity": "Moderate",
        "description": "Age-related wear and tear affecting the spinal disks in the neck.",
        "precautions": ["Maintain ergonomic posture during desk work", "Perform neck stretching and strengthening exercises", "Use a supportive cervical pillow", "Avoid heavy lifting"]
    },
    "Paralysis (brain hemorrhage)": {
        "specialization": "Neurologist",
        "severity": "Emergency",
        "description": "Loss of muscle function due to bleeding in the brain; requires emergency medical care.",
        "precautions": ["Call emergency medical services immediately", "Do not give food or drink", "Keep patient lying flat on side", "Immediate neurological intervention"]
    },
    "Jaundice": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate to High",
        "description": "Yellowing of the skin and eyes caused by elevated bilirubin levels in blood from liver or gallbladder dysfunction.",
        "precautions": ["Drink plenty of boiled water", "Avoid oily, fried, and junk foods", "Eat fresh fruits and sugarcane juice", "Get complete liver function tests"]
    },
    "Malaria": {
        "specialization": "General Physician",
        "severity": "High",
        "description": "A mosquito-borne infectious disease causing recurring high fever, chills, and sweats.",
        "precautions": ["Complete full antimalarial drug course", "Use mosquito repellents and bed nets", "Keep surroundings free of stagnant water", "Stay well hydrated"]
    },
    "Chicken pox": {
        "specialization": "Dermatologist",
        "severity": "Moderate",
        "description": "A highly contagious viral infection characterized by itchy, blister-like skin rashes.",
        "precautions": ["Isolate until all blisters have crusted", "Apply calamine lotion to soothe itching", "Avoid scratching to prevent scarring", "Take cool baths with baking soda"]
    },
    "Dengue": {
        "specialization": "General Physician",
        "severity": "High",
        "description": "Mosquito-borne viral disease with severe headache, retro-orbital pain, joint pain, and dropping platelet count.",
        "precautions": ["Monitor platelet counts daily", "Drink plenty of electrolytes and fluids", "Avoid aspirin or ibuprofen (risk of bleeding)", "Seek hospitalization if red spots appear"]
    },
    "Typhoid": {
        "specialization": "General Physician",
        "severity": "High",
        "description": "Bacterial infection caused by Salmonella typhi, spreading via contaminated food and water.",
        "precautions": ["Eat thoroughly cooked, hot food", "Drink only purified or bottled water", "Complete full course of antibiotics", "Rest and eat high-calorie nutritious diet"]
    },
    "hepatitis A": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate",
        "description": "Viral liver disease spread by ingestion of contaminated food and water.",
        "precautions": ["Strict hand hygiene", "Abstain from alcohol completely", "High carbohydrate, easily digestible diet", "Get adequate bed rest"]
    },
    "Hepatitis B": {
        "specialization": "Gastroenterologist",
        "severity": "High",
        "description": "Liver infection caused by the Hepatitis B virus, transmitted through blood and body fluids.",
        "precautions": ["Consult hepatologist for antiviral therapy", "Vaccinate close family members", "Avoid alcohol and hepatotoxic drugs", "Periodic liver ultrasound and monitoring"]
    },
    "Hepatitis C": {
        "specialization": "Gastroenterologist",
        "severity": "High",
        "description": "Blood-borne viral infection causing chronic liver inflammation.",
        "precautions": ["Direct-acting antiviral medications as prescribed", "Never share razors or needles", "Healthy nutrition for liver protection", "Periodic viral load testing"]
    },
    "Hepatitis D": {
        "specialization": "Gastroenterologist",
        "severity": "Critical",
        "description": "A serious liver infection that occurs only in individuals co-infected with Hepatitis B.",
        "precautions": ["Specialist liver care", "Strict medical compliance", "Frequent hepatic profiling", "Avoid high-fat meals and toxins"]
    },
    "Hepatitis E": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate to High",
        "description": "Acute water-borne liver infection common in developing regions.",
        "precautions": ["Drink boiled/filtered water", "Avoid raw or undercooked shellfish", "Adequate rest and fluids", "Special care for pregnant individuals"]
    },
    "Alcoholic hepatitis": {
        "specialization": "Gastroenterologist",
        "severity": "High",
        "description": "Severe liver inflammation caused by heavy and prolonged alcohol consumption.",
        "precautions": ["Absolute and permanent cessation of alcohol", "Nutritional therapy and vitamins", "Support from addiction recovery counseling", "Regular medical checkups"]
    },
    "Tuberculosis": {
        "specialization": "Pulmonologist",
        "severity": "High",
        "description": "Bacterial infection primarily affecting the lungs with chronic cough, night sweats, and weight loss.",
        "precautions": ["Strict adherence to full DOTS antibiotic course", "Wear mask in crowded settings", "Nutritious protein-rich diet", "Ventilate living quarters"]
    },
    "Common Cold": {
        "specialization": "General Physician",
        "severity": "Mild",
        "description": "A viral infectious disease of the upper respiratory tract causing runny nose, congestion, and sneezing.",
        "precautions": ["Warm saline gargles and steam inhalation", "Stay hydrated with herbal teas and soups", "Get plenty of rest", "Take over-the-counter decongestants if needed"]
    },
    "Pneumonia": {
        "specialization": "Pulmonologist",
        "severity": "High",
        "description": "Infection that inflames air sacs in one or both lungs, which may fill with fluid or pus.",
        "precautions": ["Complete antibiotic or antiviral medications", "Check oxygen saturation regularly with oximeter", "Drink warm fluids", "Seek emergency care if breathing is labored"]
    },
    "Dimorphic hemmorhoids(piles)": {
        "specialization": "Gastroenterologist",
        "severity": "Moderate",
        "description": "Swollen and inflamed veins in the rectum and anus causing discomfort and bleeding.",
        "precautions": ["Increase dietary fiber (fruits, oats, vegetables)", "Drink 8-10 glasses of water daily", "Warm sitz baths twice daily", "Avoid straining during bowel movements"]
    },
    "Heart attack": {
        "specialization": "Cardiologist",
        "severity": "Emergency",
        "description": "Medical emergency where blood flow to a part of the heart is abruptly blocked.",
        "precautions": ["CALL EMERGENCY 911 / 112 IMMEDIATELY", "Chew an aspirin if recommended and not allergic", "Keep patient calm and resting", "Perform CPR if unconscious"]
    },
    "Varicose veins": {
        "specialization": "Cardiologist",
        "severity": "Mild to Moderate",
        "description": "Enlarged, twisted, and swollen veins, usually occurring in the legs.",
        "precautions": ["Wear graduated compression stockings", "Elevate legs when resting", "Avoid long periods of standing or sitting", "Exercise regularly (walking, swimming)"]
    },
    "Hypothyroidism": {
        "specialization": "Endocrinologist",
        "severity": "Moderate",
        "description": "Underactive thyroid gland failing to produce sufficient thyroid hormones, causing fatigue and weight gain.",
        "precautions": ["Take levothyroxine on an empty stomach every morning", "Regular TSH monitoring every 3-6 months", "Eat balanced iodine and selenium-rich foods", "Exercise regularly"]
    },
    "Hyperthyroidism": {
        "specialization": "Endocrinologist",
        "severity": "Moderate",
        "description": "Overactive thyroid producing too much thyroxine, causing fast heartbeat, weight loss, and tremors.",
        "precautions": ["Take antithyroid medications as directed", "Limit caffeine and stimulants", "Adequate calcium and Vitamin D intake", "Regular thyroid lab tests"]
    },
    "Hypoglycemia": {
        "specialization": "Endocrinologist",
        "severity": "High",
        "description": "Dangerously low blood sugar level causing shakiness, sweating, confusion, and dizziness.",
        "precautions": ["Follow the 15-15 rule: consume 15g fast-acting sugar (fruit juice or candy)", "Recheck blood glucose after 15 minutes", "Eat a complex carbohydrate snack afterwards", "Always carry glucose tablets"]
    },
    "Osteoarthristis": {
        "specialization": "Orthopedic",
        "severity": "Moderate",
        "description": "Degenerative joint disease where flexible tissue at the ends of bones wears down over time.",
        "precautions": ["Low-impact exercises such as swimming and cycling", "Maintain healthy body weight to relieve joint stress", "Hot/cold compress on painful joints", "Physical therapy"]
    },
    "Arthritis": {
        "specialization": "Rheumatologist",
        "severity": "Moderate to High",
        "description": "Inflammation of one or more joints, causing stiffness and pain that worsen with age.",
        "precautions": ["Anti-inflammatory diet (omega-3, berries, leafy greens)", "Regular gentle stretching exercises", "Take prescribed disease-modifying medications", "Protect joints with braces if advised"]
    },
    "(vertigo) Paroymsal  Positional Vertigo": {
        "specialization": "ENT Specialist",
        "severity": "Moderate",
        "description": "Benign inner ear disorder causing brief episodes of mild to intense spinning dizziness.",
        "precautions": ["Perform Epley maneuver under guidance", "Sit down immediately when dizzy spells occur", "Avoid sudden head movements", "Turn lights on before getting out of bed at night"]
    },
    "Acne": {
        "specialization": "Dermatologist",
        "severity": "Mild",
        "description": "Skin condition occurring when hair follicles become plugged with oil and dead skin cells.",
        "precautions": ["Wash face gently twice daily with mild cleanser", "Avoid touching or popping pimples", "Use non-comedogenic sunscreen and skincare", "Topical benzoyl peroxide or salicylic acid"]
    },
    "Urinary tract infection": {
        "specialization": "Urologist",
        "severity": "Moderate",
        "description": "Infection in any part of the urinary system, commonly bladder and urethra, causing burning sensation.",
        "precautions": ["Drink plenty of water to flush bacteria", "Complete prescribed antibiotic course", "Cranberry extract may help support bladder health", "Do not hold in urine for long intervals"]
    },
    "Psoriasis": {
        "specialization": "Dermatologist",
        "severity": "Moderate",
        "description": "Autoimmune condition causing skin cells to multiply up to 10 times faster, resulting in red patches with white scales.",
        "precautions": ["Keep skin moisturized with thick ointments", "Short, moderate exposure to natural sunlight", "Avoid stress and skin injury triggers", "Use prescribed topical steroids or biologics"]
    },
    "Impetigo": {
        "specialization": "Dermatologist",
        "severity": "Moderate",
        "description": "Highly contagious bacterial skin infection causing sores and honey-colored crusted lesions.",
        "precautions": ["Wash sores with warm soapy water", "Apply prescribed antibiotic ointment", "Cover sores loosely with gauze", "Wash infected clothing and bedding separately"]
    }
}

# Symptom patterns for each disease for ML model generation
DISEASE_SYMPTOMS_TRAINING = {
    "Fungal infection": ["itching", "skin_rash", "nodal_skin_eruptions", "dischromic_patches"],
    "Allergy": ["continuous_sneezing", "shivering", "chills", "watering_from_eyes"],
    "GERD": ["stomach_pain", "acidity", "ulcers_on_tongue", "vomiting", "cough", "chest_pain"],
    "Chronic cholestasis": ["itching", "vomiting", "yellowish_skin", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes"],
    "Peptic ulcer diseae": ["vomiting", "indigestion", "loss_of_appetite", "abdominal_pain", "passage_of_gases", "internal_itching"],
    "AIDS": ["muscle_wasting", "patches_in_throat", "high_fever", "extra_marital_contacts"],
    "Diabetes": ["fatigue", "weight_loss", "restlessness", "lethargy", "irregular_sugar_level", "blurred_and_distorted_vision", "obesity", "excessive_hunger", "increased_appetite", "polyuria"],
    "Gastroenteritis": ["vomiting", "sunken_eyes", "dehydration", "diarrhoea"],
    "Bronchial Asthma": ["fatigue", "cough", "high_fever", "breathlessness", "mucoid_sputum"],
    "Hypertension": ["headache", "chest_pain", "dizziness", "loss_of_balance", "lack_of_concentration"],
    "Migraine": ["acidity", "indigestion", "headache", "blurred_and_distorted_vision", "excessive_hunger", "stiff_neck", "depression", "irritability", "visual_disturbances"],
    "Cervical spondylosis": ["back_pain", "neck_pain", "dizziness", "loss_of_balance"],
    "Paralysis (brain hemorrhage)": ["vomiting", "headache", "weakness_of_one_body_side", "altered_sensorium"],
    "Jaundice": ["itching", "vomiting", "fatigue", "weight_loss", "high_fever", "yellowish_skin", "dark_urine", "abdominal_pain"],
    "Malaria": ["chills", "vomiting", "high_fever", "sweating", "headache", "nausea", "muscle_pain"],
    "Chicken pox": ["itching", "skin_rash", "fatigue", "lethargy", "high_fever", "headache", "loss_of_appetite", "mild_fever", "swelled_lymph_nodes", "malaise", "red_spots_over_body"],
    "Dengue": ["skin_rash", "chills", "joint_pain", "vomiting", "fatigue", "high_fever", "headache", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", "muscle_pain", "red_spots_over_body"],
    "Typhoid": ["chills", "vomiting", "fatigue", "high_fever", "headache", "nausea", "constipation", "abdominal_pain", "diarrhoea", "toxic_look_(typhos)", "belly_pain"],
    "hepatitis A": ["joint_pain", "vomiting", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "diarrhoea", "mild_fever", "yellowing_of_eyes", "muscle_pain"],
    "Hepatitis B": ["itching", "fatigue", "lethargy", "yellowish_skin", "dark_urine", "loss_of_appetite", "abdominal_pain", "yellow_urine", "yellowing_of_eyes", "malaise", "receiving_blood_transfusion", "receiving_unsterile_injections"],
    "Hepatitis C": ["fatigue", "yellowish_skin", "nausea", "loss_of_appetite", "yellowing_of_eyes", "family_history"],
    "Hepatitis D": ["joint_pain", "vomiting", "fatigue", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes"],
    "Hepatitis E": ["joint_pain", "vomiting", "fatigue", "high_fever", "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "abdominal_pain", "yellowing_of_eyes", "acute_liver_failure", "coma", "stomach_bleeding"],
    "Alcoholic hepatitis": ["vomiting", "yellowish_skin", "abdominal_pain", "swelling_of_stomach", "distention_of_abdomen", "history_of_alcohol_consumption", "fluid_overload"],
    "Tuberculosis": ["chills", "vomiting", "fatigue", "weight_loss", "cough", "high_fever", "breathlessness", "sweating", "loss_of_appetite", "mild_fever", "phlegm", "swelled_lymph_nodes", "malaise", "blood_in_sputum"],
    "Common Cold": ["continuous_sneezing", "chills", "fatigue", "cough", "high_fever", "headache", "swelled_lymph_nodes", "malaise", "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose", "congestion", "chest_pain", "loss_of_smell", "muscle_pain"],
    "Pneumonia": ["chills", "fatigue", "cough", "high_fever", "breathlessness", "sweating", "malaise", "phlegm", "chest_pain", "fast_heart_rate", "rusty_sputum"],
    "Dimorphic hemmorhoids(piles)": ["constipation", "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool", "irritation_in_anus"],
    "Heart attack": ["vomiting", "breathlessness", "sweating", "chest_pain"],
    "Varicose veins": ["fatigue", "cramps", "bruising", "obesity", "swollen_legs", "swollen_blood_vessels", "prominent_veins_on_calf"],
    "Hypothyroidism": ["fatigue", "weight_gain", "cold_hands_and_feets", "mood_swings", "lethargy", "dizziness", "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", "swollen_extremeties", "depression", "irritability", "abnormal_menstruation"],
    "Hyperthyroidism": ["fatigue", "mood_swings", "weight_loss", "restlessness", "sweating", "diarrhoea", "fast_heart_rate", "excessive_hunger", "muscle_weakness", "irritability", "abnormal_menstruation"],
    "Hypoglycemia": ["vomiting", "fatigue", "anxiety", "sweating", "headache", "nausea", "blurred_and_distorted_vision", "excessive_hunger", "slurred_speech", "irritability", "palpitations"],
    "Osteoarthristis": ["joint_pain", "neck_pain", "knee_pain", "hip_joint_pain", "swelling_joints", "painful_walking"],
    "Arthritis": ["muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", "painful_walking"],
    "(vertigo) Paroymsal  Positional Vertigo": ["vomiting", "headache", "nausea", "spinning_movements", "loss_of_balance", "unsteadiness"],
    "Acne": ["skin_rash", "pus_filled_pimples", "blackheads", "scurring"],
    "Urinary tract infection": ["burning_micturition", "bladder_discomfort", "foul_smell_of_urine", "continuous_feel_of_urine"],
    "Psoriasis": ["skin_rash", "joint_pain", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", "inflammatory_nails"],
    "Impetigo": ["skin_rash", "high_fever", "blister", "red_sore_around_nose", "yellow_crust_ooze"]
}
