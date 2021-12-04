import * as React from 'react';
import { TouchableOpacity,  Linking, Text, View, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

function returnImageUrl( category ){
    if( category === "JavaScript" ){
        return {uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png"}
    }else if( category === "C" ){
        return {uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/695px-C_Programming_Language.svg.png"}
    }else if( category === "Java" ){
        return {uri:"https://wallpapercave.com/wp/wp7250034.jpg"}
    }
}

function CardHospital(props){
    return(
            <Card style={{  width:"95%",
                            marginLeft:'2%',
                            marginVertical:'2%',
                            height:150,
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
                {/* <Card.Title title={ props.title.toUpperCase()  +  " 💰" + props.cost + "p" }
                            titleStyle={{ fontSize:12, fontFamily:'normal-font', fontWeight:'bold', lineHeight:15,  color:"#262731" }}
                            titleNumberOfLines={4}
                            subtitleStyle={{ fontSize:10, fontFamily:'normal-font', color:"#262731" }}
                /> */}
                <View style={{
                            flex:1,
                            height:125,
                            borderRadius:15,
                        }}
                >
                    <View style={{  flex:0.25,
                                    flexDirection: 'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                }}>
                        <View style={{ marginLeft:'2%', flexDirection:"row", alignItems:'center'}}>
                            <Image source={returnImageUrl( (props.category) )}  style={{width:13, height:13}}/>

                            <Text numberOfLines={1} style={{ marginLeft:'2%',fontSize:12, fontFamily:'normal-font', fontWeight:'bold', lineHeight:15,  color:"#262731" }}>
                                { props.title.toUpperCase() }
                            </Text>
                        </View>
                    </View>
                    <View style={{  flex:0.4,
                                }}>
                        <Text style={{ marginLeft:'4%', fontSize:12, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                            • Description
                        </Text>
                        <Text numberOfLines={3} style={{ marginHorizontal:'4%', fontSize:10, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                            { props.description }
                        </Text>
                    </View>
                    <View style={{  flex:0.2,
                                }}>
                         
                    </View>
                    <View style={
                            props.needToSeeIfItIsResolved === true ? 
                                {   flex:0.25,
                                    width:'100%',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    flexDirection:'row' 
                                }
                            :
                            {   flex:0.25,
                                alignItems:'flex-end',
                            }
                        }
                    >
                            { props.needToSeeIfItIsResolved === true ?
                                    <View>
                                        <Text style={
                                            props.isResolved === true ? 
                                                { fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"green", marginLeft:'8%' }
                                            :
                                                { fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"orange", marginLeft:'8%' }
                                        }>
                                            { props.isResolved === true ?
                                                "RESOLVED"  
                                                :
                                                "IN PROGRESS"
                                            }
                                        </Text>
                                    </View>
                                :
                                null
                            }
                            <Button   icon={'chevron-right'}
                                        onPress={() =>props.navigation.navigate("NavigationScreen",{  
                                                                                                        userLat: props.userLat,
                                                                                                        userLon: props.userLon,
                                                                                                        destLat: props.destLat,
                                                                                                        destLon: props.destLon
                                                                                                    }
                                                                                )
                                                }
                                        color="#262731"
                                        labelStyle={{fontSize:8}}
                                        contentStyle={{width:60, height: 20}}
                                        mode='contained'
                                        style={{marginRight:'2%'}}
                                >
                                NAVIGATE
                            </Button>
                    </View>
                </View>

            </Card>
    )
};

export default CardHospital;