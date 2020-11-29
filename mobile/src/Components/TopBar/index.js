import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Constants from 'expo-constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TopBar(props){
    const nav = useNavigation();
    return(
        <View style={styles.container}>
            <MaterialCommunityIcons style={styles.back}  onPress={()=>{nav.goBack()}} name="arrow-left" size={30}/>
            <Text style={styles.text}>{props.nome}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 50,
        position: "absolute",
        top: Constants.statusBarHeight,
        alignItems: "flex-start",
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    back:{
        marginRight: '25%'
    },
    text:{
        fontSize: 25,
        fontWeight: 'bold'
    }
});