import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {trivaStore} from '../store/trivia.store';

export const TriviaChallenge = (): React.JSX.Element => {
  const questions = trivaStore(state => state.questions);
  console.log('🚀 ~ questions:', questions);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas obtenidas:</Text>
      <FlatList
        data={questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  question: {
    fontSize: 16,
  },
});
