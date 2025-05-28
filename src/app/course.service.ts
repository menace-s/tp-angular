import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'; // HttpParams ajouté
import { Observable, throwError } from 'rxjs'; // throwError est utile pour la gestion d'erreurs.
import { catchError, tap, delay } from 'rxjs/operators'; // delay n'est plus nécessaire si tu fais un vrai appel HTTP, mais tap et catchError sont utiles.
import { Course } from './course/course'; // Assure-toi que ce chemin est correct.

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // Décommente et adapte cette URL pour pointer vers ton script PHP.
  // EXEMPLE : Si ton PHP est servi localement sur le port 8000 dans un dossier api:
  // private coursesUrl = 'http://localhost:8000/api/getCourses.php';
  // OU si tu utilises un proxy Angular (dans angular.json ou proxy.conf.json) :
  private coursesUrl = 'http://localhost/api/getCourses.php'; // À MODIFIER SELON TA CONFIGURATION EXACTE
private baseUrl = 'http://localhost/api/';
  // Les données codées en dur ne sont plus la source principale.
  // private mesCours: Course[] = [
  //   { titre: 'Mathématiques (via Observable)', nb_etud: 5 },
  //   { titre: 'Physique (via Observable)', nb_etud: 8 },
  //   { titre: 'Informatique (via Observable)', nb_etud: 12 }
  // ];

  // 1. Injecte HttpClient dans le constructeur
  constructor(private http: HttpClient) { }

  // 2. Modifie getCourses pour utiliser HttpClient
  getCourses(): Observable<Course[]> {
    console.log(`CourseService: Appel HTTP GET vers ${this.coursesUrl}`);
    
    return this.http.get<Course[]>(this.coursesUrl) // Fait la requête HTTP GET
      .pipe(
        // Le 'delay' n'est plus nécessaire ici car la latence sera celle du réseau/serveur.
        // Tu peux le supprimer ou le garder si tu veux ajouter un délai artificiel pour des tests.
        // delay(1000), 
        tap(data => console.log('CourseService: Données reçues via HTTP:', data)), // Utile pour le débogage
        catchError(this.handleError) // Gère les erreurs de la requête HTTP
      );
  }


  // Nouvelle méthode pour récupérer un cours par son ID
  getCourseById(id: number): Observable<Course> {
    // Crée un objet HttpParams pour ajouter 'id' à la requête
    const params = new HttpParams().set('id', id.toString());

    const url = `${this.baseUrl}/getCourseById.php`; // URL du nouveau script PHP
    console.log(`CourseService: Appel HTTP GET vers ${url} avec ID: ${id}`);

    return this.http.get<Course>(url, { params: params }) // Ajoute l'objet params à la requête
      .pipe(
        tap(data => console.log(`CourseService: Données (cours ID: ${id}) reçues:`, data)),
        catchError(this.handleError)
      );
  }
  // 3. Ajoute une méthode pour la gestion des erreurs (si tu ne l'avais pas déjà)
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue lors de la requête HTTP.';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (navigateur) ou problème réseau.
      errorMessage = `Erreur client/réseau : ${error.error.message}`;
    } else {
      // Le backend a retourné un code d'erreur (par exemple 404, 500, etc.).
      errorMessage = `Erreur serveur (code ${error.status}) : ${error.message}`;
      // Tu peux essayer d'extraire plus de détails de error.error si ton API PHP en renvoie
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage += ` - Message API: ${error.error.message}`;
      } else if (error.error && typeof error.error === 'string' && error.error.length < 200) { // Pour éviter d'afficher des pages HTML d'erreur entières
        errorMessage += ` - Détail API: ${error.error}`;
      }
    }
    console.error('CourseService (handleError):', errorMessage, error); // Log l'erreur complète pour le débogage.
    return throwError(() => new Error(errorMessage)); // Retourne un Observable qui émet l'erreur pour que le composant puisse la gérer.
  }
}