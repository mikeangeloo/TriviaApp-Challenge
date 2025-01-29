import {Image, StyleSheet, Text, View} from 'react-native';
import {TriviaForm} from '../components/TriviaForm';
import React, {useEffect} from 'react';
import {trivaStore} from '../store/trivia.store';
import {Loader} from '../components/Loader';

export const TriviaScreen = (): React.JSX.Element => {
  const isLoading = trivaStore(state => state.questionsLoader);
  const {setQuestionsLoader: setLoader} = trivaStore();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  }, [isLoading, setLoader]);

  return (
    <View style={styles.pageContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/img/brain.png')}
          style={styles.triviaLogo}
        />
      </View>

      <Text style={styles.title}>Triva App</Text>
      <Text style={styles.subtitle}>
        Fill out the fields of the following form and click on: "Get Questions
        to start the quiz."
      </Text>
      {isLoading ? <Loader /> : <TriviaForm />}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  logoContainer: {
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%',
  },
  triviaLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginLeft: '5%',
  },
  title: {
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    padding: 12,
    fontSize: 24,
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'justify',
    padding: 15,
  },
});
