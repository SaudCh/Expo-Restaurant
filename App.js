import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import Navigator from './components/navigator'
import itemReducer from './store/reducers/item'

const Reducers = combineReducers({
  cart: itemReducer
})

const store = createStore(Reducers);


const fetchFonts = () => {
  return Font.loadAsync({
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    'Ballon': require('./assets/font/balloons.ttf'),
    'Milla': require('./assets/font/mila.otf'),

  })
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    )
  }
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>

  );
}

const styles = StyleSheet.create({
});
