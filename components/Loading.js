import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


function Loading(props){


    return(
            <View>
                <ActivityIndicator animating={props.isDataLoading} color={'#094AA8'} />
            </View>
    )
};

export default Loading;