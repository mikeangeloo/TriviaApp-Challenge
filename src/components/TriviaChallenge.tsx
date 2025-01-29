import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {trivaStore} from '../store/trivia.store';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';

interface QuizForm {
  questionId: string;
  question: string;
  response: string | undefined;
  correct_answer: string | undefined;
  questions: string[];
}

export const TriviaChallenge = (): React.JSX.Element => {
  const questions = trivaStore(state => state.questions);

  const navigation = useNavigation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({correct: 0, incorrect: 0});

  const defaultValues = questions.reduce((acc, question) => {
    acc[`qId-${question.id}`] = {
      questionId: `qId-${question.id}`,
      question: question.question?.replace(/&quot;/g, '"')!,
      response: undefined,
      correct_answer: question.correct_answer,
      questions: [
        ...question.incorrect_answers!,
        question.correct_answer!,
      ].sort(),
    };
    return acc;
  }, {} as Record<string, QuizForm>);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<{[key: string]: QuizForm}>({
    defaultValues,
  });

  const evaluatedQuestions = useMemo(() => {
    return questions.map(question => {
      const fieldName = `qId-${question.id}`;
      return {
        fieldName,
        question: question.question,
        correctAnswer: defaultValues[fieldName].correct_answer,
        options: defaultValues[fieldName].questions.map(answer => {
          return {
            answer,
            isCorrect: answer === defaultValues[fieldName].correct_answer,
          };
        }),
      };
    });
  }, [defaultValues, questions]);

  const onSubmit = (data: {[key: string]: QuizForm}) => {
    const unanswered = Object.values(data).some(q => !q.response);
    if (unanswered) {
      Alert.alert('Please answer all questions before submitting.');
      return;
    }

    let correct = 0;
    let incorrect = 0;

    Object.values(data).forEach(question => {
      if (question.response === question.correct_answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setScore({correct, incorrect});
    setIsSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Quiz of: {questions[0]?.category}</Text>

        {/* Show score if already evaluated */}
        {isSubmitted && (
          <Text style={styles.scoreText}>
            ✅ Correct: {score.correct} | ❌ Incorrect: {score.incorrect}
          </Text>
        )}

        {evaluatedQuestions.map(
          ({fieldName, question, correctAnswer, options}) => {
            return (
              <View key={fieldName} style={styles.card}>
                <Text style={styles.question}>{question}</Text>

                <Controller
                  name={`${fieldName}.response`}
                  control={control}
                  rules={{required: 'Select an answer.'}}
                  render={({field: {onChange, value}}) => (
                    <View>
                      {options.map(({answer, isCorrect}, i) => {
                        const isSelected = value === answer;
                        const userCorrect = isSelected && isCorrect;
                        const userIncorrect = isSelected && !isCorrect;

                        return (
                          <TouchableOpacity
                            key={i}
                            style={[
                              styles.option,
                              isSelected && styles.selectedOption,
                              isSubmitted &&
                                userCorrect &&
                                styles.correctOption,
                              isSubmitted &&
                                userIncorrect &&
                                styles.incorrectOption,
                            ]}
                            onPress={() => !isSubmitted && onChange(answer)}
                            disabled={isSubmitted}>
                            <Text style={styles.optionText}>
                              {answer} {isSubmitted && userCorrect && '✔️'}
                              {isSubmitted && userIncorrect && '❌'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}

                      {/* Show the correct answer if you missed it */}
                      {isSubmitted && value !== correctAnswer && (
                        <Text style={styles.correctAnswer}>
                          Respuesta correcta: {correctAnswer} ✅
                        </Text>
                      )}
                    </View>
                  )}
                />
                {!isSubmitted && errors[fieldName]?.response && (
                  <Text style={styles.errorText}>
                    {errors[fieldName]?.response.message}
                  </Text>
                )}
              </View>
            );
          },
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!isSubmitted ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>Submit Responses</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.navigate('trivia-form')}>
            <Text style={styles.returnButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {flexGrow: 1, padding: 20, paddingBottom: 100},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 15},
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  question: {fontSize: 18, marginBottom: 10, fontWeight: '600'},
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
  },
  selectedOption: {backgroundColor: '#007BFF', borderColor: '#007BFF'},
  correctOption: {backgroundColor: '#54b859', borderColor: '#54b859'},
  incorrectOption: {
    borderColor: '#ae180e',
    borderWidth: 2,
  },
  optionText: {fontSize: 16, textAlign: 'center'},
  correctAnswer: {color: 'green', fontWeight: 'bold', marginTop: 5},
  errorText: {color: 'red', fontSize: 14, marginTop: 5, fontWeight: 'bold'},
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  returnButton: {
    backgroundColor: '#243147',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  returnButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
