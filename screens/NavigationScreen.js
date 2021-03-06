import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import { Button, Avatar, IconButton } from 'react-native-paper';
import {Audio} from 'expo-av';
import Loading from '../components/Loading.js';



export default function NavigationScreen({route, navigation}) {

    const {userLat, userLon, destLat, destLon, destName} = route.params;
    const [soundLoaded, setSoundLoaded] = useState(false);
    const [soundObj, setSoundObj] = useState(new Audio.Sound);
    const [currentPosition, setCurrentPosition] = useState({latitude:userLat, longitude:userLon});
    const [rotation, changeRotation] = useState(false);
    const [mode, setMode] = useState("DRIVING");
    const [speed, changeSpeed] = useState(0);
    const [distance, changeDistance] = useState(0);
    const [time, changeTime] = useState(0);
    const _map = useRef(null);

    function checkPos(userLat,userLon){

      let dangerList = Constants.danger4;


      for(let i=0; i<dangerList.length; i++){
        let newLat = dangerList[i].latitude.toFixed(3); 
       let  newLon = dangerList[i].longitude.toFixed(3);
        if(userLat === newLat && userLon === newLon){
          soundObj.playAsync();
          setSoundObj(new Audio.Sound);
        }
      }
    }


    useEffect(() => {
      async function loadSounds() {
      await soundObj.loadAsync(require('../assets/warning.mp3'))
      setSoundLoaded(true);
      }
      
      loadSounds();
      }, [soundObj])


        if(soundLoaded === true) {
    return(
        <View style={styles.bigview}>
            <MapView
             ref={_map}
             style={styles.mapStyle}
             customMapStyle={MapThemes.customMapStyleDark}
             showsUserLocation={true}
             showsMyLocationButton={false}
             showsBuildings={false}
             onUserLocationChange={newLocation => (rotation === true && newLocation.nativeEvent.coordinate.speed > 1.0) ? 
              (_map.current.animateCamera({center: newLocation.nativeEvent.coordinate, heading: newLocation.nativeEvent.coordinate.heading}), 
              setCurrentPosition(newLocation.nativeEvent.coordinate), 
              changeSpeed(newLocation.nativeEvent.coordinate.speed),
              checkPos(newLocation.nativeEvent.coordinate.latitude.toFixed(3), newLocation.nativeEvent.coordinate.longitude.toFixed(3))) : 
              ( setCurrentPosition(newLocation.nativeEvent.coordinate), 
              changeSpeed(newLocation.nativeEvent.coordinate.speed),
              checkPos(newLocation.nativeEvent.coordinate.latitude.toFixed(3), newLocation.nativeEvent.coordinate.longitude.toFixed(3)) )}

             initialCamera={{
               center: {
                 latitude: userLat,
                 longitude: userLon
               },
               zoom: 14,
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
          onReady={result => {
            changeDistance(result.distance)
            changeTime(result.duration)
          }}
        />

        <MapView.Marker 
        coordinate={{latitude: destLat, longitude: destLon}}
        title = {destName}
        key = {destLat}
        >
          <Image source={require('../assets/destination_icon.png')} style={{width:25, height:25}} resizeMode="contain" />
          </MapView.Marker>

        {
          Constants.danger.map((item) => (
            <MapView.Marker
            coordinate={{
              latitude:item.latitude,
              longitude:item.longitude
            }}
            title={"Dangerous point"}
            key={item.latitude}>
              <Image source={require('../assets/dangerous_point.png')} style={{width:25, height:25}}/>
            </MapView.Marker>
          )
          )
        }

            </MapView>
            <View style={styles.viewInfoNavigationDialog}>
              <View style={styles.viewHeaderInfoNav}>
                <View style={styles.infoNavBuildingIcon}>
                  <Avatar.Icon icon="hospital-building" color={ 'white'}  backgroundColor={"#094AA8"} size={50} style={{borderRadius:5}} />
                  <Text style={styles.infoNavText}>
                    {destName}
                  </Text>
                </View>
                <IconButton   mode='contained' icon='close-circle-outline' color={"white"} size={25} style={{backgroundColor:"#094AA8"}}
                          onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'HeatMap' }]
                       })}
                />
              </View>
              <View style={styles.infoNavSeparator}></View>
              <View style={styles.infoNavDetails}>
                <View style={styles.infoNavComponent}>
                  <Avatar.Icon icon="clock-outline" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                  <View style={{marginLeft:'5%'}}>
                    <Text style={styles.infoNavContentText} >
                      {time > 60 ? (time/60).toFixed(1)  + ' H' : time.toFixed(1) + " mins"} 
                    </Text>
                    <Text style={styles.infoNavDescriptionText} >Time</Text>
                  </View>
                </View>
                <View style={styles.infoNavComponent}>
                  <Avatar.Icon icon="speedometer" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                  <View style={{marginLeft:'5%'}}>
                    <Text style={styles.infoNavContentText} >
                      {parseInt(speed*3.6)} KM/H
                    </Text>
                    <Text style={styles.infoNavDescriptionText} >Current speed</Text>
                  </View>
                </View>
                <View style={styles.infoNavComponent}>
                  <Avatar.Icon icon="navigation" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                  <View style={{marginLeft:'5%'}}>
                    <Text style={styles.infoNavContentText} >
                      {distance.toFixed(1)} KM
                    </Text>
                    <Text style={styles.infoNavDescriptionText} >Distance</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoNavSeparator}></View>

              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <Button icon="car" color={ mode ==="DRIVING" ? "#00DBFF":"#094AA8"} onPress={() => {setMode('DRIVING')}}>drive</Button>
                <Button icon="walk"  color={ mode ==="WALKING" ? "#00DBFF":"#094AA8"} onPress={() => setMode('WALKING')}>walk</Button>
                <Button icon="crosshairs-gps" color={ rotation === true ? "#00DBFF": "#094AA8"} onPress={() => (rotation === true ? _map.current.animateCamera({ zoom: 15, pitch: 0 }) : _map.current.animateCamera({ zoom: 18, pitch: 60 }), changeRotation(!rotation))}>center</Button>
              </View>
            </View>
        </View> 
    )
                      } 
                      else
                      {
                        return(
                          <View style={styles.viewLoadingScreen}>
                            <Loading isDataLoading={true}/>
                            <Text style={styles.textLoadingScreen}>
                                Loading
                            </Text>
                        </View>
                        )
                      }
}

