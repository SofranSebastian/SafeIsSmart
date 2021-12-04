import * as React from 'react';
import { TouchableOpacity,  Linking, Text, View, Image, Platform  } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


function Loading(props){


    return(
            <View>
                <ActivityIndicator animating={props.isDataLoading} color={'#094AA8'} />
            </View>
    )
};

export default Loading;