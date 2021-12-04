
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import Constants from '../StoredData.js';
import { Button, Modal, Portal, Provider, Avatar } from 'react-native-paper';
import NavigationScreen from './NavigationScreen.js';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import CardFavourite from '../components/CardFavourite.js';
import Loading from '../components/Loading.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Favourites({route, navigation}){

    const{ userLat, userLon } = route.params;

    const[ listaFavorite, setListaFavorite ] = useState([]);
    const[ spitaleIncarcate, setSpitaleIncarcate ] = useState(false);

    async function getFavouritesList(){
        try{
            var list = await AsyncStorage.getItem('favouritesList');
            if( list ){
                setListaFavorite( JSON.parse(list) );
                setSpitaleIncarcate( true );
            }else{
                list = [];
                setSpitaleIncarcate( true );
            }
        }catch(e){
            //e
        }
    }

    useEffect(()=> getFavouritesList(),[spitaleIncarcate])

    if( spitaleIncarcate ){
        return(
            <View style={{flex:1, backgroundColor:"white"}}>

                <View style={{marginTop:'25%'}}>
                    <FlatList 
                            data={listaFavorite}
                            renderItem={ ({item}) => 
                                <CardFavourite  title={item.name}
                                                adress={item.adress}
                                                userLat={userLat}
                                                userLon={userLon}
                                                destLat={item.destLat}
                                                destLon={item.destLon}
                                                destName={item.name}
                                                navigation={navigation}
                                />
                        
                            }
                            keyExtractor={ (item) => item.name }
                    />
                </View>
                <Button onPress={ () => navigation.navigate("HeatMap")}>
                    back
                </Button>
            </View>
        )
    }else{
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                <Loading isDataLoading={true}/>
                <Text style={{fontSize:20, fontFamily:'bold-font', textAlign:'center', color:'#094AA8', marginTop:'5%', padding:10}}>
                    Loading
                </Text>
            </View>
        )
    }
    
}