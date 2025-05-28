import { Component, OnInit, OnDestroy } from '@angular/core'; // OnDestroy ajouté ici
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Course } from '../course/course';      // Modèle de données (chemin corrigé si besoin)
import { CourseComponent } from '../course/course.component'; // Composant enfant
import { CourseService } from '../course.service';    // Service pour obtenir les cours
import { Subscription } from 'rxjs';                  // Pour gérer la désinscription
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CourseComponent,
    RouterModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy { // Implémente OnDestroy
  titrePage: string = 'Liste des cours et nombre d\'étudiants';
  // nb_etuds!: number; // Commenté car on suit la stratégie de source de vérité unique = UE
  UE: Course[] = []; // Initialisé vide, sera rempli par le service

  isLoading: boolean = true; // <<--- CORRECTION PRINCIPALE : Initialiser à true

  private courseSubscription!: Subscription;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    console.log('CoursesComponent: ngOnInit - Début du chargement des cours...');
    // this.isLoading = true; // Plus nécessaire ici si initialisé à true dans la déclaration

    this.courseSubscription = this.courseService.getCourses().subscribe({
      next: (dataCourses) => {
        console.log('CoursesComponent: Données reçues!', dataCourses);
        this.UE = dataCourses;
        this.isLoading = false; // Cacher l'indicateur une fois les données reçues
      },
      error: (err) => {
        console.error('CoursesComponent: Erreur lors de la récupération des cours', err);
        this.isLoading = false; // Cacher aussi en cas d'erreur
        // Tu pourrais vouloir vider UE ou afficher un message d'erreur spécifique
        // this.UE = []; 
      },
      complete: () => {
        console.log('CoursesComponent: Observable des cours complété.');
      }
    });

    console.log('CoursesComponent: ngOnInit - Souscription effectuée, en attente des données...');
  }

  ngOnDestroy(): void {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
      console.log('CoursesComponent: Désinscrit de courseSubscription.');
    }
  }

  getTotalEtudiants(): number {
    let total = 0;
    if (this.UE && this.UE.length > 0) {
      for (const course of this.UE) {
        const etudiantsDansCeCours = Number(course.nb_etud) || 0;
        total += etudiantsDansCeCours;
      }
    }
    return total;
  }

  getMessageEtudiants(): string {
    // Gérer le cas où le chargement est toujours en cours pour le message
    if (this.isLoading) {
      return "Chargement des données des cours...";
    }

    const total = this.getTotalEtudiants();

    // Si après le chargement, UE est vide (ou total est 0 si aucun étudiant)
    if (this.UE.length === 0) {
        return "Aucun cours disponible."; // Ou un autre message approprié
    }
    
    // Si le total est NaN (ne devrait pas arriver avec la protection dans getTotalEtudiants)
    if (isNaN(total)) {
      return "Calcul du nombre d'étudiants invalide...";
    }

    return total >= 150 ? "beaucoup d'étudiants" : "peu d'étudiants";
  }

  onNewNb(difference: number): void {
    console.log(`Un cours a changé son nombre d'étudiants de : ${difference}. Le total affiché sera recalculé à partir de UE.`);
  }

  modifierTitrePage(): void {
    this.titrePage = 'Nouveau Titre pour la Page des Cours !';
  }
}