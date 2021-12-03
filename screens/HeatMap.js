import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import ModalCountyDetail from '../components/ModalCountyDetail.js';
import { Button, Modal, Portal, Provider } from 'react-native-paper';





export default function HeatMap() {


  const [visible, setVisible] = useState(false);
  

const hideModal = () => setVisible(false);
const showModal = () => setVisible(true);

const [data_for_modal, setDataForModal] = useState({});
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
//     let rez = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${clonaJudete[i].county}&key=AIzaSyD1sWqK616lW_M7oqHgBK4yRzhfgd1neoA`);
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

function prepareDataForModal(judet){
  let judetDataObj = {};

  judetDataObj.total_county = judet.total_county;
  judetDataObj.total_dead = judet.total_dead;
  judetDataObj.total_healed = judet.total_healed;

  setDataForModal(judetDataObj);
  
  setTimeout(()=>{},1000);

  showModal(true);
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
          title={judet.county}
          onPress={() => prepareDataForModal(judet)}

          >
            <View style={{  backgroundColor:`rgba(50, 0,${judet.total_county%200}, 1)`, 
                            height:20,
                            width:20,
                            borderRadius:30,
                           }}
            >
              
            </View>
          </MapView.Marker>
        ))
      }



      </MapView>
      <Provider>
        <Portal>
          <Modal  visible={visible} 
                  onDismiss={hideModal} 
                  contentContainerStyle={{backgroundColor: 'white', alignItems:'center'}}
          >
            <View style={{backgroundColor:'red'}}>
                  <Text>Total cases: {data_for_modal.total_county}</Text>
                  <Text>Total healed: {data_for_modal.total_healed}</Text>
                  <Text>Total dead: {data_for_modal.total_dead}</Text>
            </View>
          </Modal>
        </Portal>
      </Provider>
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
    alignSelf:'center',
    zIndex:-1
  }
});
