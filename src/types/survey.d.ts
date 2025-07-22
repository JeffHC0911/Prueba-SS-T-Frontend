// src/types/survey.d.ts (o donde definas tus tipos globales)

export interface Question {
  id?: string; // Opcional, si tienes IDs para preguntas
  type: 'text' | 'textarea' | 'number' | 'choice'; // Tipos de entrada que soportarás
  question: string; // El texto de la pregunta
  options?: string[]; // Obligatorio solo para type: 'choice'
  required?: boolean; // Opcional, si quieres manejar validación 'required'
  placeholder?: string; // Opcional
}

// Interfaz para la encuesta completa que se le pasa al modal de respuesta
// Asegúrate de que esta 'FullSurvey' se use en el función `getSurveyQuestions` de tu backend
// y en tu `dashboard` cuando asignes `selectedSurvey.value`
export interface FullSurvey {
  survey_id: string;
  title: string;
  description: string;
  questions: Question[]; // <-- AHORA ES UN ARRAY DE OBJETOS 'Question'
  // Puedes añadir otras propiedades de tu modelo de encuesta aquí
  status?: string;
  created_at?: string;
  updated_at?: string;
}
