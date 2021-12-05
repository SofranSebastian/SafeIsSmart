
import React, {useEffect, useState} from 'react';
import { Text, View, Image, FlatList, StyleSheet } from 'react-native';
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
                                            <View style={styles.viewForeground}>
                                                <View style={styles.viewImageForeground}>
                                                    <Image source={require("../assets/favourites_artboard.png")} style={styles.imageForeground} resizeMode="contain" />
                                                </View>
                                                <Text style={styles.textForeground}>
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
                                    
                                }
/>
        )
    }else{
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
    viewForeground:{flex:1, padding:10, borderRadius:0},
    viewImageForeground:{alignItems:'flex-start'},
    imageForeground:{width:400, height:110},
    textForeground:{fontSize:24, fontFamily:'bold-font', textAlign:'left', color:"white", marginTop:'5%'}
})