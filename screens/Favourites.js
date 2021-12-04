
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import Constants from '../StoredData.js';
import { Button, Modal, Portal, Provider, Avatar } from 'react-native-paper';
import NavigationScreen from './NavigationScreen.js';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import CardHospital from '../components/CardHospital.js';
import Loading from '../components/Loading.js';

export default function Favourites({route, navigation}){


    return(
            <View>
                <Text>Favourites Screen</Text>
            </View>
    )
}