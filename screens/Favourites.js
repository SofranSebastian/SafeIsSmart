
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
                        <StickyParallaxHeader   headerType="AvatarHeader" 
                        backgroundColor='#094AA8'
                        rightTopIcon={{}}
                        leftTopIcon={require("../assets/back.png")}
                        leftTopIconOnPress={ () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'HeatMap' }]
                       }) }
                        image={{}}
                        parallaxHeight={225}
                        foreground={    ()  =>
                                            <View style={{flex:1, padding:10, borderRadius:0}}>
                                                <View style={{alignItems:'flex-start'}}>
                                                    <Image source={require("../assets/favourites_artboard.png")} style={{width:400, height:110}} resizeMode="contain" />
                                                </View>
                                                <Text style={{fontSize:24, fontFamily:'bold-font', textAlign:'left', color:"white", marginTop:'5%'}}>
                                                    FAVOURITE MEDICAL CENTERS
                                                </Text>
                                            </View>
                        }
                        title="FAVOURITE CENTERS"
                        
                        children={  
                            <View style={{flex:1, backgroundColor:'white'}}>
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
                                    
                                        // listaSpitale.map( (item) => ( <View key={item.key}><Text>{item.placeName}</Text></View> ) )
                                    
                                }
/>
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