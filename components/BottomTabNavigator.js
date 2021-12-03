import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FAB, Button, IconButton } from 'react-native-paper';

export default class BottomNavigator extends React.Component {

    constructor(){
        super();
    }

    render() {
        return (
            <View style={{ position:'absolute', bottom:0, left:0, right:0, top:0}}> 
                <View style={{  position: 'absolute', 
                                alignSelf: 'center', 
                                backgroundColor: 'white', 
                                width: 70, height: 70, 
                                borderRadius: 35, 
                                bottom: 25, 
                                zIndex: 10 }}>
                    <FAB
                        style={{    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    margin:8,
                                    backgroundColor:'#094AA8',
                                }}
                        icon="navigation"
                        color="white"
                        onPress={ () => this.props.navigation.navigate("NavigationScreen",{ ...this.props.data })}
                    />
                </View>
                <View style={{  position: 'absolute', 
                                borderTopLeftRadius:35, borderTopRightRadius:35, 
                                backgroundColor: '#094AA8', 
                                bottom: 0, zIndex: 1, 
                                width: '100%', 
                                height: 65, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between', 
                                }}>
                        <View style={{marginLeft:"15%", height: 60, justifyContent:'center',alignItems:'center'}}>
                            <IconButton
                                icon="account-circle"
                                color={'white'}
                                size={25}
                                onPress={() => this.props.navigation.navigate("Profile")}
                                style={{padding:0, margin:0}}
                            />
                            <Text style={{color:'white', fontFamily:'normal-font', fontSize:10, fontWeight:"bold"}}>PROFILE</Text>
                        </View>
                        <View style={{marginRight:"12%", height: 60, justifyContent:'center', alignItems:'center'}}>
                            <IconButton
                                icon="bell"
                                color={'white'}
                                size={25}
                                onPress={() => console.log('Pressed')}
                                style={{padding:0, margin:0}}
                            />
                            <Text style={{color:'white', fontFamily:'normal-font', fontWeight:"bold", fontSize:10}}>NOTIFICATIONS</Text>
                        </View>
                </View>
            </View>
        );
    }
}