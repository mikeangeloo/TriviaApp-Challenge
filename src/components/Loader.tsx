import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export const Loader = (): React.JSX.Element => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator style={styles.loaderIndicator} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loaderIndicator: {
    flex: 1,
  },
});
