import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Text, AsyncStorage, StyleSheet, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Pendente from './TopTabPages/Pendentes'; 
import Fechado from './TopTabPages/Fechado'; 
import Cobrar from './TopTabPages/Cobrar'; 

export default function Home(){
    const nav = useNavigation();
    const Tab = createMaterialTopTabNavigator();

    const [getUsuario, setUsuario] =  useState({});
    

    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(usuario){
            setUsuario(usuario);
        }else{
            nav.navigate('Index')
        }
    }
    
   

    useEffect(()=>{
        carregarUsuario()
    },[]);


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Seja bem vindo {getUsuario.nome}, Aqui estão os seus pedidos
                </Text>
            </View>
            <Tab.Navigator
            initialRouteName="Feed"
            tabBarOptions={{
                activeTintColor: '#e91e63',
                labelStyle: { fontSize: 12 },
                style: { backgroundColor: 'powderblue' },
            }}
            >
                <Tab.Screen
                    name="Feed"
                    component={Pendente}
                    options={{ tabBarLabel: 'Pendentes' }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={Cobrar}
                    options={{ tabBarLabel: 'Pagar' }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Fechado}
                    options={{ tabBarLabel: 'Finalizados' }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: Constants.statusBarHeight + 20
    },
    title:{
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 30,
        fontWeight: 'bold'
    },
    header:{
        paddingHorizontal: 24,
        borderBottomWidth: 1
    },
});