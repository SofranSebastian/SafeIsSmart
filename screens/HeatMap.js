import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import { Button, Modal, Portal, Provider, Avatar } from 'react-native-paper';
import NavigationScreen from './NavigationScreen.js';

export default function HeatMap({route, navigation}) {


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

  judetDataObj.name = judet.county
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
        customMapStyle={MapThemes.customMapStyleDark}
        initialCamera={{
          center: {
            latitude: 45.84160,
            longitude: 24.973095
          },
          zoom:6,
          heading: 0,
          pitch: 0,
          altitude: 1000
        }
      }
      >

        <Polyline 
        lineDashPattern={[10,10]}
        coordinates={Constants.romPol}
        strokeColor={'#0056F1'}
        strokeWidth={4}/>

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
            <View style={{  backgroundColor:(judet.total_county > 1000 ? '#094AA8' : 
                                                                          (judet.total_county > 500  && judet.total_county<1000 ? '#0056F1' : '#7ABAF9')
                            ), 
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
                  contentContainerStyle={{backgroundColor: 'white', alignItems:'center', width:'80%', marginHorizontal:'10%',height: 450, borderRadius:20}}
          >
            <View style={{flex:1}}>
            <View style={{flex:0.3, alignItems:'center', justifyContent:'center'}}>
              <Image source={{uri:returnCountyImage(data_for_modal.name)}} style={{width:130, height:130}} resizeMode='contain'/>
            </View>
            <View style={{ flex:0.5, justifyContent:'space-around'}}>
                  <Text style={{fontSize:24, fontFamily:'bold-font', textAlign:'center', color:"#094AA8"}}>{data_for_modal.name}</Text>
                  <View style={{flexDirection:'column', marginVertical:"2%"}}>
                    <View style={{alignItems:'center', justifyContent:'center', marginVertical:"4%" }}>
                      <Avatar.Icon size={24} icon="virus" backgroundColor="#094AA8"/>
                      <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8"}}>Total cases: {data_for_modal.total_county}</Text>
                    </View>
                    <View style={{alignItems:'center', justifyContent:'center', marginVertical:"4%"}}>
                      <Avatar.Icon size={24} icon="bottle-tonic-plus-outline" backgroundColor="#094AA8"/>
                      <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8"}}>Total recovered: {data_for_modal.total_healed}</Text>
                    </View> 
                    <View style={{alignItems:'center', justifyContent:'center', marginVertical:"4%"}}>
                      <Avatar.Icon size={24} icon="coffin" backgroundColor="#094AA8"/>
                      <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8"}}>Total deaths: {data_for_modal.total_dead}</Text>
                    </View>
                  </View>
            </View>
            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
              <Button icon="close-circle-outline" size={20}  mode='contained' color="#094AA8" onPress={()=>hideModal()}>
                 DISMISS
              </Button>
            </View>
            </View>
          </Modal>
        </Portal>
      </Provider>

      <View style={{position:'absolute', bottom:10, right:10, height: 125, width:170, backgroundColor:'white', borderRadius:20, alignItems:'center',shadowColor: "#000",
                            shadowOffset: {
                                width: 4,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,

                            elevation: 3,}}>
        <Text style={{fontSize:14, fontFamily:'bold-font', textAlign:'center', color:"#094AA8", padding:5}}>ROMANIA COVID-19 HEATMAP LEGEND</Text>
        <View style={{alignItems:'flex-start'}}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <View style={{height:15,width:15, borderRadius:20, backgroundColor:'#094AA8'}}></View>
            <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8",paddingVertical:1}}>   over 1000 cases</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <View style={{height:15,width:15, borderRadius:20, backgroundColor:'#0056F1'}}></View>
            <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8",paddingVertical:1}}>   between 500-1000</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <View style={{height:15,width:15, borderRadius:20, backgroundColor:'#7ABAF9'}}></View>
            <Text style={{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8",paddingVertical:1}}>   below 500</Text>
          </View>
        </View>
      </View>
      <Button style={{marginTop:100, position:'absolute'}} onPress={()=> {navigation.navigate("NavigationScreen", { userLat:userLat, userLon:userLon, destLat:44.4267674, destLon:26.1025384  })}}>Press me to navigate</Button>
    </View>
  );
}else{

  return (
    <View style={styles.bigview}>
      <Text>Se cauta datele</Text>
    </View>
  );

}


function returnCountyImage(name){
  switch(name) {
    case "TIMIȘ":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d3/Harta_jud_Timis_1.png"
    case "ARAD":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Harta_jud_Arad.png/560px-Harta_jud_Arad.png"
    case "BIHOR":
      return "https://upload.wikimedia.org/wikipedia/commons/6/61/Harta_jud_Bihor.png"
    case "SATU MARE":
      return "https://upload.wikimedia.org/wikipedia/commons/3/36/Harta_jud_Satu_Mare.png"
    case "BUCUREȘTI":
      return "https://upload.wikimedia.org/wikipedia/commons/9/95/Harta_jud_Ilfov.png"
    case "ILFOV":
      return "https://upload.wikimedia.org/wikipedia/commons/9/95/Harta_jud_Ilfov.png"
    case "SUCEAVA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Harta_jud_Suceava.png/290px-Harta_jud_Suceava.png"
    case "ARGEȘ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Harta_jud_Arges.png/560px-Harta_jud_Arges.png"
    case "BRAȘOV":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Harta_jud_Brasov.png/280px-Harta_jud_Brasov.png"
    case "GALAȚI":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Harta_jud_Galati.png/560px-Harta_jud_Galati.png"
    case "DÂMBOVIȚA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Harta_jud_Dambovita.png/280px-Harta_jud_Dambovita.png"
    case "PRAHOVA":
      return "https://upload.wikimedia.org/wikipedia/commons/4/44/Harta_jud_Prahova.png"
    case "VRANCEA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Harta_jud_Vrancea.png/280px-Harta_jud_Vrancea.png"
    case "IAȘI":
      return "https://upload.wikimedia.org/wikipedia/commons/8/86/Romania_Iasi_Location_map.jpg"
    case "BUZĂU":
      return "https://upload.wikimedia.org/wikipedia/commons/f/f9/Harta_jud_Buzau.png"
    case "NEAMȚ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Harta_jud_Neamt.png/280px-Harta_jud_Neamt.png"
    case "BACĂU":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Harta_jud_Bacau.png/776px-Harta_jud_Bacau.png"
    case "BOTOȘANI":
      return "https://upload.wikimedia.org/wikipedia/commons/3/35/Harta_jud_Botosani.png"
    case "CLUJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Harta_jud_Cluj.png/280px-Harta_jud_Cluj.png"
    case "MUREȘ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Harta_jud_Mures.png/280px-Harta_jud_Mures.png"
    case "HUNEDOARA":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d4/Harta_jud_Hunedoara.png"
    case "SIBIU":
      return "https://upload.wikimedia.org/wikipedia/commons/c/ca/Harta_jud_Sibiu.png"
    case "BISTRIȚA-NĂSĂUD":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Harta_jud_Bistrita-Nasaud.png/280px-Harta_jud_Bistrita-Nasaud.png"
    case "CONSTANȚA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Harta_jud_Constanta.png/560px-Harta_jud_Constanta.png"
    case "ALBA":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d4/Harta_jud_Alba.png"
    case "GORJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Harta_jud_Gorj.png/280px-Harta_jud_Gorj.png"
    case "IALOMIȚA":
      return "https://upload.wikimedia.org/wikipedia/ro/5/56/Harta_jud_Ialomita.PNG"
    case "BRĂILA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Harta_jud_Braila.png/280px-Harta_jud_Braila.png"
    case "OLT":
      return "https://upload.wikimedia.org/wikipedia/commons/e/ea/Harta_jud_Olt.png"
    case "DOLJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Romania_Dolj_Location_map.jpg/280px-Romania_Dolj_Location_map.jpg"
    case "MEHEDINȚI":
      return "https://upload.wikimedia.org/wikipedia/commons/2/21/Harta_jud_Mehedinti.png"
    case "HARGHITA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Harta_jud_Harghita.png/280px-Harta_jud_Harghita.png"
    case "VASLUI":
      return "https://upload.wikimedia.org/wikipedia/commons/4/46/Harta_jud_Vaslui.png"
    case "COVASNA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Harta_jud_Covasna.png/200px-Harta_jud_Covasna.png"
    case "VÂLCEA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Romania_Valcea_Location_map.jpg/290px-Romania_Valcea_Location_map.jpg"
    case "GIURGIU":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Romania_Giurgiu_Location_map.jpg/290px-Romania_Giurgiu_Location_map.jpg"
    case "MARAMUREȘ":
      return "https://upload.wikimedia.org/wikipedia/commons/b/b8/Harta_jud_Maramures.png"
    case "TULCEA":
      return "https://upload.wikimedia.org/wikipedia/commons/0/02/Harta_jud_Tulcea.png"
    case "TELEORMAN":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Harta_jud_Teleorman.png/280px-Harta_jud_Teleorman.png"
    case "SATU MARE":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Harta_jud_Satu_Mare.png/317px-Harta_jud_Satu_Mare.png"
  }
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