const styles = StyleSheet.create({
  viewLoadingScreen:{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'},
  textLoadingScreen:{fontSize:20, fontFamily:'bold-font', textAlign:'center', color:'#094AA8', marginTop:'5%', padding:10},
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
      

    },
    viewInfoNavigationDialog:{
      position:'absolute',
      bottom:10,
      backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
          width: 4,
          height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,

      elevation: 3,
      width:'96%',
      marginHorizontal:'2%',
      height:200,
      borderRadius:20
},
viewHeaderInfoNav:{ marginHorizontal:"5%", marginTop:'5%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
infoNavBuildingIcon:{flexDirection:'row', flex:0.7, alignItems:'center'},
infoNavText:{fontSize:14, fontFamily:'bold-font', color:"#094AA8", marginLeft:'2%'},
infoNavSeparator:{borderWidth:0.5, borderColor:'#EAEBED', width:'90%', marginHorizontal:'5%', marginTop:'2%'},
infoNavContentText:{fontSize:12, fontFamily:'bold-font', color:"#094AA8"},
infoNavDescriptionText:{fontSize:10, fontFamily:'normal-font', color:"#094AA8"},
infoNavDetails:{flexDirection:'row', justifyContent:'space-around', marginVertical:'2%'},
infoNavComponent:{flexDirection:'row', alignItems:'center'}
  });