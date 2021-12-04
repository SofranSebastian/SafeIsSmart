import * as React from 'react';
import { TouchableOpacity,  Linking, Text, View, Platform, Alert } from 'react-native';
import { Avatar, Button, Card, List } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';


function dialCall( pN ) {
 
    let phoneNumber = '';
 
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + pN;
    }
    else {
      phoneNumber = 'telprompt:${1234567890}';
    }
 
    Linking.openURL(phoneNumber);
  };

function checkIfInList(list, name){
    for( let i = 0 ; i < list.length ; i++ ){
        if( list[i].name === name){
            return true;
        }
    }
    return false;
}

async function addFavouriteHospital( name, adress, destLat, destLon ){

  
    try {
        var existingList = await AsyncStorage.getItem('favouritesList')
        if(JSON.parse(existingList) !== null) {
          var cloneExistingList = JSON.parse(existingList);
          
            
          let possibleNewHospital = {
              name: name,
              adress: adress,
              destLat: destLat,
              destLon: destLon
          }

          if( !checkIfInList(cloneExistingList, name) ){
                cloneExistingList.push(possibleNewHospital);
                AsyncStorage.setItem('favouritesList', JSON.stringify(cloneExistingList) )
          }
        }else{
            var list = [];
            let possibleNewHospital = {
                name: name,
                adress: adress,
                destLat: destLat,
                destLon: destLon
            };
            list.push(possibleNewHospital);
            AsyncStorage.setItem('favouritesList', JSON.stringify(list) )
        }
      } catch(e) {
        // error reading value
      }
}

function CardHospital(props){

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

                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row', alignItems:'center', marginTop:'2%'}}>
                                    <Avatar.Icon icon="thumb-up" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                                    <View style={{marginLeft:'1%'}}>
                                        <Text style={{fontSize:12, fontFamily:'bold-font', color:"#094AA8"}} >
                                            {props.rating}   
                                            <Rating
                                                type='star'
                                                ratingCount={5}
                                                imageSize={10}
                                                readonly
                                                startingValue={props.rating}
                                                />
                                        </Text>
                                        <Text style={{fontSize:10, fontFamily:'normal-font', color:"#094AA8"}} >Rating</Text>
                                    </View>
                                </View>
                                { props.website !== undefined ?
                                <View style={{flexDirection:'row', alignItems:'center', marginTop:'2%', marginLeft:'6%'}}>
                                    <Avatar.Icon icon="web" color={ 'white'}  backgroundColor={"#094AA8"} size={25} />
                                    <TouchableOpacity style={{marginLeft:'1%'}} onPress={ () => {
                                                                                    Linking.openURL(props.website)
                                                                                    .catch(err => {
                                                                                        console.error("Failed opening page because: ", err)
                                                                                        alert('Failed to open page')
                                                                                    })}}
                                    >
                                        <Text style={{fontSize:12, fontFamily:'bold-font', color:"#094AA8"}} >
                                            Check website   
                                        </Text>
                                        <Text style={{fontSize:10, fontFamily:'normal-font', color:"#094AA8"}} >Press to open in browser</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                                }
                            </View>

                            <View style={{marginRight:'6%', marginTop:'4%'}}>
                                <List.Section>
                                    <List.Accordion
                                        title="Check schedule"
                                        titleStyle={{fontSize:14, fontFamily:'normal-font', color:"#094AA8"}}
                                        left={props => <List.Icon {...props} icon="clock-outline" color="#094AA8" />}>
                                        <List.Item title={props.orar[0]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[1]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[2]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[3]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[4]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[5]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[6]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                        <List.Item title={props.orar[7]} titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}}/>
                                    </List.Accordion>
                                </List.Section>
                            </View>
                            { props.reviews.length > 0 ?
                            <View style={{marginRight:'6%', marginTop:'2%'}}>
                                <List.Section>
                                    <List.Accordion
                                        title="Check reviews"
                                        titleStyle={{fontSize:14, fontFamily:'normal-font', color:"#094AA8"}}
                                        left={props => <List.Icon {...props} icon="file-find" color="#094AA8" />}>
                                        <List.Item title={props.reviews[0].text } titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}} titleNumberOfLines={20}/>
                                        { props.reviews.length > 1 ?
                                            <List.Item title={props.reviews[1].text } titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}} titleNumberOfLines={20}/>
                                            :
                                            null
                                        }
                                        { props.reviews.length > 2 ?
                                            <List.Item title={props.reviews[2].text } titleStyle={{fontSize:12, fontFamily:'normal-font', color:"#094AA8"}} titleNumberOfLines={20}/>
                                            :
                                            null
                                        }
                                    </List.Accordion>
                                </List.Section>
                            </View>
                            :
                            <View style={{marginRight:'6%'}}>
                                <List.Section>
                                    <List.Accordion
                                        title="No reviews available"
                                        titleStyle={{fontSize:14, fontFamily:'normal-font', color:"#094AA8"}}
                                        left={props => <List.Icon {...props} icon="file-find" color="#094AA8" />}>
                                    </List.Accordion>
                                </List.Section>
                            </View>
                            }

                        </View>
                    </View>
                    <View style={{  flex:0.2,marginTop:'4%'
                                }}>
                         
                    </View>
                    <View style={ props.phoneNumber !== undefined ?
                            { flex:0.3, alignItems:'flex-end', justifyContent:'space-between', flexDirection:'row' } 
                            :
                            { flex:0.3, alignItems:'flex-end', justifyContent:'flex-end', flexDirection:'row' } 
                        }
                    >   
                            { props.phoneNumber !== undefined ?
                                <Button   icon={'phone'}
                                            onPress={() =>  dialCall(props.phoneNumber)
                                                    }
                                            color="#094AA8"
                                            labelStyle={{fontSize:9}}
                                            mode='contained'
                                            style={{marginLeft:'6%', marginBottom:'4%'}}
                                    >
                                    CALL US
                                </Button>
                            :
                              null
                            }
                            <Button   icon={'star'}
                                        onPress={() => {    addFavouriteHospital( props.destName, props.adress, props.destLat, props.destLon);    
                                                            Alert.alert(
                                                                        "Success",
                                                                        props.destName + " has been added to your favourites",
                                                                        [
                                                                        { text: "OK", onPress: () => console.log() }
                                                                        ]
                                                                    );
                                                            
                                                        }
                                                }
                                        color="#094AA8"
                                        labelStyle={{fontSize:9}}
                                        mode='contained'
                                        style={  props.phoneNumber !== undefined ?
                                                    { marginBottom:'4%'}
                                                    :
                                                    { marginBottom:'4%', marginRight:'6%'}
                                                
                                            }
                                >
                                FAVOURITE
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

export default CardHospital;