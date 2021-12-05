import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
 
export default class BottomNavigator extends React.Component {
 
    constructor(){
        super();
    }
 
    sendData(){
        this.props.heatMapCallback(true);
    }
 
    sendDataHelp(){
        this.props.helpCallback(true);
    }
 
    render() {
        return (
            <View style={styles.viewContainer}> 
                <View style={styles.viewFab}>
                    <FAB    style={styles.fab}
                            icon="navigation"
                            color="white"
                            onPress={ () => this.sendData() }
                    />
                </View>
                <View style={styles.viewBottom}>
                        <View style={styles.viewFavourites}>
                            <IconButton
                                icon="star"
                                color={'white'}
                                size={25}
                                onPress={() => this.props.navigation.navigate("Favourites",{userLat: this.props.userLat, userLon: this.props.userLon })}
                                style={styles.iconButton}
                            />
                            <Text style={styles.textFavourites}>FAVOURITES</Text>
                        </View>
                        <View style={styles.viewInformation}>
                            <IconButton
                                icon="information"
                                color={'white'}
                                size={25}
                                onPress={() => this.sendDataHelp()}
                                style={styles.iconButton}
                            />
                            <Text style={styles.textInformation}>HELP</Text>
                        </View>
                </View>
            </View>
        );
    }
}
 
const styles = StyleSheet.create({
    viewInformation:{marginRight:"12%", height: 60, justifyContent:'center', alignItems:'center'},
    textInformation:{color:'white', fontFamily:'normal-font', fontWeight:"bold", fontSize:10},
    viewFavourites:{marginLeft:"15%", height: 60, justifyContent:'center',alignItems:'center'},
    textFavourites:{color:'white', fontFamily:'normal-font', fontSize:10, fontWeight:"bold"},
    iconButton:{padding:0, margin:0},
    viewBottom:{  position: 'absolute', borderTopLeftRadius:35, borderTopRightRadius:35, backgroundColor: '#094AA8', bottom: 0, zIndex: 1, width: '100%', height: 65, flexDirection: 'row', justifyContent: 'space-between'},
    fab:{ position: 'absolute',right: -1,bottom: -1,margin:8,backgroundColor:'#094AA8' },
    viewFab:{  position: 'absolute', alignSelf: 'center', backgroundColor: 'white', width: 70, height: 70, borderRadius: 35, bottom: 25, zIndex: 10 },
    viewContainer:{ position:'absolute', bottom:0, left:0, right:0, top:0}
})