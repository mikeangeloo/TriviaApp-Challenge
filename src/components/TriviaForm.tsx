import {Picker} from '@react-native-picker/picker';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {getTrivia} from '../services/trivia.service';
import {TriviaData} from '../models/trivia-data.type';
import {trivaStore} from '../store/trivia.store';
import {useNavigation} from '@react-navigation/native';

interface FormInputs extends TriviaData {}

export const TriviaForm = (): React.JSX.Element => {
  const {setQuestions, setLoader} = trivaStore();
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

  const onSubmit = async (data: FormInputs) => {
    const {amount, category, difficulty, type} = data;
    console.log(
      '🚀 ~ onSubmit ~ amount, category, difficulty, type:',
      amount,
      category,
      difficulty,
      type,
    );
    try {
      setLoader(true);
      const response = await getTrivia(data);
      setLoader(false);
      if (response.response_code === 0) {
        setQuestions(response.results ?? []);
        Alert.alert('Éxito', 'Preguntas obtenidas correctamente.');
        navigation.navigate('trivia-challenge');
      } else {
        Alert.alert(
          'Error',
          'No se encontraron preguntas, intenta en unos minutos.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema, intenta nuevamente en unos minutos.',
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cantidad de preguntas:</Text>
      <Controller
        name="amount"
        control={control}
        rules={{required: 'Este campo es obligatorio', min: 1}}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            placeholder="Ej: 10"
          />
        )}
      />
      {errors.amount && (
        <Text style={styles.errorText}>{errors.amount.message}</Text>
      )}

      <Text style={styles.label}>Categoría:</Text>
      <Controller
        name="category"
        control={control}
        rules={{required: 'Selecciona una categoría'}}
        render={({field: {onChange, value}}) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}>
            <Picker.Item label="Selecciona una categoría" value="" />
            <Picker.Item label="General Knowledge" value="9" />
            <Picker.Item label="Entertainment: Books" value="10" />
            <Picker.Item label="Science & Nature" value="17" />
          </Picker>
        )}
      />
      {errors.category && (
        <Text style={styles.errorText}>{errors.category.message}</Text>
      )}

      <Text style={styles.label}>Dificultad:</Text>
      <Controller
        name="difficulty"
        control={control}
        rules={{required: 'Selecciona una dificultad'}}
        render={({field: {onChange, value}}) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}>
            <Picker.Item label="Selecciona una dificultad" value="" />
            <Picker.Item label="Fácil" value="easy" />
            <Picker.Item label="Media" value="medium" />
            <Picker.Item label="Difícil" value="hard" />
          </Picker>
        )}
      />
      {errors.difficulty && (
        <Text style={styles.errorText}>{errors.difficulty.message}</Text>
      )}

      <Text style={styles.label}>Tipo de preguntas:</Text>
      <Controller
        name="type"
        control={control}
        rules={{required: 'Selecciona el tipo de pregunta'}}
        render={({field: {onChange, value}}) => (
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}>
            <Picker.Item label="Selecciona un tipo" value="" />
            <Picker.Item label="Opción múltiple" value="multiple" />
            <Picker.Item label="Verdadero/Falso" value="boolean" />
          </Picker>
        )}
      />
      {errors.type && (
        <Text style={styles.errorText}>{errors.type.message}</Text>
      )}

      <Button title="Obtener preguntas" onPress={handleSubmit(onSubmit)} />
    </View>
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
});
