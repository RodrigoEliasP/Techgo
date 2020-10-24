import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert} from 'react-native';
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
            <Text>
                Nome: {getUsuario.nome}
            </Text>
            <Text>
                Email: {getUsuario.email}
            </Text>
            <TouchableOpacity onPress={onPressDeletar}>
                <Text>
                    Deletar Conta
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
    }
});