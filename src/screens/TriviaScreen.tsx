import {StyleSheet, Text, View} from 'react-native';
import {TriviaForm} from '../components/TriviaForm';
import React, {useEffect} from 'react';
import {trivaStore} from '../store/trivia.store';
import {Loader} from '../components/Loader';

export const TriviaScreen = (): React.JSX.Element => {
  const isLoading = trivaStore(state => state.loader);
  const {setLoader} = trivaStore();

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
      <Text style={styles.title}>Triva App</Text>
      {isLoading ? <Loader /> : <TriviaForm />}
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
});
