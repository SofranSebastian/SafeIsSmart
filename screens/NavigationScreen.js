import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import { Button, Modal, Portal, Provider, Icon } from 'react-native-paper';

export default function NavigationScreen({route, navigation}) {

    const {userLat, userLon, destLat, destLon} = route.params;
    const [currentPosition, setCurrentPosition] = useState({latitude:userLat, longitude:userLon});
    const [rotation, changeRotation] = useState(false);
    const [mode, setMode] = useState("DRIVING");
    const _map = useRef(null);

    return(
        <View style={styles.bigview}>
            <MapView
             ref={_map}
             style={styles.mapStyle}
             customMapStyle={MapThemes.customMapStyleDark}
             showsUserLocation={true}
             showsMyLocationButton={false}
             showsBuildings={false}
             onUserLocationChange={newLocation => (rotation === true && newLocation.nativeEvent.coordinate.speed > 1.0) ? (_map.current.animateCamera({center: newLocation.nativeEvent.coordinate, heading: newLocation.nativeEvent.coordinate.heading}), setCurrentPosition(newLocation.nativeEvent.coordinate)) : ( setCurrentPosition(newLocation.nativeEvent.coordinate) )}

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
          lineDashPattern={[0,0]}
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
          mode={mode}
        />

            </MapView>

            <View style={styles.navDetailsView}> 
            <Button icon="clock-outline" color={ "#0056F1"} backgroundColor='red'>5 min</Button>
              <Button icon="speedometer"  color={ "#0056F1"} >45.2 km/h</Button>
              <Button icon="navigation" color={ "#0056F1"} >168.7 km</Button>
            </View>
            <View style={styles.footer}>
              <Button icon="car" color={ mode ==="DRIVING" ? "#00DBFF":"#0056F1"} onPress={() => setMode('DRIVING')}>drive</Button>
              <Button icon="walk"  color={ mode ==="WALKING" ? "#00DBFF":"#0056F1"} onPress={() => setMode('WALKING')}>walk</Button>
              <Button icon="crosshairs-gps" color={ rotation === true ? "#00DBFF": "#0056F1"} onPress={() => (rotation === true ? _map.current.animateCamera({ zoom: 15, pitch: 0 }) : _map.current.animateCamera({ zoom: 18, pitch: 60 }), changeRotation(!rotation))}>center</Button>
            </View>
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
    },
    footer:{
      height:'7%', 
      width:'100%', 
      alignContent:'center',
      justifyContent:'space-evenly', 
      alignItems:'center',
      flexDirection:'row',
      position:'absolute',
      bottom:0,
      backgroundColor:'white'
    },
    navDetailsView:{
      height:'30%', 
      width:'30%', 
      alignContent:'flex-start',
      alignItems:'flex-start',
      justifyContent:'space-evenly', 
      flexDirection:'column',
      position:'absolute',
      top:'5%',
      right:'0%',
      backgroundColor: "#rgba(255,255,255,.7)",
      borderRadius:30
      

    }
  });