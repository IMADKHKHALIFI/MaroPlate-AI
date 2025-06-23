# 🚗 Système de Détection de Plaques d'Immatriculation Marocaines

Un système avancé de détection et reconnaissance de plaques d'immatriculation marocaines utilisant l'intelligence artificielle et la vision par ordinateur.

## 📋 Table des Matières

- [Aperçu du Projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Architecture du Système](#architecture-du-système)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🎯 Aperçu du Projet

Ce projet implémente un système complet de détection et reconnaissance automatique de plaques d'immatriculation marocaines. Il combine des modèles de deep learning (YOLOv3) pour la détection avec des techniques OCR avancées pour la reconnaissance des caractères arabes et latins.

### Objectifs Principaux

- **Détection précise** : Localisation automatique des plaques dans les images
- **Reconnaissance OCR** : Extraction du texte des plaques (chiffres, lettres arabes, codes région)
- **Interface moderne** : Dashboard intuitif avec analyses en temps réel
- **Performance optimisée** : Traitement rapide et efficace des images

## ✨ Fonctionnalités

### 🔍 Détection et Reconnaissance

- Détection automatique de plaques d'immatriculation dans les images
- Reconnaissance OCR des caractères arabes et latins
- Support des formats de plaques marocaines standard
- Segmentation intelligente des caractères
- Calcul de confiance pour chaque détection

### 📊 Dashboard Analytique

- Tableau de bord en temps réel avec métriques clés
- Visualisation des performances du système
- Historique des détections
- Statistiques détaillées (précision, temps de traitement, taux de succès)

### 🖼️ Galerie Intelligente

- Stockage et organisation des images traitées
- Filtrage et recherche avancée
- Système de favoris
- Métadonnées complètes pour chaque détection

### 🌍 Informations Géographiques

- Mapping automatique des codes région vers les villes marocaines
- Affichage des informations géographiques contextuelles
- Support de toutes les régions du Maroc

## 🛠️ Technologies Utilisées

### Frontend

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour un code robuste
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI modernes
- **Zustand** - Gestion d'état légère et performante
- **Lucide React** - Icônes modernes et cohérentes

### Backend

- **Python 3.8+** - Langage principal du backend
- **Flask** - Framework web léger et flexible
- **OpenCV** - Traitement d'images et vision par ordinateur
- **YOLOv3** - Modèle de détection d'objets
- **Tesseract OCR** - Engine de reconnaissance de caractères
- **NumPy** - Calculs numériques optimisés

### Base de Données

- **SQLite** - Base de données légère pour les logs de détection
- **JSON** - Stockage des configurations et métadonnées

## 🏗️ Architecture du Système

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Models     │
│   (Next.js)     │◄──►│   (Flask)       │◄──►│   (YOLOv3)      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Detection API │    │ • Plate Detect  │
│ • Gallery       │    │ • OCR API       │    │ • OCR Model     │
│ • Analytics     │    │ • File Handler  │    │ • Weights       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation

### Prérequis

- **Node.js** 18+
- **Python** 3.8+
- **pip** (gestionnaire de paquets Python)
- **Git**

### 1. Cloner le Repository

```bash
git clone <repository-url>
cd FINALE_projet
```

### 2. Configuration du Frontend

```bash
# Installer les dépendances
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configuration du Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances Python
pip install -r requirements.txt
```

### 4. Configuration des Modèles IA

⚠️ **Important**: Les modèles IA sont requis pour le fonctionnement du système.

**🚀 Méthode Simple (Recommandée)**

1. **Aller aux Releases**: [GitHub Releases](https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases)
2. **Télécharger**: `ai-models-v1.0.zip` (~470MB)
3. **Extraire**: Le fichier zip
4. **Copier**: Tous les fichiers vers `backend/weights/` en respectant cette structure:
   ```
   backend/weights/
   ├── detection/
   │   ├── yolov3-detection_final.weights  (234MB)
   │   └── yolov3-detection.cfg
   └── ocr/
       ├── yolov3-ocr_final.weights        (235MB)
       └── yolov3-ocr.cfg
   ```

**⚡ Script Automatique (Alternative)**

```bash
# Depuis la racine du projet
python backend/setup_models.py
```

💡 **Note**: Les modèles font ~470MB au total. Assurez-vous d'avoir suffisamment d'espace disque.

## ⚙️ Configuration

### Variables d'Environnement

Créer un fichier `.env.local` à la racine :

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Détection Plaques Maroc

# Upload Configuration
MAX_FILE_SIZE=16777216
ALLOWED_EXTENSIONS=jpg,jpeg,png,bmp
```

### Configuration Backend

Le backend se configure automatiquement, mais vous pouvez modifier :

- Port d'écoute dans `api.py`
- Chemins des modèles
- Taille maximale des fichiers

## 🎮 Utilisation

### Démarrage du Système

1. **Démarrer le Backend** :

```bash
cd backend
python api.py
```

Le serveur démarre sur `http://localhost:5000`

2. **Démarrer le Frontend** :

```bash
# Dans un nouveau terminal, à la racine du projet
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

L'application est accessible sur `http://localhost:3000`

### Utilisation de l'Interface

1. **Dashboard** : Vue d'ensemble avec métriques en temps réel
2. **Détection** : Upload et traitement d'images
3. **Galerie** : Consultation des résultats
4. **Métriques** : Analyses détaillées des performances

## 📁 Structure du Projet

```
FINALE_projet/
├── 📱 Frontend (Next.js)
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/          # Tableau de bord
│   │   │   ├── detection/          # Interface de détection
│   │   │   ├── gallery/            # Galerie d'images
│   │   │   └── metrics/            # Métriques et analyses
│   │   ├── globals.css             # Styles globaux
│   │   ├── layout.tsx              # Layout principal
│   │   └── page.tsx                # Page d'accueil
│   ├── components/
│   │   ├── ui/                     # Composants UI de base
│   │   ├── animated-background.tsx # Arrière-plan animé
│   │   ├── detection-control-panel.tsx
│   │   ├── gallery-card.tsx
│   │   ├── ocr-result-display.tsx
│   │   └── ...                     # Autres composants
│   ├── hooks/                      # Hooks React personnalisés
│   ├── lib/
│   │   ├── api/                    # Client API
│   │   ├── store/                  # Gestion d'état (Zustand)
│   │   └── utils.ts                # Utilitaires
│   └── public/                     # Assets statiques
│
├── 🤖 Backend (Python/Flask)
│   ├── api.py                      # API principale
│   ├── detection.py                # Module de détection
│   ├── ocr.py                      # Module OCR
│   ├── utility.py                  # Fonctions utilitaires
│   ├── requirements.txt            # Dépendances Python
│   ├── weights/
│   │   ├── detection/              # Modèles de détection
│   │   └── ocr/                    # Modèles OCR
│   ├── test_images/                # Images de test
│   ├── tmp/                        # Fichiers temporaires
│   └── __pycache__/                # Cache Python
│
├── 📋 Configuration
│   ├── package.json                # Dépendances Node.js
│   ├── tsconfig.json               # Configuration TypeScript
│   ├── tailwind.config.ts          # Configuration Tailwind
│   ├── next.config.mjs             # Configuration Next.js
│   └── components.json             # Configuration Shadcn/ui
│
└── 📖 Documentation
    └── README.md                   # Ce fichier
```

## 🔌 API Endpoints

### Détection de Plaques

```http
POST /api/detect
Content-Type: multipart/form-data

Body: image file
```

**Réponse :**

```json
{
  "status": "success",
  "results": [
    {
      "plateNumber": "90120",
      "regionCode": "72",
      "arabicLetter": "ي",
      "confidence": 98.5,
      "bbox": [x, y, width, height]
    }
  ],
  "processing_time": 1.2
}
```

### Upload d'Image

```http
POST /api/upload
Content-Type: multipart/form-data

Body: image file
```

### Métriques du Système

```http
GET /api/metrics
```

**Réponse :**

```json
{
  "total_detections": 150,
  "average_confidence": 94.2,
  "success_rate": 96.8,
  "average_processing_time": 1.1
}
```

## 🎯 Fonctionnalités Avancées

### Reconnaissance Multi-Format

- Support des plaques anciennes et nouvelles
- Reconnaissance des caractères arabes (ا، ب، ت، ث، ج، ح، خ، د...)
- Détection des codes région (1-89)

### Optimisations Performances

- Cache intelligent des résultats
- Traitement asynchrone des images
- Compression automatique des images
- Gestion mémoire optimisée

### Interface Utilisateur

- Design responsive (mobile, tablette, desktop)
- Thème sombre moderne
- Animations fluides
- Feedback temps réel

## 🐛 Résolution de Problèmes

### Modèles IA manquants

```bash
# Vérifier l'état des modèles
python backend/setup_models.py check
```

**Symptômes**: Erreur "modèle non trouvé" ou "weights file not found"
**Solution**:

1. Télécharger `ai-models-v1.0.zip` depuis [GitHub Releases](https://github.com/IMADKHKHALIFI/MaroPlate-AI/releases)
2. Extraire dans `backend/weights/`
3. Vérifier avec `python backend/setup_models.py check`

### Backend ne démarre pas

1. Vérifier l'installation de Python et pip
2. Installer les dépendances : `pip install -r requirements.txt`
3. Vérifier les chemins des modèles dans `weights/`

### Erreur de détection

1. S'assurer que le backend fonctionne sur le port 5000
2. Vérifier la connexion réseau
3. Contrôler les logs dans la console du navigateur
4. Vérifier que les modèles IA sont installés

### Performance lente

1. Vérifier les ressources système (RAM, CPU)
2. Optimiser la taille des images d'entrée
3. Utiliser un SSD pour le stockage
4. S'assurer d'avoir 8GB+ de RAM disponible

## 📊 Métriques et KPIs

Le système suit plusieurs métriques clés :

- **Détections Totales** : Nombre d'images traitées
- **Précision Moyenne** : Confiance moyenne des détections
- **Temps de Traitement** : Durée moyenne par image
- **Taux de Succès** : Pourcentage de détections réussies
- **Répartition Géographique** : Analyse par région

## 🔮 Roadmap

### Version 2.0 (À venir)

- [ ] Support vidéo en temps réel
- [ ] API REST complète
- [ ] Base de données PostgreSQL
- [ ] Authentification utilisateur
- [ ] Export des données (PDF, Excel)

### Version 2.1

- [ ] Application mobile (React Native)
- [ ] Intégration cloud (AWS/Azure)
- [ ] Machine Learning Pipeline
- [ ] Tests automatisés

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- 📧 Email : imadelkhelyfy@gmail.com

## �‍💻 Développeur

**IMAD EL KHELYFY**

- 🎓 Étudiant en Master SDIA (Sciences des Données et Intelligence Artificielle)
- 🏛️ Université Moulay Ismail "Faculté des Sciences " de Meknès, Maroc
- 📍 Meknès, Royaume du Maroc---

**Développé avec ❤️ par IMAD EL KHELYFY au Maroc** 🇲🇦
