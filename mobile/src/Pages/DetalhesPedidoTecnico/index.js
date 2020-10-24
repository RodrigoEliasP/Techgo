import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, AsyncStorage, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import {useNavigation, useRoute} from '@react-navigation/native';
import api from '../../Services/api'

export default function DetalhesPedidoTecnico(){

    const nav = useNavigation();
    const route = useRoute();
    const pedido = route.params.pedido;


    const [ getCobrança, setCobrança ] = useState('');
    const [getTecnico, setTecnico] =  useState({});
    
    async function carregarTecnico(){
        const tecnico = JSON.parse(await AsyncStorage.getItem('Session'));
        if(tecnico){
            setTecnico(tecnico);
        }else{
            nav.navigate('Index')
        }
    }

    async function onPressCobrar(){
        try{
            const valor = Number(getCobrança.replace(/[R$]/g, '').replace(/,/, '.'))
            const dados = {
                trabalhador: getTecnico.id,
                valor_fechado: valor,
                id: pedido.id_pedido
                
            }
            const response = await api.put('pedidosDemand', dados, {
                validateStatus: status=>{
                    return status < 500
                }
            });
            if(response.data.error){
                throw new Error(response.data.error)
            }
            Alert.alert(response.data.mensagem);
            setTimeout(()=>{
                nav.goBack();
            }, 2000)

        }catch(err){
            Alert.alert(err.message)
        }
    }

    useEffect(()=>{carregarTecnico()},[]);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Detalhes do pedido:</Text>
            <Text>Localização do pedido: {pedido.localizacao}</Text>
            <Text>Descrição do pedido: {pedido.descricao}</Text>
            <Text>Informações sobre o emissor:</Text>
            <Text>Nome do Emissor: {pedido.usuario.nome}</Text>
            <Text>Email para contato: {pedido.usuario.email}</Text>
            <View>
                <TextInputMask 
                  value={getCobrança}
                  type={'money'}
                  onChangeText={setCobrança} />
                <TouchableOpacity onPress={onPressCobrar}>
                    <Text>Cobrar</Text>
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
    }
});