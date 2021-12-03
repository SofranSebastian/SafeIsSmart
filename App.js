import React from 'react';

import { StyleSheet } from 'react-native';

import AppMainStack from './routes/routes';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const customFonts = {
  'normal-font' : require('./fonts/Inter-Regular.ttf'),
  'medium-font' : require('./fonts/Inter-Medium.ttf'),
  'bold-font' : require('./fonts/Inter-Bold.ttf'),
  'light-font' : require('./fonts/Inter-Light-BETA.ttf'),
};

export default class App extends React.Component {
  
  constructor(){
    super();

    this.state = {
      areFontsLoaded: false,
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync( customFonts );
    this.setState({ areFontsLoaded: true });
  }

  async componentDidMount(){
    this._loadFontsAsync();
  }

  render(){
    if( this.state.areFontsLoaded ){
      return(
        <AppMainStack />
      )
    }else{
      return(
        <AppLoading />
      )
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
