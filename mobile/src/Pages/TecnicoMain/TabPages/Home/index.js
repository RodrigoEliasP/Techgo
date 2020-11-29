import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Text, AsyncStorage, StyleSheet, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Procurar from './TopTabPages/Procurar'; 
import Fechado from './TopTabPages/Fechados'; 
import Cobrar from './TopTabPages/Cobrar'; 

export default function Home(){

    const Tab = createMaterialTopTabNavigator();

    const nav = useNavigation();

    const [getTecnico, setTecnico] =  useState({});

    async function carregarTecnico(){
        const tecnico = JSON.parse(await AsyncStorage.getItem('Session'));
        if(tecnico){
            setTecnico(tecnico);
        }else{
            nav.navigate('Index')
        }
    }

    useEffect(()=>{
        carregarTecnico();
    },[])

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Seja bem vindo {getTecnico.nome}, clique em um pedido para aceitá-lo
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
                    component={Procurar}
                    options={{ tabBarLabel: 'Procurar serviço' }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={Cobrar}
                    options={{ tabBarLabel: 'Em cobrança' }}
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