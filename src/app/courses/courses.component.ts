import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course } from '../course/course';         // Modèle de données
import { CourseComponent } from '../course/course.component'; // Composant enfant

@Component({
  selector: 'app-courses', // Sélecteur pour <app-courses>
  standalone: true,
  imports: [
    CommonModule,      // Pour *ngFor, *ngIf, etc.
    FormsModule,       // Pour [(ngModel)] sur le titre principal
    CourseComponent    // Pour pouvoir utiliser <app-course> dans le template
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  titrePage: string = 'Liste des cours et nombre d\'étudiants'; // Titre principal de la page
  nb_etuds!: number;
  UE: Course[] = [
    { titre: 'Mathématiques (M1)', nb_etud: 2 },
    { titre: 'Physique (P1)', nb_etud: 3 },
    { titre: 'Informatique (I1)', nb_etud: 4 },
  ];

  // La propriété 'nb_etuds' (total stocké) n'est plus essentielle pour getMessageEtudiants()
  // si getMessageEtudiants() recalcule toujours à partir de UE.
  // On la retire pourtitrePage simplifier et suivre la stratégie de "source de vérité unique = UE".

  constructor() { }

  ngOnInit(): void {
    // Il n'est plus nécessaire d'initialiser un 'this.nb_etuds' séparé
    // si getMessageEtudiants se base sur getNbEtuds() qui lit UE.
    console.log('CoursesComponent initialisé. État initial de UE:', this.UE);
  }

  // Calcule et retourne le nombre total d'étudiants en parcourant UE.
  // C'est la méthode qui lit la "source de vérité" (this.UE).
  getTotalEtudiants(): number {
    let total = 0;
    if (this.UE && this.UE.length > 0) {
      for (const course of this.UE) {
        // S'assure que nb_etud est un nombre, utilise 0 si NaN ou undefined
        const etudiantsDansCeCours = Number(course.nb_etud) || 0;
        total += etudiantsDansCeCours;
      }
    }
    // console.log('Total étudiants recalculé (getTotalEtudiants):', total); // Pour déboguer
    return total;
  }

  // Détermine le message ("beaucoup" ou "peu") en se basant sur le total actuel.
  getMessageEtudiants(): string {
    const total = this.getTotalEtudiants(); // Utilise toujours le total frais calculé à partir de UE

    if (isNaN(total)) { // Devrait moins arriver avec Number(course.nb_etud) || 0
      return "Nombre d'étudiants en cours de calcul...";
    }

    return total >= 10 ? "beaucoup d'étudiants" : "peu d'étudiants";
  }

  // Méthode appelée lorsque l'enfant émet l'événement (newNb).
  // 'difference' est la variation du nombre d'étudiants pour UN cours.
  onNewNb(difference: number): void {
    console.log(`Un cours a changé son nombre d'étudiants de : ${difference}. Le total sera recalculé.`);
    // Pas besoin de : this.nb_etuds_total_stocke += difference;
    // car this.UE est déjà à jour (grâce à [(ngModel)] dans l'enfant qui modifie l'objet référé),
    // et getMessageEtudiants() utilise getTotalEtudiants() qui lit this.UE.
    // La détection de changement d'Angular s'occupera de rafraîchir l'affichage.
  }

  // Méthode pour modifier le titre principal (juste pour l'exemple)
  modifierTitrePage(): void {
    this.titrePage= 'Nouveau Titre pour la Page des Cours !';
  }
}