
import React, { useEffect, useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet } from 'react-native';
import Constants from '../StoredData.js';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import CardHospital from '../components/CardHospital.js';
import Loading from '../components/Loading.js';

export default function Hospitals({route, navigation}){

    const {userLat, userLon, radius} = route.params; 

    const [spitaleGasite, setSpitaleGasite] = useState(false); 
    const [listaSpitale, addSpitale] = useState([]);


    function msgCheck(list) {

        if (list === undefined)
          return false;
    
        let ok = false;
        for (let i = 0; i < list.length; i++) {
          if (list[i].text !== "") {
            ok = true;
            break;
          }
        }
    
        return ok;
    }

      
    useEffect(()=>{fetchSpitale()}, [spitaleGasite]);


    async function fetchSpitale(){
        let radius_in_meteres = radius*1000; 
        let places = []; 
        let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        userLat + ',' + userLon + '&radius=' + radius_in_meteres + '&type=hospital' + '&key=' + Constants.apiKey;

        const spitale = await fetch(url); 
        const jsonSpitale = await spitale.json();

        let i =1; 
        for(let spital of jsonSpitale.results){
            let newSpital = {}; 
            let hospLat = spital.geometry.location.lat; 
            let hospLon = spital.geometry.location.lng;
            let hospitalCoordinates = {
                latitude : hospLat,
                longitude: hospLon
            };

            newSpital['key'] = i.toString();
            newSpital['coordinates'] = hospitalCoordinates; 
            newSpital['placeName'] = spital.name; 
            newSpital['totalRates'] = spital.user_rating_total;
            newSpital['rating'] = spital.rating;
            newSpital['placeID'] = spital.place_id;
            newSpital['adress'] = spital.vicinity;
            newSpital['icon'] = spital.icon;


            let url_for_more_data = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + newSpital.placeID + '&key=' + Constants.apiKey;
            let moreData = await fetch (url_for_more_data);
            let moreDataJsonFormat = await moreData.json();

            newSpital['phoneNumber'] = moreDataJsonFormat.result.formatted_phone_number; 
            newSpital['website'] = moreDataJsonFormat.result.website;
            newSpital['orar'] = moreDataJsonFormat.result.opening_hours !== undefined? moreDataJsonFormat.result.opening_hours.weekday_text : "";
            newSpital['reviews'] = msgCheck(moreDataJsonFormat.result.reviews) ? moreDataJsonFormat.result.reviews : "NaN";

            places.push(newSpital);
            i+=1;
        }

        if(places.length > 0 ){
            addSpitale(places);
        }

        if(listaSpitale.length > 0){
            setSpitaleGasite(true);
        }
    }
    



    if(listaSpitale.length !== 0){
        return(
            <StickyParallaxHeader   headerType="AvatarHeader" 
                                    backgroundColor='#094AA8'
                                    rightTopIcon={{}}
                                    leftTopIcon={require("../assets/back.png")}
                                    leftTopIconOnPress={ () => navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'HeatMap' }]
                                   }) }
                                    image={{}}
                                    parallaxHeight={200}
                                    foreground={    ()  =>
                                                        <View style={styles.foregroundView}>
                                                            <View style={{ alignItems:'center'}}>
                                                                <Image source={require("../assets/navigation_syringe.png")} style={{width:300, height:100}} resizeMode="contain" />
                                                            </View>
                                                            <Text style={styles.textForeground}>
                                                                MEDICAL SUPPORT
                                                            </Text>
                                                        </View>
                                    }
                                    title="MEDICAL SUPPORT"
                                    children={  
                                        <View style={{flex:1, backgroundColor:"white"}}>
                                                <FlatList   data={listaSpitale}
                                                            renderItem={
                                                                ({ item }) => 
                                                                    <CardHospital   title={item.placeName}
                                                                                   
                                                                                    userLat = {userLat}
                                                                                    userLon = {userLon}
                                                                                    destLat = {item.coordinates.latitude}
                                                                                    destLon = {item.coordinates.longitude}
                                                                                    destName = {item.placeName}
                                                                                    totalRates = {item.totalRates}
                                                                                    rating = {item.rating}
                                                                                    adress = {item.adress}
                                                                                    navigation={navigation}
                                                                                    orar = { item.orar }
                                                                                    reviews = { item.reviews }
                                                                                    website = { item.website }
                                                                                    phoneNumber = { item.phoneNumber }
                                                                    />
                                                                
                                                            }
                                                            
                                                            keyExtractor={item => item.key} 
                                                /> 
                                            </View>
                                                
                                            }
            />
        )
    }else {
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
    foregroundView:{flex:1, padding:10, borderRadius:0},
    textForeground:{fontSize:26, fontFamily:'bold-font', textAlign:'left', color:"white", marginTop:'5%'}

});