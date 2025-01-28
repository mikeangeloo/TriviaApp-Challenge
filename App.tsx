/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TriviaScreen} from './src/screens/TriviaScreen';
import {TriviaChallengeScreen} from './src/screens/TriviaChallengeScreen';
import {RootStackParamList} from './src/models/stack-param-list.type';

const Stack = createNativeStackNavigator<RootStackParamList>();
enableScreens(true);

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={backgroundStyle.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundStyle.statusBar.backgroundColor}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="trivia-form">
          <Stack.Screen
            options={{headerShown: false}}
            name="trivia-form"
            component={TriviaScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="trivia-challenge"
            component={TriviaChallengeScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

const backgroundStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: Colors.darker,
  },
});
