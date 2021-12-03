
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Constants from '../StoredData.js';
import { Button, Modal, Portal, Provider, Avatar } from 'react-native-paper';
import NavigationScreen from './NavigationScreen.js';

export default function Hospitals({route, navigation}){

    const {userLat, userLon, radius} = route.params; 
    const  destLat = 44.4267674;
    const  destLon = 26.1025384

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
            let hospLon = spital.geometry.location.lon;
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

            // newSpital['phoneNumber'] = moreDataJsonFormat.result.formatted_phone_number; 
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
            console.log(listaSpitale);
            setSpitaleGasite(true);
        }
    }
    



    if(listaSpitale.length !== 0){
        return(
            <View style={{marginTop:100}}>
                <Text> {listaSpitale[0].adress} </Text>
            </View>
        )
    }else {
        return(
            <View style={{marginTop:100}}>
                <Text>Se cauta spitale :(</Text>
            </View>
        )
    }
}