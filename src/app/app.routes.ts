import { Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component'; // Ta liste de cours
import { CourseDetailComponent } from './course-detail/course-detail.component'; // Ton nouveau composant
export const routes: Routes = [
     { path: 'courses', component: CoursesComponent }, // Route pour la liste des cours
  { path: 'cours/:id', component: CourseDetailComponent }, // Route pour le détail d'un cours
  //   ^^^^^^^^^^^ :id est un paramètre de route dynamique
  { path: '', redirectTo: '/courses', pathMatch: 'full' }, // Redirection par défaut
  // { path: '**', component: PageNotFoundComponent }, // Pour une page 404 (optionnel)
];
