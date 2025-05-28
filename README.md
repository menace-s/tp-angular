
# TP Angular : Gestion de Cours et d'Étudiants (Version Évoluée)

> **Bienvenue dans le TP Angular !** Ce projet illustre une application Angular complète, intégrant des composants, des services, des requêtes HTTP, un routage avancé, et une interface utilisateur améliorée avec des indicateurs de chargement.

[![Angular](https://img.shields.io/badge/Angular-v19-red)](https://angular.dev)

---

## Table des Matières
- [Objectif du TP](#objectif-du-tp)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Flux de Données](#flux-de-données)
- [Configuration et Modules](#configuration-et-modules)
- [Comment Lancer le Projet](#comment-lancer-le-projet)
- [Points Clés d'Apprentissage](#points-clés-dapprentissage)

---

## Objectif du TP

> Ce TP vise à approfondir la maîtrise d'Angular en explorant des concepts fondamentaux et avancés à travers une application de gestion de cours et d'étudiants.

| **Concept** | **Description** |
|-------------|-----------------|
| **Architecture à base de Composants** | Interaction entre composants parent (`CoursesComponent`) et enfants (`CourseComponent`, `CourseDetailComponent`). |
| **Services Angular** | Utilisation de `CourseService` pour centraliser l'accès aux données et interagir avec un backend. |
| **Programmation Asynchrone** | Gestion des requêtes HTTP avec RxJS `Observables`. |
| **Routage Avancé** | Routes paramétrées, navigation avec `routerLink`, et affichage via `<router-outlet>`. |
| **Liaison de Données** | Interpolation, liaisons de propriété, d'événement, et bidirectionnelle (`[(ngModel)]`). |
| **Directives Structurelles** | Utilisation de `*ngFor` et `*ngIf` pour un affichage dynamique. |
| **Composants Autonomes** | Imports directs de modules (`CommonModule`, `FormsModule`, `RouterModule`). |
| **Gestion de l'État** | Indicateurs de chargement (`isLoading`) et gestion des erreurs. |
| **Styling** | CSS spécifique pour une interface utilisateur soignée. |

---

## Fonctionnalités

L'application inclut les fonctionnalités suivantes :

1. **Liste des cours** : Affichage des cours récupérés depuis un backend PHP.
2. **Modification interactive** : Mise à jour du nombre d'étudiants via un champ de saisie.
3. **Page de détail** : Navigation vers une vue détaillée pour chaque cours.
4. **Calcul dynamique** : Affichage en temps réel du total d'étudiants.
5. **Message conditionnel** : Indication de "peu" ou "beaucoup" d'étudiants selon le total.
6. **Titre modifiable** : Mise à jour du titre principal via un champ de saisie.
7. **Indicateurs de chargement** : Affichage pendant la récupération des données.
8. **Gestion des erreurs** : Messages d'erreur en cas de problème avec les requêtes HTTP.

> **Astuce** : Cliquez sur le titre d'un cours pour accéder à sa page de détail !

---

## Structure du Projet

L'application est organisée autour des éléments suivants :

### 1. Interface `Course`
Définit le modèle de données pour un cours.

```typescript
export interface Course {
  id: number;
  titre: string;
  nb_etud: number;
  description?: string;
}
```

### 2. Service `CourseService`
- **Fichier** : `src/app/course.service.ts`
- **Rôle** : Gère la communication avec le backend via `HttpClient`.
- **Méthodes principales** :
  - `getCourses(): Observable<Course[]>` : Récupère tous les cours.
  - `getCourseById(id: number): Observable<Course>` : Récupère un cours spécifique.
- **Gestion des erreurs** : Retour d'erreurs HTTP via `Observables`.

### 3. Scripts PHP (Backend)
| **Script** | **Rôle** | **Paramètres** | **Réponse** |
|------------|----------|----------------|-------------|
| `getCourses.php` | Retourne la liste des cours | Aucun | JSON : Liste de 10 cours |
| `getCourseById.php` | Retourne un cours spécifique | `id` (ex. `?id=3`) | JSON : Détails du cours ou erreur (400/404) |

> **Note** : Les scripts PHP gèrent les en-têtes CORS pour permettre les requêtes depuis Angular.

### 4. Composant `CourseComponent`
- **Rôle** : Affiche un cours dans la liste et permet de modifier `nb_etud`.
- **Entrées/Sorties** :
  - `@Input() contenu` : Objet `Course`.
  - `@Output() newNb` : Émet la différence du nombre d'étudiants.
- **Liaison** : Utilise `[(ngModel)]` pour une mise à jour bidirectionnelle.

### 5. Composant `CoursesComponent`
- **Rôle** : Affiche la liste des cours, le total d'étudiants, et un message conditionnel.
- **Logique** :
  - Injecte `CourseService` pour récupérer les cours.
  - Utilise `*ngFor` pour afficher `<app-course>`.
  - Calcule le total et le message via `getTotalEtudiants()` et `getMessageEtudiants()`.

### 6. Composant `CourseDetailComponent`
- **Rôle** : Affiche les détails d’un cours via une route paramétrée (`cours/:id`).
- **Logique** :
  - Injecte `ActivatedRoute` pour lire l’`id`.
  - Appelle `CourseService.getCourseById(id)` pour charger les données.
  - Gère les états `isLoading` et `errorMessage`.

---

## Flux de Données

> Voici comment les données circulent dans l'application lors du chargement de la liste des cours :

1. L'utilisateur navigue vers `/courses`.
2. `CoursesComponent` appelle `CourseService.getCourses()` dans `ngOnInit`.
3. `isLoading` passe à `true`, affichant un indicateur de chargement.
4. Une requête HTTP GET est envoyée à `getCourses.php`.
5. Les données JSON reçues remplissent le tableau `UE`.
6. `isLoading` passe à `false`, la liste s’affiche.
7. Les modifications de `nb_etud` via `<app-course>` mettent à jour `UE` et recalculent le total.

> **Navigation vers un détail** :
> - Un clic sur un `routerLink` (`/cours/:id`) active `CourseDetailComponent`.
> - L’`id` est extrait via `ActivatedRoute`, puis `getCourseById(id)` est appelé.

---

## Configuration et Modules

| **Configuration** | **Détails** |
|-------------------|-------------|
| `app.config.ts` | `provideRouter(routes)`, `provideHttpClient(withFetch())` |
| Modules importés | `CommonModule`, `FormsModule`, `RouterModule` |
| Composants autonomes | Imports directs dans les fichiers `.ts` |

---

## Comment Lancer le Projet

### Prérequis
- Node.js et Angular CLI.
- Serveur PHP local (XAMPP, MAMP, WAMP, ou PHP intégré).

### Étapes
1. **Cloner le projet** :
   ```bash
   git clone <url-du-dépôt>
   ```
2. **Configurer le backend** :
   - Placez `getCourses.php` et `getCourseById.php` dans un dossier accessible (ex. `htdocs/api/`).
   - Mettez à jour `coursesUrl` dans `course.service.ts` avec l’URL de votre serveur PHP.
3. **Installer les dépendances** :
   ```bash
   npm install
   ```
4. **Lancer l’application** :
   ```bash
   ng serve -o
   ```
   > **Note** : Assurez-vous que le serveur PHP est actif (ex. `http://localhost/api/`).

---

## Points Clés d’Apprentissage

- Création et gestion de **composants et services** Angular.
- Communication asynchrone avec un backend via **HttpClient** et **Observables**.
- Routage avancé avec **routes paramétrées**.
- Gestion des **états de chargement** pour une meilleure UX.
- Bonnes pratiques : **désinscription des Observables** (`ngOnDestroy`).
- Configuration **CORS** pour le développement.
- Résolution des erreurs d’**hydratation** (NG0500) en SSR.

> **Pour aller plus loin** : Consultez le code source pour une compréhension détaillée de l’implémentation.
```

Ce code Markdown est prêt à être inséré dans ton fichier `README.md`. Il conserve toutes les améliorations proposées (tableaux, blockquotes, badges, table des matières, etc.) pour une présentation claire et professionnelle. Si tu veux ajouter des éléments supplémentaires, comme un diagramme Mermaid pour illustrer le flux de données, fais-moi signe !