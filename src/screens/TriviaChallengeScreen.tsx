import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {trivaStore} from '../store/trivia.store';
import {TriviaChallenge} from '../components/TriviaChallenge';
import {useNavigation} from '@react-navigation/native';

export const TriviaChallengeScreen = (): React.JSX.Element => {
  const isLoading = trivaStore(state => state.loader);
  const {setLoader} = trivaStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoading) {
      console.log('🚀 ~ useEffect ~ isLoading:', isLoading);
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  }, [isLoading, setLoader]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Trivia Challenge</Text>
      <TriviaChallenge />
    </View>
  );
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
    width: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    top: 20,
    left: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
