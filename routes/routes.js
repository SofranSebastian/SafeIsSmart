import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationScreen from '../screens/NavigationScreen.js';

import HeatMap from "../screens/HeatMap"
import Hospitals from '../screens/Hospitals.js';

const MainStack = createNativeStackNavigator();

function AppMainStack() {
    return(
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen   name = "HeatMap"
                                    component = { HeatMap }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown: false,
                                        })
                                    }

                />
                <MainStack.Screen   name = "NavigationScreen"
                                    component = { NavigationScreen }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown: false,
                                        })
                                    }

                />   
                <MainStack.Screen   name = "Hospitals"
                                    component = { Hospitals }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown: false,
                                        })
                                    }

                />              
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppMainStack;