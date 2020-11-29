import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api';

export default function Home(){
    const nav = useNavigation();

    const [getUsuario, setUsuario] =  useState({});
    
    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(usuario){
            setUsuario(usuario);
        }else{
            nav.navigate('Index')
        }
    }


    async function onPressLogOut(){
        Alert.alert(
            'Sair',
            'Deseja sair?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    await AsyncStorage.removeItem('Session');
                    nav.navigate('Index');
                }
              },
              {
                text: 'Não',
                onPress: () => {},
                style: 'cancel'
              }
            ],
            { cancelable: false }
          );
    }
    async function onPressDeletar(){

        Alert.alert(
            'Deletar Conta',
            'Deletar a conta apagará todos seus dados, deseja continuar?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    const response = await api.delete(`usuariosDelete/${getUsuario.id}`);
                    Alert.alert(response.data.mensagem);
                    setTimeout(()=>{nav.navigate('Index')}, 2000)
                }
              },
              {
                text: 'Não',
                onPress: () => {},
                style: 'cancel'
              }
            ],
            { cancelable: false }
          );
    }

    useEffect(()=>{carregarUsuario();}, []);

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>
                Nome: {"\n"+getUsuario.nome}
            </Text>
            <Text style={styles.text}>
                Email: {"\n"+getUsuario.email}
            </Text>
            <View style={styles.containerBtn}>
                <TouchableOpacity style={styles.btn} onPress={onPressDeletar}>
                    <Text style={styles.textBtn}>
                        Deletar Conta
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={onPressLogOut}>
                    <Text style={styles.textBtn}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
    },
    containerBtn:{
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: '100%'
    },
    text: {
        fontSize:18,
        lineHeight: 30
    },
    textBtn: {
        fontSize:18,
        lineHeight: 30,
        color:'#FFF'
    },
    btn:{
        backgroundColor: '#ff0000',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    }
});