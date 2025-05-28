import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoursesComponent } from './courses/courses.component'; // <-- Vérifie bien ce chemin !


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CoursesComponent,
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-first-angular-app';
}
