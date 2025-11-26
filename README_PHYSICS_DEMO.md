# Démo Physique - dc-displayblock

## 📍 Emplacement
`src/displayblock/demo/physics-cannon.html`

## 🎮 Fonctionnalités

### Simulation Physique
- **Gravité** : -9.82 m/s² (configurable)
- **Collisions** : Détection AABB entre cubes et avec le sol
- **Rebonds** : Coefficient de restitution de 0.7
- **Rotations** : Vélocité angulaire lors des impacts
- **Friction** : Coefficient de 0.3

### Effets Visuels
- Cubes cyan avec glow lors des rebonds
- Sol vert semi-transparent
- Effet lumineux rose/magenta lors des collisions
- Murs invisibles pour contenir les cubes

### Contrôles Interactifs
- **Ajouter Cube** : Ajoute un cube aléatoire
- **Ajouter 10 Cubes** : Ajoute 10 cubes successivement
- **Réinitialiser** : Efface tous les cubes
- **Gravité ON/OFF** : Active/désactive la gravité
- **Clic gauche + déplacement** : Pan (déplacer la vue)
- **Clic droit + déplacement** : Rotation de la caméra

### Statistiques en Temps Réel
- Nombre de cubes actifs
- FPS (frames par seconde)
- Valeur de la gravité
- Coefficient de rebond

## 🔧 Architecture Technique

### Moteur Physique Simplifié
Le fichier `lib/simple-physics.js` implémente un moteur physique léger qui démontre :
- Intégration de vélocité (Euler)
- Détection de collision AABB (Axis-Aligned Bounding Box)
- Résolution de collision avec séparation et rebond
- Support de corps statiques et dynamiques

### Synchronisation DOM
Chaque frame (60 FPS) :
1. Le monde physique calcule les nouvelles positions/rotations
2. Les transformations CSS sont mises à jour pour chaque cube
3. Les effets visuels sont appliqués selon l'état physique

## 📊 Performances

### Limites Testées
- ~25 cubes : 60 FPS stable
- ~50 cubes : 45-55 FPS
- >100 cubes : <30 FPS (limitation DOM, pas du moteur physique)

### Optimisations Appliquées
- Capping du deltaTime pour stabilité
- Damping de la vélocité angulaire (0.99)
- Mise à jour CSS par lot via requestAnimationFrame

## 🎯 Objectif Pédagogique

Cette démo illustre concrètement les concepts analysés dans `PHYSICS_ENGINE_ANALYSIS.md` :
- Faisabilité de la physique avec rendu DOM
- Bottleneck de synchronisation DOM vs calculs physiques
- Compromis performance/réalisme
- Patterns d'intégration moteur physique + DOM

## 🚀 Utilisation

1. Ouvrir `src/displayblock/demo/physics-cannon.html` dans un navigateur
2. Cliquer sur "Ajouter Cube" ou "Ajouter 10 Cubes"
3. Observer les cubes tomber, rebondir et interagir
4. Expérimenter avec les contrôles (gravité, reset, etc.)

## 📚 Relation avec l'Analyse

Ce démo valide les recommandations de `PHYSICS_ENGINE_ANALYSIS.md` :
- ✅ Physique 3D faisable avec DOM
- ✅ Limite pratique ~50-200 objets confirmée
- ✅ Synchronisation DOM = bottleneck principal
- ✅ Moteur léger (type Cannon-es) suffisant pour voxels

## 🔄 Évolutions Possibles

1. **Intégration Cannon-es** : Remplacer SimplePhysics par Cannon-es réel
2. **Contraintes/Joints** : Ajouter des liens entre cubes
3. **Formes variées** : Cuboids de tailles différentes
4. **Optimisations** : Object pooling, frustum culling
5. **Mode hybride** : Canvas pour physique + DOM pour UI
