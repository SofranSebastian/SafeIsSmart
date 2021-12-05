import * as React from 'react';
import { Text, View, StyleSheet  } from 'react-native';
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
            <Card style={styles.cardStyle}>
                <View style={styles.viewContainer}>
                    <View style={styles.viewTitle}>
                        <View style={styles.smallViewTitle}>
                            <Text numberOfLines={1} style={styles.textTitle}>
                                { props.title.toUpperCase() }
                            </Text>
                        </View>
                    </View>
                    <View style={styles.viewDescription}>
                        <Text style={styles.textDescription}>
                            • Description
                        </Text>
                        <View style={styles.viewContainerDescription}>
                            <View style={styles.smallViewDescription}>
                                <Avatar.Icon icon="map-marker" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                                <View style={{marginLeft:'1%'}}>
                                    <Text style={styles.textAdress}>{props.adress}</Text>
                                    <Text style={styles.infoTextAdress} >Adress</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewEmpty}></View>
                    <View style={styles.viewButton}>   
                            <Button   icon={'delete'}
                                        onPress={() => { deleteFavouriteHospital( props.destName ),props.navigation.reset({
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
                            <Button     icon={'chevron-right'}
                                        onPress={() =>props.navigation.navigate("NavigationScreen",{ userLat: props.userLat, userLon: props.userLon, destLat: props.destLat, destLon: props.destLon, destName: props.destName})}
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
 
const styles = StyleSheet.create({
    cardStyle:{  width:"95%",marginLeft:'2%',marginVertical:'2%',borderRadius:15,shadowColor: "#000",shadowOffset: {width: 0,height: 3,}, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 3},
    viewContainer:{flex:1, borderRadius:15},
    viewTitle:{  flex:0.25, flexDirection: 'row', justifyContent:'space-between', alignItems:'center' },
    viewButton:{ flex:0.3, alignItems:'flex-end', justifyContent:'flex-end', flexDirection:'row' },
    viewEmpty:{ flex:0.2, marginTop:'4%' },
    smallViewTitle:{ marginLeft:'2%', flexDirection:"row", alignItems:'center'},
    textTitle:{ marginLeft:'2%',fontSize:16, fontFamily:'medium-font',  color:"#094AA8" },
    viewDescription:{  flex:0.4, marginTop:'2%' },
    textDescription:{ marginLeft:'4%', fontSize:12, fontFamily:'normal-font', lineHeight:15,  color:"#094AA8" },
    viewContainerDescription:{marginLeft:'6%', marginTop:'2%'},
    smallViewDescription:{flexDirection:'row', alignItems:'center'},
    textAdress:{fontSize:12, fontFamily:'bold-font', color:"#094AA8"},
    infoTextAdress:{fontSize:10, fontFamily:'normal-font', color:"#094AA8"}
 
})
 
export default CardFavourite;