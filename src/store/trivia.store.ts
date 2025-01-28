import {create} from 'zustand';
import {TriviaData} from '../models/trivia-data.type';

interface TriviaState {
  loader: boolean;
  setLoader: (loader: boolean) => void;

  questions: TriviaData[];
  setQuestions: (questions: TriviaData[]) => void;
}

export const trivaStore = create<TriviaState>()(set => ({
  questions: [],
  setQuestions: (questions: TriviaData[]) => set({questions}),

  loader: false,
  setLoader: (loader: boolean) => set({loader}),
}));
