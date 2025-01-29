import {Picker} from '@react-native-picker/picker';
import React, {useCallback, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {getCategories, getTrivia} from '../services/trivia.service';
import {TriviaData} from '../models/trivia-data.type';
import {trivaStore} from '../store/trivia.store';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

interface FormInputs extends TriviaData {}

export const TriviaForm = (): React.JSX.Element => {
  const {
    questions,
    categories,
    categoriesLoader,
    setQuestions,
    setQuestionsLoader,
    setCategories,
    setCategoriesLoader,
  } = trivaStore();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormInputs>({
    defaultValues: {
      amount: undefined,
      category: undefined,
      difficulty: '',
      type: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (questions.length > 0) {
        setQuestions([]);
      }
    }, [questions, setQuestions]),
  );

  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
  }, []);

  const loadCategories = async (): Promise<void> => {
    setCategoriesLoader(true);
    const categoriesResponse = await getCategories();
    setCategories(categoriesResponse);
    setCategoriesLoader(false);
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      setQuestionsLoader(true);
      const response = await getTrivia(data);
      setQuestionsLoader(false);
      if (response.response_code === 0) {
        setQuestions(response.results ?? []);
        Alert.alert('Success', 'Questions obtained correctly.');
        navigation.navigate('trivia-challenge');
      } else {
        Alert.alert('Error', 'No questions found, try in a few minutes.');
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem, try again in a few minutes.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Number of questions:</Text>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'This field is required',
          min: {value: 1, message: 'The value must be greater than 1.'},
          max: {value: 50, message: 'The value cannot be greater than 50.'},
        }}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            placeholder="Ex: 10"
          />
        )}
      />
      {errors.amount && (
        <Text style={styles.errorText}>{errors.amount.message}</Text>
      )}

      <Text style={styles.label}>Category:</Text>
      <Controller
        name="category"
        control={control}
        rules={{required: 'Select a category'}}
        render={({field: {onChange, value}}) => {
          return categoriesLoader ? (
            <ActivityIndicator style={styles.loaderIndicator} size="large" />
          ) : (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
              onFocus={Keyboard.dismiss}>
              <Picker.Item label="SSelect a category" value="" />
              {categories.map(category => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          );
        }}
      />
      {errors.category && (
        <Text style={styles.errorText}>{errors.category.message}</Text>
      )}

      <Text style={styles.label}>Difficulty:</Text>
      <Controller
        name="difficulty"
        control={control}
        rules={{required: 'Select a difficulty'}}
        render={({field: {onChange, value}}) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
            onFocus={Keyboard.dismiss}>
            <Picker.Item label="Select a difficulty" value="" />
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>
        )}
      />
      {errors.difficulty && (
        <Text style={styles.errorText}>{errors.difficulty.message}</Text>
      )}

      <Text style={styles.label}>Type of questions:</Text>
      <Controller
        name="type"
        control={control}
        rules={{required: 'Select the type of question'}}
        render={({field: {onChange, value}}) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
            onFocus={Keyboard.dismiss}>
            <Picker.Item label="Select a type" value="" />
            <Picker.Item label="Multiple choice" value="multiple" />
            <Picker.Item label="True/False" value="boolean" />
          </Picker>
        )}
      />
      {errors.type && (
        <Text style={styles.errorText}>{errors.type.message}</Text>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitText}>Start Quiz 🚀</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  loaderIndicator: {
    flex: 1,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    margin: 'auto',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
