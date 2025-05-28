import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importe ActivatedRoute, Router et RouterModule (pour routerLink dans le template)
import { CommonModule } from '@angular/common'; // Pour *ngIf, etc.
import { Subscription } from 'rxjs';

import { Course } from '../course/course'; // Adapte le chemin vers ton modèle
import { CourseService } from '../course.service'; // Adapte le chemin vers ton service

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule pour [routerLink] si besoin dans CE template
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | undefined; // Pour stocker les données du cours récupéré
  isLoading: boolean = true;
  errorMessage: string = '';
  private routeSubscription!: Subscription;
  private courseSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres de la route
    private courseService: CourseService, // Pour récupérer les données du cours
    private router: Router // Optionnel: pour naviguer par programmation (ex: bouton retour)
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    // S'abonner aux changements de paramètres de la route
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id'); // Récupère le paramètre 'id' de l'URL (c'est une chaîne)
      if (idParam) {
        const courseId = +idParam; // Convertit la chaîne en nombre avec le '+'
        if (!isNaN(courseId)) {
          this.fetchCourseDetails(courseId);
        } else {
          this.errorMessage = "ID de cours invalide dans l'URL.";
          this.isLoading = false;
        }
      } else {
        this.errorMessage = "Aucun ID de cours fourni dans l'URL.";
        this.isLoading = false;
      }
    });
  }

  fetchCourseDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = ''; // Réinitialise le message d'erreur
    this.courseSubscription = this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Erreur lors de la récupération du cours : ${err.message || err}`;
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']); // Navigue vers la liste des cours
  }

  ngOnDestroy(): void {
    // Très important de se désinscrire pour éviter les fuites de mémoire
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
  }
}