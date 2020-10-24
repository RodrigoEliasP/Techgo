import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert, View} from 'react-native';
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
            nav.navigate('Index');
        }
    }

    async function onPressPagar(){
        const response = await api.patch(`tecnicosPremium/${getTecnico.id}`);
        Alert.alert(response.data.mensagem, 'logue novamente para ativar seu premium');
        setTimeout(()=>{
                nav.navigate('Index')
            }
        ,2000);
    }

    useEffect(()=>{carregarTecnico();}, []);

    return(
        <SafeAreaView style={styles.container}>
            <Text>
                Para trabalhar conosco é necessário ser um usuário premium!
            </Text>

            <View>{
                getTecnico.status == 'premium'? 
                (<Text>
                    Status: {getTecnico.status}
                </Text>) : 
                (<>
                    <Text>
                        Freemium, Assine o pacote por R$50,00 e venha trabalhar conosco!
                    </Text>
                    <TouchableOpacity onPress={onPressPagar}>
                        <Text>
                            Pagar
                        </Text>
                    </TouchableOpacity>
                </> )}
            </View>
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