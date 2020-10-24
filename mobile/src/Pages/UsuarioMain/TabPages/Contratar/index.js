import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api';

import * as yup from 'yup'

export default function Home(){
    const nav = useNavigation();

    const [getUsuario, setUsuario] =  useState({});
    const [getLocalizacao, setLocalizacao] = useState('');
    const [getDescricao, setDescricao] = useState('');
    
    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(usuario){
            setUsuario(usuario);
        }else{
            nav.navigate('Index');
        }
    }
    const campos = yup.object().shape({
        localizacao: yup.string().required('Digite a localização'),
        descricao: yup.string().required('Crie Uma descrição')
    });

    async function onPressCriar(){
        try{
            const dados = {
                descricao: getDescricao,
                localizacao: getLocalizacao
            }

            campos.validateSync(dados);

            const resolve = await api.post('pedidosPost', 
            {
                ...dados,
                usuario: getUsuario.id
            }
            ,{
                validateStatus: status => {
                    return status < 500;
                }
            });
            if(resolve.data.error){
                throw new Error(resolve.data.error);
            }
            Alert.alert(resolve.data.mensagem);
            setTimeout(()=>{
                nav.navigate('Home');
            }, 2000)

        }catch(e){
            Alert.alert(e.message);
        }
    }

    useEffect(()=>{carregarUsuario();}, []);

    return(
        <SafeAreaView style={styles.container}>
           <Text>Para criar um pedido nos informe:</Text>
           <Text>Sua localização:</Text>
           <TextInput onChangeText={setLocalizacao}/>
           <Text>Crie uma descrição:</Text>
           <TextInput onChangeText={setDescricao}/>
           <TouchableOpacity onPress={onPressCriar}>
                <Text>
                    Criar
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