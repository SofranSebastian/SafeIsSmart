import * as React from 'react';
import { Text, View  } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function deleteFavouriteHospital( name ){
    try{
        var flag = 0;
        var list = await AsyncStorage.getItem("favouritesList");
        var cloneList = JSON.parse(list);

        for( let i = 0 ; i < cloneList.length ; i++ ){
            if( cloneList[i].name === name){
                cloneList.splice(i,1);
                break;
            }
        }

        AsyncStorage.setItem("favouritesList", JSON.stringify(cloneList))

    }catch(e){
        //e
    }
}

function CardFavourite(props){
    return(
            <Card style={{  width:"95%",
                            marginLeft:'2%',
                            marginVertical:'2%',
                            borderRadius:15,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,

                            elevation: 3,
                        }}
            >
                <View style={{
                            flex:1,
                            borderRadius:15,
                        }}
                >
                    <View style={{  flex:0.25,
                                    flexDirection: 'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                }}>
                        <View style={{ marginLeft:'2%', flexDirection:"row", alignItems:'center'}}>

                            <Text numberOfLines={1} style={{ marginLeft:'2%',fontSize:16, fontFamily:'medium-font',  color:"#094AA8" }}>
                                { props.title.toUpperCase() }
                            </Text>
                            
                        </View>
                    </View>
                    <View style={{  flex:0.4, marginTop:'2%'
                                }}>
                        <Text style={{ marginLeft:'4%', fontSize:12, fontFamily:'normal-font', lineHeight:15,  color:"#094AA8" }}>
                            • Description
                        </Text>
                        <View style={{marginLeft:'6%', marginTop:'2%'}}>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Avatar.Icon icon="map-marker" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                                <View style={{marginLeft:'1%'}}>
                                    <Text style={{fontSize:12, fontFamily:'bold-font', color:"#094AA8"}} >
                                        {props.adress}
                                    </Text>
                                    <Text style={{fontSize:10, fontFamily:'normal-font', color:"#094AA8"}} >Adress</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{  flex:0.2,marginTop:'4%'
                                }}>
                         
                    </View>
                    <View style={ { flex:0.3, alignItems:'flex-end', justifyContent:'flex-end', flexDirection:'row' } }>   

                            <Button   icon={'delete'}
                                        onPress={() => {deleteFavouriteHospital( props.destName ),         
                                                        props.navigation.reset({
                                                            index: 0,
                                                            routes: [{ name: 'Favourites', params:{ userLat:props.userLat, userLon:props.userLon} }]
                                                        }) 
                                }}
                                        color="#094AA8"
                                        labelStyle={{fontSize:9}}
                                        mode='contained'
                                        style={  props.phoneNumber !== undefined ?
                                                    { marginBottom:'4%'}
                                                    :
                                                    { marginBottom:'4%', marginRight:'6%'}
                                                
                                            }
                                >
                                DELETE
                            </Button>

                            <Button   icon={'chevron-right'}
                                        onPress={() =>props.navigation.navigate("NavigationScreen",{  
                                                                                                        userLat: props.userLat,
                                                                                                        userLon: props.userLon,
                                                                                                        destLat: props.destLat,
                                                                                                        destLon: props.destLon,
                                                                                                        destName: props.destName
                                                                                                    }
                                                                                )
                                                }
                                        color="#094AA8"
                                        labelStyle={{fontSize:9}}
                                        mode='contained'
                                        style={{marginRight:'6%', marginBottom:'4%'}}
                                >
                                NAVIGATE
                            </Button>
                    </View>
                </View>

            </Card>
    )
};

export default CardFavourite;