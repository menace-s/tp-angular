# TP Angular : Gestion de Cours et d'Étudiants

> Ce projet est un Travail Pratique (TP) conçu pour illustrer et mettre en application les concepts fondamentaux du framework Angular. Il s'agit d'une petite application permettant de gérer une liste de cours et le nombre d'étudiants associés.

---

## Objectif du TP

L'objectif principal de ce TP est de permettre une compréhension pratique des briques essentielles d'Angular. Les concepts clés explorés incluent :

* **Architecture à base de Composants :** Interaction entre composants parent (`CoursesComponent`) et enfant (`CourseComponent`).
* **Liaison de Données (Data Binding) :**
    * Interpolation : `{{ expression }}`
    * Liaison de Propriété (Parent vers Enfant) : `[property]="value"`
    * Liaison d'Événement (Enfant vers Parent) : `(event)="handler()"`
    * Liaison Bidirectionnelle : `[(ngModel)]="property"`
* **Directives Structurelles :**
    * `*ngFor` : Pour itérer sur des collections et générer des éléments dynamiquement.
    * `*ngIf` : Pour ajouter ou supprimer des éléments du DOM de manière conditionnelle.
* **Logique dans les Composants :** Implémentation de méthodes pour les calculs et la gestion des événements.
* **Composants Autonomes (Standalone Components) :** Utilisation du mode moderne d'Angular avec imports directs de modules (`CommonModule`, `FormsModule`).
* **Gestion de l'État Simplifiée :** Stratégie où le composant parent maintient les données sources, mises à jour via des références d'objets ou des événements.

---

## Fonctionnalités

L'application offre les fonctionnalités suivantes :

1.  **Affichage d'une liste de cours** avec leur titre et le nombre d'étudiants.
2.  **Modification interactive** du nombre d'étudiants pour chaque cours.
3.  **Calcul et affichage en temps réel** du nombre total d'étudiants.
4.  **Message dynamique** indiquant s'il y a "peu d'étudiants" ou "beaucoup d'étudiants" basé sur le total.
5.  **Modification du titre principal** de la page via un champ de saisie.

---

## Structure du Projet et Fonctionnement

L'application s'organise autour des éléments suivants :

### 1. Interface `Course`
   Définit le modèle de données pour un cours.

   ```typescript
   // Exemple: src/app/course/course.model.ts
   export interface Course {
     titre: string;
     nb_etud: number;
   }
   ```

### 2. Composant Enfant : `CourseComponent` (Sélecteur : `<app-course>`)
   * **Rôle :** Représente un seul cours dans l'interface utilisateur. Il affiche les détails du cours et permet de modifier le nombre d'étudiants qui y sont inscrits.
   * **Fichiers Associés :** `course.component.ts`, `course.component.html`, `course.component.css`.
   * **Communication et Logique :**
        * **Entrée (`@Input()`) :** Reçoit un objet `Course` de son parent via la propriété `contenu`.
            * Syntaxe dans le parent : `<app-course [contenu]="coursItem"></app-course>`
        * **Sortie (`@Output()`) :** Émet un événement `newNb` (de type `EventEmitter<number>`) chaque fois que le nombre d'étudiants est modifié. Cet événement transporte la *différence* (positive ou négative) du nombre d'étudiants.
            * Syntaxe dans le parent : `<app-course (newNb)="gestionnaireEvenement($event)"></app-course>`
        * **Logique Interne :**
            * Utilise `[(ngModel)]` sur un champ `<input type="number">` lié à `contenu.nb_etud`. Cela assure la synchronisation bidirectionnelle et met à jour directement l'objet `Course` partagé avec le parent.
            * Une méthode (par exemple, `onNbEtudChange()`) est déclenchée par `(ngModelChange)` pour calculer la différence par rapport à la valeur précédente et émettre l'événement `newNb`.

