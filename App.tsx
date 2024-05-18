/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navegacion } from './src/Navegacion/Navegacion';
import AppProvider from './src/Contexto/AppContext';
function App(): React.JSX.Element {


  return (
    <NavigationContainer>
      <AppProvider>
        <Navegacion />
      </AppProvider>
    </NavigationContainer>
  );
}



export default App;
