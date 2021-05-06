import React, {useState, useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Text, StyleSheet, View} from 'react-native';

import Procurar from './TopTabPages/Procurar'; 
import Fechado from './TopTabPages/Fechados'; 
import Cobrar from './TopTabPages/Cobrar'; 
import { useAuth } from '../../../../Contexts/AuthContext';

export default function Home(){

    const Tab = createMaterialTopTabNavigator();

    const {getUserInfos} = useAuth();
    const [getTecnico, setTecnico] = useState({});

    useEffect(
        ()=>{
            getUserInfos().then(e=>setTecnico(e)).catch(e=>{})
        },
        []
    );

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