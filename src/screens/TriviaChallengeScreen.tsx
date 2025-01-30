import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {TriviaChallenge} from '../components/TriviaChallenge';
import {useNavigation} from '@react-navigation/native';
import {trivaStore} from '../store/trivia.store';

export const TriviaChallengeScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const {questions} = trivaStore();

  if (questions.length === 0) {
    navigation.goBack();
    return <></>;
  } else {
    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>➜</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trivia Challenge</Text>
        <TriviaChallenge />
      </>
    );
  }
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    padding: 12,
    fontSize: 24,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    top: 20,
    left: 10,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    position: 'relative',
  },
  backText: {
    marginTop: Platform.OS === 'android' ? 5 : 0,
    fontSize: 26,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
  },
});
