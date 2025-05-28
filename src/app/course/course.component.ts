import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]
import { CommonModule } from '@angular/common'; // Pour les directives de base
import { Course } from './course'; // Importe l'interface

@Component({
  selector: 'app-course', // Sélecteur pour utiliser <app-course>
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Nécessaire pour [(ngModel)] dans le template de ce composant
  ],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() contenu!: Course; // Reçoit l'objet Course du parent
  @Output() newNb = new EventEmitter<number>(); // Émet la DIFFÉRENCE du nombre d'étudiants

  private lastNb!: number; // Pour stocker la valeur précédente de nb_etud

  constructor() { }

  ngOnInit(): void {
    // Initialise lastNb avec la valeur actuelle (ou 0 si invalide/undefined)
    // au chargement du composant.
    if (this.contenu) {
      this.lastNb = Number(this.contenu.nb_etud) || 0;
    } else {
      // Gérer le cas où contenu n'est pas fourni, si nécessaire
      this.lastNb = 0;
      // Initialiser this.contenu avec des valeurs par défaut pourrait être une option
      // this.contenu = { titre: 'Cours inconnu', nb_etud: 0 };
      console.error("CourseComponent: La propriété 'contenu' n'a pas été initialisée.");
    }
  }

  // Cette méthode est appelée quand la valeur de l'input (nb_etud) change
  onNbEtudChange(): void {
    const currentNbEtud = Number(this.contenu.nb_etud) || 0; // Valeur actuelle, convertie en nombre
    const difference = currentNbEtud - this.lastNb;

    // Émet la différence seulement si elle n'est pas nulle
    if (difference !== 0) {
      this.newNb.emit(difference);
    }

    this.lastNb = currentNbEtud; // Met à jour lastNb pour la prochaine comparaison
  }
}