### 3. Composant Parent : `CoursesComponent` (Sélecteur : `<app-courses>`)
   * **Rôle :** Orchestre l'affichage de la liste des cours, gère les données globales (comme le tableau `UE` des cours), et affiche les informations agrégées (total d'étudiants, message conditionnel).
   * **Fichiers Associés :** `courses.component.ts`, `courses.component.html`, `courses.component.css`.
   * **Logique Clé :**
        * **Source de Vérité :** Maintient un tableau `UE: Course[]` comme source principale des données.
        * **Affichage de la Liste :** Utilise la directive `*ngFor` pour parcourir `UE` et instancier dynamiquement des composants `<app-course>` pour chaque élément.
        * **Calcul du Total (`getTotalEtudiants()`) :** Méthode qui recalcule la somme des `nb_etud` de tous les cours dans le tableau `UE`.
            > **Note Importante :** Étant donné que les objets `Course` du tableau `UE` sont passés par référence aux composants enfants `<app-course>`, toute modification de `nb_etud` dans un enfant (via `[(ngModel)]`) met à jour **directement et automatiquement** l'objet correspondant dans le tableau `UE` du parent. Ainsi, `getTotalEtudiants()` a toujours accès aux données les plus fraîches.
        * **Message Conditionnel (`getMessageEtudiants()`) :** Méthode qui utilise le résultat de `getTotalEtudiants()` pour retourner la chaîne "peu d'étudiants" ou "beaucoup d'étudiants".
        * **Interaction avec l'Enfant :** Écoute l'événement `(newNb)` émis par chaque `<app-course>` pour potentiellement réagir aux changements (par exemple, pour du logging).

---

### Flux de Données et Mises à Jour

Le cycle de vie typique d'une modification est le suivant :

1.  `CoursesComponent` (Parent) initialise son tableau `UE` de cours.
2.  Le template du parent utilise `*ngFor` pour afficher chaque `cours` de `UE` via un composant `CourseComponent` (Enfant), en lui passant l'objet `cours` par liaison de propriété `[contenu]`.
3.  L'utilisateur modifie le nombre d'étudiants dans l'input d'un `CourseComponent`.
    * Grâce à `[(ngModel)]`, la propriété `nb_etud` de l'objet `contenu` (qui est une référence à un objet dans `UE` du parent) est **immédiatement mise à jour**.
    * L'enfant `CourseComponent` émet ensuite l'événement `(newNb)` avec la différence.
4.  `CoursesComponent` (Parent) reçoit cet événement via son gestionnaire (par exemple, `onNewNb($event)`).
5.  La détection de changement d'Angular s'active. Les expressions dans le template du parent, telles que `{{ getTotalEtudiants() }}` et `{{ getMessageEtudiants() }}`, sont réévaluées.
6.  La méthode `getTotalEtudiants()` est appelée, lit le tableau `UE` (qui contient maintenant les valeurs mises à jour), et retourne le nouveau total.
7.  Le nombre total d'étudiants et le message "peu/beaucoup" sont mis à jour dans l'interface utilisateur.

---

### Modules Importés (pour les Composants Autonomes)

Pour que les fonctionnalités décrites fonctionnent, les composants autonomes doivent importer :

* **`CommonModule` :** Fournit les directives structurelles comme `*ngFor` et `*ngIf`. À importer dans `CoursesComponent` et `CourseComponent` (si ce dernier utilise de telles directives).
* **`FormsModule` :** Nécessaire pour la directive `[(ngModel)]`. À importer dans `CoursesComponent` (pour le titre de la page) et `CourseComponent` (pour le nombre d'étudiants).

---

## Comment Lancer le Projet (Exemple Standard)

1.  **Prérequis :** Avoir Node.js et Angular CLI installés.
2.  **Mise en place :**
    * Clonez le dépôt (si applicable).
    * Ou, créez une nouvelle application Angular (`ng new nom-du-projet --standalone --routing=false --ssr=false` pour un projet simple sans routing ni SSR au départ) et intégrez-y les composants décrits.
3.  **Navigation :** Ouvrez un terminal et naviguez jusqu'au dossier racine du projet :
    ```bash
    cd nom-du-projet
    ```
4.  **Installation des Dépendances** (si nécessaire, normalement fait par `ng new` ou inclus si cloné) :
    ```bash
    npm install
    ```
5.  **Lancement du Serveur de Développement :**
    ```bash
    ng serve -o
    ```
    L'application s'ouvrira automatiquement dans votre navigateur, généralement à l'adresse `http://localhost:4200/`.

---

## Points Clés d'Apprentissage

À l'issue de ce TP, vous devriez avoir une meilleure maîtrise des aspects suivants d'Angular :

* La structuration d'une application en composants réutilisables.
* Les mécanismes de communication essentiels entre composants.
* L'utilisation efficace des différentes formes de liaison de données.
* L'affichage dynamique de contenu basé sur des collections et des conditions.
* La configuration de base des composants autonomes et l'importation des modules nécessaires.
* Une approche fondamentale pour la gestion de l'état des données au sein des composants.
```