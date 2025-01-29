export interface TriviaData {
  id: number;
  type: string;
  difficulty: string;
  category: string | undefined;
  amount?: string | undefined;
  question?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
}
