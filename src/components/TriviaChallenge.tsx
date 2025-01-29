import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {trivaStore} from '../store/trivia.store';
import {Controller, useForm} from 'react-hook-form';

interface QuizForm {
  questionId: string;
  question: string;
  response: string | undefined;
  correct_answer: string | undefined;
  questions: string[];
}

export const TriviaChallenge = (): React.JSX.Element => {
  const questions = trivaStore(state => state.questions);
  console.log('🚀 ~ questions:', questions);

  const defaultValues = questions.reduce((acc, question) => {
    acc[`qId-${question.id}`] = {
      questionId: `qId-${question.id}`,
      question: question.question?.replace(/&quot;/g, '"')!,
      response: undefined,
      correct_answer: question.correct_answer,
      questions: [
        ...question.incorrect_answers!,
        question.correct_answer!,
      ].sort(), // 🔥 Mezcla respuestas
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
  console.log('🚀 ~ defaultValues:', defaultValues);

  console.log('🚀 ~ errors:', errors);

  const onSubmit = (data: {[key: string]: QuizForm}) => {
    console.log('📌 Respuestas enviadas:', data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Quiz of: {questions[0]?.category}</Text>

        {questions.map(question => {
          const fieldName = `qId-${question.id}`;
          return (
            <View key={question.id} style={styles.card}>
              <Text style={styles.question}>{question.question}</Text>

              <Controller
                name={`${fieldName}.response`}
                control={control}
                rules={{required: 'Selecciona una respuesta.'}}
                render={({field: {onChange, value}}) => (
                  <View>
                    {defaultValues[fieldName].questions.map((answer, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.option,
                          value === answer && styles.selectedOption,
                        ]}
                        onPress={() => onChange(answer)}>
                        <Text style={styles.optionText}>{answer}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors[fieldName]?.response && (
                <Text style={styles.errorText}>
                  {errors[fieldName]?.response.message}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* ✅ Botón fijo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitText}>Enviar Respuestas</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Espacio extra para que el último elemento no quede escondido
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});
