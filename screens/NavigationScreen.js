import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import { Button, Modal, Portal, Provider } from 'react-native-paper';

export default function NavigationScreen({route, navigation}) {

    const {userLat, userLon, destLat, destLon} = route.params;
    const [currentPosition, setCurrentPosition] = useState({latitude:userLat, longitude:userLon});
    const _map = useRef(null);

    return(
        <View style={styles.bigview}>
            <MapView
             ref={_map}
             style={styles.mapStyle}
             showsUserLocation={true}
             showsMyLocationButton={false}
             showsBuildings={false}
             onUserLocationChange={newLocation => newLocation.nativeEvent.coordinate.speed > 1.0 ? (_map.current.animateCamera({center: newLocation.nativeEvent.coordinate, heading: newLocation.nativeEvent.coordinate.heading}), setCurrentPosition(newLocation.nativeEvent.coordinate)) : ( setCurrentPosition(newLocation.nativeEvent.coordinate) )}

             initialCamera={{
               center: {
                 latitude: userLat,
                 longitude: userLon
               },
               zoom: 10,
               heading: 0,
               pitch: 0,
               altitude: 1000
             }
           }
            >

        <MapViewDirections
          lineDashPattern={[0]}
          origin={currentPosition}
          destination={{
              latitude:destLat,
              longitude:destLon
          }}
          apikey={Constants.apiKey}
          strokeColor={"#0056F1"}
          strokeWidth={5}
          precision="high"
          timePrecision="now"
          resetOnChange={false}
          mode={'DRIVING'}
        />

            </MapView>
        </View> 
    )
}

const styles = StyleSheet.create({
    bigview: {
      width:'100%', 
      height:'100%',
      flexDirection:'column'
    },
    mapStyle: {
      width:'100%', 
      height:'100%', 
      alignSelf:'center',
      zIndex:-1
    }
  });