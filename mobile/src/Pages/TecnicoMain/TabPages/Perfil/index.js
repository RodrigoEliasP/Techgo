import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api';

export default function Home(){
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



    async function onPressDeletar(){

        Alert.alert(
            'Deletar Conta',
            'Deletar a conta apagará todos seus dados, deseja continuar?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    const response = await api.delete(`tecnicosDelete/${getTecnico.id}`);
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

    useEffect(()=>{carregarTecnico();}, []);

    return(
        <SafeAreaView style={styles.container}>
            <Text>
                Nome: {getTecnico.nome}
            </Text>
            <Text>
                Email: {getTecnico.email}
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