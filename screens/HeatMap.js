import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import MapView, { Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from '../StoredData.js';
import MapThemes from '../MapThemes.js';
import { Button, Modal, Portal, Provider, Avatar, List} from 'react-native-paper';
import BottomTabNavigator from '../components/BottomTabNavigator.js';
import Slider from '@react-native-community/slider';
import Loading from '../components/Loading.js';

export default function HeatMap({route, navigation}) {

const [radiusModalVisible, setRadiusModalVisible] = useState(false);
const hideRadiusModal = () => setRadiusModalVisible(false)

const [visible, setVisible] = useState(false);
const hideModal = () => setVisible(false);
const showModal = () => setVisible(true);

const [helpModalVisible, setHelpModalVisible] = useState(false);
const hideHelpModal = () => setHelpModalVisible(false);

const [data_for_modal, setDataForModal] = useState({});
const [date_gasite, setDate] = useState(false);
const [listaJudete, setListaJudete] = useState(Constants.listaJd);
const [userLat, setUserLat] = useState(0);
const [userLon, setUserLon] = useState(0);
const [radius, setRadius] = useState(1);
const _map = useRef(null)

async function getUserLocation(){
  let {status} = await Location.requestForegroundPermissionsAsync();
  if(status !=='granted'){
    // in cazul in care userul nu a acordat aplicatiei acces la locatie, se doreste terminarea procesului
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  setUserLat(location.coords.latitude);
  setUserLon(location.coords.longitude);
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
      <View style={styles.viewLegend}>
        <Text style={styles.textLegendTitle}>ROMANIA COVID-19 HEATMAP LEGEND</Text>
        <View style={{alignItems:'flex-start'}}>
          <View style={styles.viewLegendComponents}>
            <View style={styles.dotOver1000}></View>
            <Text style={styles.dotText}>   over 1000 cases</Text>
          </View>
          <View style={styles.viewLegendComponents}>
            <View style={styles.dotBetween}></View>
            <Text style={styles.dotText}>   between 500-1000</Text>
          </View>
          <View style={styles.viewLegendComponents}>
            <View style={styles.dotUnder500}></View>
            <Text style={styles.dotText}>   below 500</Text>
          </View>
        </View>
      </View>
      <Provider>
        <Portal>
          <Modal  visible={radiusModalVisible} 
                  onDismiss={()=> {hideRadiusModal(), setRadius(1)}} 
                  contentContainerStyle={styles.modalRadius}
          >
            <View style={{flex:1}}>
              <View style={{ flex:0.25, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.textSelectRadius}>SELECT RADIUS</Text>
                    <Text style={styles.textValInKm}>VALUE IN KILOMETERS</Text>
              </View>
              <View style={{ flex:0.4, justifyContent:'center'}}>
                <Text style={styles.textRadius}>{radius}</Text>
                    <Slider
                      style={{width: 250, height: 60}}
                      minimumValue={1}
                      maximumValue={10}
                      minimumTrackTintColor="#094AA8"
                      maximumTrackTintColor="#000000"
                      onValueChange={ ( value ) => setRadius( value ) }
                      step={1}
                    /> 

              </View>
              <View style={styles.viewSearchButton}>
                <Button icon="magnify" size={20}  mode='contained' color="#094AA8" onPress={()=> navigation.navigate('Hospitals',{ userLat:userLat, userLon:userLon, radius: radius  })}>
                  SEARCH
                </Button>
                <Button icon="close-circle-outline" size={15}  mode='text' color="#094AA8" onPress={()=> {hideRadiusModal(), setRadius(1)}} style={{marginTop:'2%'}}>
                  DISMISS
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
      <Provider>
        <Portal>
          <Modal  visible={visible} 
                  onDismiss={hideModal} 
                  contentContainerStyle={styles.modalInfoCounty}
          >
            <View style={{flex:1}}>
            <View style={{flex:0.3, alignItems:'center', justifyContent:'center'}}>
              <Image source={{uri:returnCountyImage(data_for_modal.name)}} style={{width:130, height:130}} resizeMode='contain'/>
            </View>
            <View style={{ flex:0.5, justifyContent:'space-around'}}>
                  <Text style={styles.countyName}>{data_for_modal.name}</Text>
                  <View style={styles.viewContyInfo}>
                    <View style={styles.viuewCountyInfoSection}>
                      <Avatar.Icon size={24} icon="virus" backgroundColor="#094AA8"/>
                      <Text style={styles.textCountyInfo}>Total cases: {data_for_modal.total_county}</Text>
                    </View>
                    <View style={styles.viuewCountyInfoSection}>
                      <Avatar.Icon size={24} icon="bottle-tonic-plus-outline" backgroundColor="#094AA8"/>
                      <Text style={styles.textCountyInfo}>Total recovered: {data_for_modal.total_healed}</Text>
                    </View> 
                    <View style={styles.viuewCountyInfoSection}>
                      <Avatar.Icon size={24} icon="coffin" backgroundColor="#094AA8"/>
                      <Text style={styles.textCountyInfo}>Total deaths: {data_for_modal.total_dead}</Text>
                    </View>
                  </View>
            </View>
            <View style={styles.buttonCounty}>
              <Button icon="close-circle-outline" size={20}  mode='contained' color="#094AA8" onPress={()=>hideModal()}>
                 DISMISS
              </Button>
            </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
      <Provider>
        <Portal>
          <Modal  visible={helpModalVisible} 
                  onDismiss={hideHelpModal} 
                  contentContainerStyle={{backgroundColor: 'white', alignItems:'center', width:'80%', marginHorizontal:'10%',height: 500, borderRadius:20, marginTop:'5%'}}
          >
            <View style={{flex:1}}>
              <View style={styles.viewTitleHelpModal}>
                    <Text style={styles.textTitleHelpModal}>HELP</Text>
              </View>
              <ScrollView style={{ flex:0.5, width:300 }} contentContainerStyle={{justifyContent:'space-between'}}>
                  <List.Section>
                    <List.Accordion
                        title="Heat Map"
                        titleStyle={styles.listTitleStyle}
                        left={props => <List.Icon {...props} icon="map-legend" color="#094AA8" />}
                      >
                        <List.Item  title={"As the upper right corner legend mentions the Heat Map represents the total COVID-19 cases by county. By pressing on a Heat Map Circle you can open a modal containing more detailed information about the county's status."} 
                                    titleStyle={styles.listItemStyle} titleNumberOfLines={10}
                                    style={styles.itemStyle}
                                    left={()=>{}}
                        />
                    </List.Accordion>

                    <View style={{borderWidth:0.5, borderColor:'#EAEBED', width:'90%', marginHorizontal:'5%', marginVertical:'2%'}}></View>

                    <List.Accordion
                        title="Hospitals"
                        titleStyle={styles.listTitleStyle}
                        left={props => <List.Icon {...props} icon="hospital" color="#094AA8" />}>
                        <List.Item  title={"Represents the list of medical support centers found nearby your location. For each institution you are provided with a detailed set of information."} 
                                    titleStyle={styles.listItemStyle}
                                    titleNumberOfLines={10}
                                    style={styles.itemStyle}
                                    left={()=>{}}
                        />
                        
                    </List.Accordion>

                    <View style={{borderWidth:0.5, borderColor:'#EAEBED', width:'90%', marginHorizontal:'5%', marginVertical:'2%'}}></View>

                    <List.Accordion
                        title="Navigation"
                        titleStyle={styles.listTitleStyle}
                        left={props => <List.Icon {...props} icon="navigation" color="#094AA8" />}>
                        <List.Item  title={"By pressing the main button from the bottom navigator you'll open a modal where you can set the radius for the next step which consists of finding all the medical support centers within the selected area."} 
                                    titleStyle={styles.listItemStyle}
                                    titleNumberOfLines={10}
                                    style={styles.itemStyle}
                                    left={()=>{}}
                        />
                        <List.Item  title={"Once you reach the hospital's list you have the option to navigate to each and everyone of them by pressing the `Navigate` button which will open the navigation system incorporated in the application."} 
                                    titleStyle={styles.listItemStyle}
                                    titleNumberOfLines={10}
                                    style={styles.itemStyle}
                                    left={()=>{}}
                        />
                    
                    </List.Accordion>
                    

                    <View style={styles.viewSeparator}></View>        

                    <List.Accordion
                        title="Favourites"
                        titleStyle={styles.listTitleStyle}
                        left={props => <List.Icon {...props} icon="star" color="#094AA8" />}>
                        <List.Item  title={"Inside the hospital's list you have the option to set a favourite medical support center by pressing the star button. Once you chose one you can find it in the `Favourites` screen."} 
                                    titleStyle={styles.listItemStyle}
                                    titleNumberOfLines={10}
                                    style={styles.itemStyle}
                                    left={()=>{}}
                        />
                    </List.Accordion>
                  </List.Section>
              </ScrollView>
              <View style={styles.viewButtonDismiss}>
                <Button icon="close-circle-outline" size={20}  mode='contained' color="#094AA8" onPress={()=>hideHelpModal()}>
                  DISMISS
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </Provider>
      <BottomTabNavigator navigation={navigation} 
                          userLat = {userLat}
                          userLon = {userLon}
                          heatMapCallback = { (data) => showModalForRadius(data) }
                          helpCallback = { (data) => showModalForHelp(data) }
      />
    </View>
  );
}else{

  return (
    <View style={styles.viewLoadingScreen}>
      <Loading isDataLoading={true}/>
      <Text style={styles.textLoadingScreen}>
          Loading
      </Text>
    </View>
  );

}


function showModalForRadius(childData){
  setRadiusModalVisible(childData);
}

function showModalForHelp(childData){
  setHelpModalVisible(childData);
}

function returnCountyImage(name){
  switch(name) {
    case "TIMI??":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d3/Harta_jud_Timis_1.png"
    case "ARAD":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Harta_jud_Arad.png/560px-Harta_jud_Arad.png"
    case "BIHOR":
      return "https://upload.wikimedia.org/wikipedia/commons/6/61/Harta_jud_Bihor.png"
    case "SATU MARE":
      return "https://upload.wikimedia.org/wikipedia/commons/3/36/Harta_jud_Satu_Mare.png"
    case "BUCURE??TI":
      return "https://upload.wikimedia.org/wikipedia/commons/9/95/Harta_jud_Ilfov.png"
    case "ILFOV":
      return "https://upload.wikimedia.org/wikipedia/commons/9/95/Harta_jud_Ilfov.png"
    case "SUCEAVA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Harta_jud_Suceava.png/290px-Harta_jud_Suceava.png"
    case "ARGE??":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Harta_jud_Arges.png/560px-Harta_jud_Arges.png"
    case "BRA??OV":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Harta_jud_Brasov.png/280px-Harta_jud_Brasov.png"
    case "GALA??I":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Harta_jud_Galati.png/560px-Harta_jud_Galati.png"
    case "D??MBOVI??A":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Harta_jud_Dambovita.png/280px-Harta_jud_Dambovita.png"
    case "PRAHOVA":
      return "https://upload.wikimedia.org/wikipedia/commons/4/44/Harta_jud_Prahova.png"
    case "VRANCEA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Harta_jud_Vrancea.png/280px-Harta_jud_Vrancea.png"
    case "IA??I":
      return "https://upload.wikimedia.org/wikipedia/commons/8/86/Romania_Iasi_Location_map.jpg"
    case "BUZ??U":
      return "https://upload.wikimedia.org/wikipedia/commons/f/f9/Harta_jud_Buzau.png"
    case "NEAM??":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Harta_jud_Neamt.png/280px-Harta_jud_Neamt.png"
    case "BAC??U":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Harta_jud_Bacau.png/776px-Harta_jud_Bacau.png"
    case "BOTO??ANI":
      return "https://upload.wikimedia.org/wikipedia/commons/3/35/Harta_jud_Botosani.png"
    case "CLUJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Harta_jud_Cluj.png/280px-Harta_jud_Cluj.png"
    case "MURE??":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Harta_jud_Mures.png/280px-Harta_jud_Mures.png"
    case "HUNEDOARA":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d4/Harta_jud_Hunedoara.png"
    case "SIBIU":
      return "https://upload.wikimedia.org/wikipedia/commons/c/ca/Harta_jud_Sibiu.png"
    case "BISTRI??A-N??S??UD":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Harta_jud_Bistrita-Nasaud.png/280px-Harta_jud_Bistrita-Nasaud.png"
    case "CONSTAN??A":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Harta_jud_Constanta.png/560px-Harta_jud_Constanta.png"
    case "ALBA":
      return "https://upload.wikimedia.org/wikipedia/commons/d/d4/Harta_jud_Alba.png"
    case "GORJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Harta_jud_Gorj.png/280px-Harta_jud_Gorj.png"
    case "IALOMI??A":
      return "https://upload.wikimedia.org/wikipedia/ro/5/56/Harta_jud_Ialomita.PNG"
    case "BR??ILA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Harta_jud_Braila.png/280px-Harta_jud_Braila.png"
    case "OLT":
      return "https://upload.wikimedia.org/wikipedia/commons/e/ea/Harta_jud_Olt.png"
    case "DOLJ":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Romania_Dolj_Location_map.jpg/280px-Romania_Dolj_Location_map.jpg"
    case "MEHEDIN??I":
      return "https://upload.wikimedia.org/wikipedia/commons/2/21/Harta_jud_Mehedinti.png"
    case "HARGHITA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Harta_jud_Harghita.png/280px-Harta_jud_Harghita.png"
    case "VASLUI":
      return "https://upload.wikimedia.org/wikipedia/commons/4/46/Harta_jud_Vaslui.png"
    case "COVASNA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Harta_jud_Covasna.png/200px-Harta_jud_Covasna.png"
    case "V??LCEA":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Romania_Valcea_Location_map.jpg/290px-Romania_Valcea_Location_map.jpg"
    case "GIURGIU":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Romania_Giurgiu_Location_map.jpg/290px-Romania_Giurgiu_Location_map.jpg"
    case "MARAMURE??":
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
  },
  viewLoadingScreen:{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'},
  textLoadingScreen:{fontSize:20, fontFamily:'bold-font', textAlign:'center', color:'#094AA8', marginTop:'5%', padding:10},
  viewButtonDismiss:{flex:0.3, justifyContent:'space-around', alignItems:'center'},
  listTitleStyle:{fontSize:14, fontFamily:'normal-font', color:"#094AA8"},
  listItemStyle : {fontSize:12, fontFamily:'normal-font', color:"#094AA8"},
  itemStyle: {justifyContent:'flex-start', alignItems:'flex-start'},
  viewSeparator:{borderWidth:0.5, borderColor:'#EAEBED', width:'90%', marginHorizontal:'5%', marginVertical:'2%'},
  viewTitleHelpModal:{ flex:0.2, justifyContent:'center', alignItems:'center'},
  textTitleHelpModal:{fontSize:20, fontFamily:'bold-font', textAlign:'center', color:"#094AA8"},
  buttonCounty:{flex:0.2, justifyContent:'center', alignItems:'center'},
  countyName:{fontSize:24, fontFamily:'bold-font', textAlign:'center', color:"#094AA8"},
  viewContyInfo:{flexDirection:'column', marginVertical:"2%"},
  viuewCountyInfoSection:{alignItems:'center', justifyContent:'center', marginVertical:"4%" },
  textCountyInfo:{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8"},
  modalInfoCounty:{backgroundColor: 'white', alignItems:'center', width:'80%', marginHorizontal:'10%',height: 450, borderRadius:20, marginTop:'5%'},
  viewSearchButton:{flex:0.35, justifyContent:'space-around', alignItems:'center'},
  textRadius:{fontSize:24, fontFamily:'bold-font', textAlign:'center', color:"#094AA8"},
  textSelectRadius:{fontSize:24, fontFamily:'bold-font', textAlign:'center', color:"#094AA8"},
  textValInKm:{fontSize:14, fontFamily:'normal-font', textAlign:'center', color:"#094AA8"},
  modalRadius:{backgroundColor: 'white', alignItems:'center', width:'80%', marginHorizontal:'10%',height: 300, borderRadius:20, marginTop:'5%'},
  textLegendTitle:{fontSize:14, fontFamily:'bold-font', textAlign:'center', color:"#094AA8", padding:5},
  viewLegendComponents:{flexDirection:'row', alignItems:'center', justifyContent:'center'},
  dotOver1000:{height:15,width:15, borderRadius:20, backgroundColor:'#094AA8'},
  dotBetween:{height:15,width:15, borderRadius:20, backgroundColor:'#0056F1'},
  dotUnder500:{height:15,width:15, borderRadius:20, backgroundColor:'#7ABAF9'},
  dotText:{fontSize:12, fontFamily:'normal-font', textAlign:'center', color:"#094AA8",paddingVertical:1},
  viewLegend:{position:'absolute', top:'5%', right:10, height: 125, width:170, backgroundColor:'white', borderRadius:20, alignItems:'center',shadowColor: "#000",
  shadowOffset: {
      width: 4,
      height: 3,
  },
  shadowOpacity: 0.29,
  shadowRadius: 4.65,

  elevation: 3,}
});
