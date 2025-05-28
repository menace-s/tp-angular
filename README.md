```markdown
# TP Angular : Gestion de Cours et d'Étudiants

## Objectif du TP

Ce Travail Pratique (TP) a pour objectif principal de mettre en œuvre et de comprendre les concepts fondamentaux du framework Angular à travers la création d'une petite application de gestion de cours. Il permet d'explorer :

* L'architecture basée sur les **composants** (parent et enfant).
* La **liaison de données (data binding)** sous ses différentes formes :
    * Interpolation `{{ }}` pour afficher des données.
    * Liaison de propriété `[property]` pour passer des données du parent à l'enfant.
    * Liaison d'événement `(event)` pour communiquer de l'enfant au parent.
    * Liaison de données bidirectionnelle `[(ngModel)]` pour synchroniser les champs de formulaire avec les propriétés du composant.
* L'utilisation des **directives structurelles** :
    * `*ngFor` pour afficher des listes d'éléments.
    * `*ngIf` pour afficher des éléments de manière conditionnelle.
* La gestion de la logique applicative au sein des composants (méthodes de calcul, gestionnaires d'événements).
* La création et l'utilisation de **composants autonomes (Standalone Components)**, incluant l'import direct de modules nécessaires comme `CommonModule` et `FormsModule`.
* Une stratégie simple de **gestion de l'état** où les données sources sont maintenues dans le composant parent et modifiées via des références ou des événements.

## Fonctionnalités

L'application permet de :

1.  Afficher une liste de cours prédéfinis.
2.  Modifier le nombre d'étudiants pour chaque cours individuellement.
3.  Calculer et afficher dynamiquement le nombre total d'étudiants inscrits à tous les cours.
4.  Afficher un message conditionnel ("peu d'étudiants" ou "beaucoup d'étudiants") basé sur ce total.
5.  Modifier dynamiquement un titre principal de la page via un champ de saisie.

## Structure du Projet et Fonctionnement

Le projet s'articule autour de deux composants principaux et une interface de données :

### 1. Interface `Course`
   Définit la structure d'un objet cours.
   ```typescript
   // src/app/course/course.model.ts (exemple)
   export interface Course {
     titre: string;
     nb_etud: number;
   }
   ```

### 2. Composant Enfant : `CourseComponent` (`<app-course>`)
   * **Rôle :** Affiche les informations d'un seul cours et permet la modification de son nombre d'étudiants.
   * **Fichiers :** `course.component.ts`, `course.component.html`, `course.component.css`.
   * **Communication :**
        * **Entrée (`@Input`) :** Reçoit un objet `Course` de son parent via la propriété `contenu` (par exemple, `[contenu]="coursItem"`).
        * **Sortie (`@Output`) :** Émet un événement `newNb` (de type `EventEmitter<number>`) qui transporte la *différence* du nombre d'étudiants chaque fois que ce nombre est modifié dans l'input.
   * **Logique interne :**
        * Utilise `[(ngModel)]` sur un champ `<input type="number">` pour lier directement la saisie à la propriété `contenu.nb_etud`.
        * Une méthode (`onNbEtudChange` dans notre exemple) est déclenchée lors de la modification de l'input (via `(ngModelChange)`) pour calculer la différence par rapport à la valeur précédente et émettre l'événement `newNb`.

### 3. Composant Parent : `CoursesComponent` (`<app-courses>`)
   * **Rôle :** Gère la liste globale des cours (`UE`), affiche le titre principal, le nombre total d'étudiants et le message conditionnel ("beaucoup/peu").
   * **Fichiers :** `courses.component.ts`, `courses.component.html`, `courses.component.css`.
   * **Logique clé :**
        * **Source de Vérité :** Maintient un tableau `UE: Course[]` comme la source principale des données des cours.
        * **Affichage de la liste :** Utilise `*ngFor` pour itérer sur `UE` et instancier un composant `<app-course>` pour chaque cours.
        * **Passage de données à l'enfant :** Lie l'objet `cours` de l'itération à la propriété `[contenu]` de `<app-course>`.
        * **Écoute de l'enfant :** Écoute l'événement `(newNb)` émis par `<app-course>` et appelle une méthode (`onNewNb($event)`) pour réagir (par exemple, pour logger le changement).
        * **Calcul du Total :** La méthode `getTotalEtudiants()` recalcule la somme des `nb_etud` de tous les cours dans le tableau `UE`. **Important :** Comme les objets `Course` dans `UE` sont passés par référence à l'enfant, et que l'enfant modifie `nb_etud` sur cet objet via `[(ngModel)]`, le tableau `UE` dans le parent est **directement et automatiquement mis à jour**. Ainsi, `getTotalEtudiants()` a toujours accès aux données les plus récentes.
        * **Message Conditionnel :** La méthode `getMessageEtudiants()` utilise le résultat de `getTotalEtudiants()` pour déterminer si afficher "peu" ou "beaucoup" d'étudiants.
        * **Titre Principal :** Un champ `<input>` avec `[(ngModel)]` permet de modifier la propriété `titrePage` du composant, qui est affichée par interpolation.

### Flux de Données et Mises à Jour

1.  `CoursesComponent` initialise le tableau `UE`.
2.  `*ngFor` dans `courses.component.html` crée une instance de `CourseComponent` pour chaque élément de `UE`, en lui passant l'objet `cours` via `[contenu]`.
3.  Dans `CourseComponent`, l'utilisateur modifie le nombre d'étudiants dans l'input.
    * `[(ngModel)]` met à jour la propriété `nb_etud` de l'objet `contenu`. Puisque `contenu` est une référence à un objet dans le tableau `UE` du parent, **cette modification est immédiatement reflétée dans `UE` chez le parent.**
    * `(ngModelChange)` (ou une action similaire) dans `CourseComponent` déclenche l'émission de l'événement `(newNb)` avec la *différence* de comptage.
4.  `CoursesComponent` reçoit l'événement `(newNb)` via sa méthode `onNewNb()`.
5.  La détection de changement d'Angular s'exécute. Les expressions dans le template de `CoursesComponent`, comme `{{ getTotalEtudiants() }}` et `{{ getMessageEtudiants() }}`, sont réévaluées.
6.  `getTotalEtudiants()` parcourt le tableau `UE` (qui contient les valeurs à jour) et retourne le nouveau total.
7.  Le message "peu/beaucoup" et le total sont mis à jour dans l'interface utilisateur.

### Modules Importés (pour les composants autonomes)

* **`CommonModule`:** Nécessaire dans `CoursesComponent` (pour `*ngFor`, `*ngIf`) et `CourseComponent` (si `*ngIf` y est utilisé).
* **`FormsModule`:** Nécessaire dans `CoursesComponent` (pour `[(ngModel)]` sur `titrePage`) et `CourseComponent` (pour `[(ngModel)]` sur `contenu.nb_etud`).

## Comment Lancer le Projet (Exemple Standard)

1.  Assurez-vous d'avoir Node.js et Angular CLI installés.
2.  Clonez le dépôt (si c'en était un) ou copiez les fichiers du projet dans une nouvelle application Angular.
3.  Naviguez dans le dossier du projet : `cd nom-du-projet`
4.  Installez les dépendances (si ce n'est pas déjà fait par `ng new`) : `npm install`
5.  Lancez le serveur de développement : `ng serve -o`
    L'application sera généralement accessible sur `http://localhost:4200/`.

## Points Clés d'Apprentissage

En réalisant ce TP, vous devriez avoir une meilleure compréhension de :

* La création et l'utilisation de composants Angular.
* La communication entre composants (parent-enfant et enfant-parent).
* Les différentes techniques de liaison de données.
* L'affichage dynamique de listes et d'éléments conditionnels.
* L'importance de `FormsModule` pour les formulaires et `CommonModule` pour les directives de base dans les composants autonomes.
* Une approche simple pour gérer l'état des données dans une petite application.
```