export interface Course {
  id: number; // <-- AJOUTE CETTE LIGNE !
  titre: string;
  nb_etud: number;
  description?: string; // Si tu as ajouté une description, sinon ignore cette ligne
}
