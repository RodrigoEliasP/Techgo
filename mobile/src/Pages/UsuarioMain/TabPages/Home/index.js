import React, {useEffect, useState} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Text, StyleSheet, View} from 'react-native';

import Pendente from './TopTabPages/Pendentes'; 
import Fechado from './TopTabPages/Fechado'; 
import Cobrar from './TopTabPages/Cobrar'; 
import { useAuth } from '../../../../Contexts/AuthContext';

export default function Home(){
    const Tab = createMaterialTopTabNavigator();

    const [getUsuario, setUsuario] =  useState({});
    
    
    const {getUserInfos} = useAuth();

    useEffect(()=>{
        getUserInfos().then(e=>setUsuario(e))
    },[]);


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Seja bem vindo {getUsuario.nome}, Aqui estão os seus pedidos
                </Text>
            </View>
            <Tab.Navigator
            initialRouteName="Pendentes"
            tabBarOptions={{
                activeTintColor: '#e91e63',
                labelStyle: { fontSize: 12 },
                style: { backgroundColor: 'powderblue' },
            }}
            >
                <Tab.Screen
                    name="Pendentes"
                    component={Pendente}
                    options={{ tabBarLabel: 'Pendentes' }}
                />
                <Tab.Screen
                    name="Pagar"
                    component={Cobrar}
                    options={{ tabBarLabel: 'Pagar' }}
                />
                <Tab.Screen
                    name="Finalizados"
                    component={Fechado}
                    options={{ tabBarLabel: 'Finalizados' }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1
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