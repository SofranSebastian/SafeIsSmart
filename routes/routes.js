import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HeatMap from "../screens/HeatMap"

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
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppMainStack;