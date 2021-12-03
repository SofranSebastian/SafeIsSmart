import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';




export default function HeatMap() {

const [date_gasite, setDate] = useState(false);
const [listaJudete, setListaJudete] = useState(Constants.listaJd);
const [userLat, setUserLat] = useState(0);
const [userLon, setUserLon] = useState(0);
const _map = useRef(null)

async function getUserLocation(){
  let {status} = await Location.requestForegroundPermissionsAsync();
  if(status !=='granted'){
    console.log("Nu aveti permisiune pentru locatie");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  setUserLat(location.coords.latitude);
  setUserLon(location.coords.longitude);
  // console.log("Locatie user: ", userLat, " ", userLon);
}

// am folosit api-ul  geolocation pentru a extrage lat si lon pt fiecare judet 
// async function getAndSetCountysLocation(){
//   let clonaJudete = listaJudete;
//   for(let i = 0; i < clonaJudete.length; i++){
//     let rez = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${clonaJudete[i].county}&key=AIzaSyBfNY8PLLAhERzcPK2aBt4rTp9MAMQ5gkQ`);
//     let jsonF = await rez.json();
//     clonaJudete[i]['location'] = jsonF.results[0].geometry.location;

//   }

//   setListaJudete(clonaJudete);
// }


async function getData(){

  getUserLocation();

  const responde = await fetch("https://covid19.geo-spatial.org/api/dashboard/getCasesByCounty");
  const jsonFormat = await responde.json();
  
  let newList = jsonFormat.data.data;
  for(let i=0; i < newList.length; i++){
    if(newList[i].county_code === "NA"){
      newList.splice(i,1);
    }
  }
  
  let cloneListForJudete = listaJudete;

  for(let i = 0; i < 39 ; i++){
    cloneListForJudete[i].total_county = newList[i].total_county;
    cloneListForJudete[i].total_dead = newList[i].total_dead;
    cloneListForJudete[i].total_healed = newList[i].total_healed;
  }
  
  setListaJudete(cloneListForJudete);

  // obtinere lat si lon pt fiecare judet si formatare lista pentru a adauga campurile respective
  // getAndSetCountysLocation();

  setDate(true);
}

useEffect(()=>{getData()},[date_gasite]);


  if(date_gasite === true){
  return (
    <View style={styles.bigview}>
      <MapView
        ref={_map}
        style={styles.mapStyle}
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

      {
        listaJudete.map(judet => (
          <MapView.Marker           coordinate= {{
            latitude: judet.location.lat,
            longitude: judet.location.lng
          }
          } 
          key={judet.county_code}
          pinColor='purple'
          title={judet.county}
          onPress={() => {console.log(judet.total_county, judet.total_healed, judet.total_dead)}}

          >

          </MapView.Marker>
        ))
      }



      </MapView>
    </View>
  );
}else{

  return (
    <View style={styles.bigview}>
      <Text>Se cauta datele</Text>
    </View>
  );

}


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
    alignSelf:'center'
  }
});
