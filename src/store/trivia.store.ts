import {create} from 'zustand';
import {TriviaCategory, TriviaData} from '../models/trivia-data.type';

interface TriviaState {
  questionsLoader: boolean;
  setQuestionsLoader: (questionsLoader: boolean) => void;

  questions: TriviaData[];
  setQuestions: (questions: TriviaData[]) => void;

  categoriesLoader: boolean;
  setCategoriesLoader: (categoriesLoader: boolean) => void;

  categories: TriviaCategory[];
  setCategories: (categories: TriviaCategory[]) => void;
}

export const trivaStore = create<TriviaState>()(set => ({
  questions: [],
  setQuestions: (questions: TriviaData[]) => set({questions}),

  questionsLoader: false,
  setQuestionsLoader: (questionsLoader: boolean) => set({questionsLoader}),

  categories: [],
  setCategories: (categories: TriviaCategory[]) => set({categories}),

  categoriesLoader: false,
  setCategoriesLoader: (categoriesLoader: boolean) => set({categoriesLoader}),
}));
