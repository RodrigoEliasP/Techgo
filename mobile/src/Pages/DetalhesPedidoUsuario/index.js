import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import api from '../../Services/api'

export default function DetalhesPedidoTecnico(){

    const nav = useNavigation();
    const route = useRoute();
    const pedido = route.params.pedido;

    const [getUsuario, setUsuario] =  useState({});
    
    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(usuario){
            setUsuario(usuario);
        }else{
            nav.navigate('Index')
        }
    }

    function bindpagar(pedido){
        const {trabalhadores_id, valor_fechado, data_conclusao} = pedido;
        if(trabalhadores_id != null && data_conclusao == null){
            return(
                <>
                    <Text>
                        Um técnico se propos a fazer seu pedido por R${
                            valor_fechado.replace('.', ',')
                        }
                    </Text>
                    <TouchableOpacity onPress={onPressPagar}>
                        <Text>Pagar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressRecusar}>
                        <Text>Recusar</Text>
                    </TouchableOpacity>
                </>
            );
        }else if(trabalhadores_id != null && trabalhadores_id != null){
            return(
                <Text>
                    Pedido fechado por R${
                        valor_fechado.replace('.', ',')
                    }
                </Text>
            );
        }else{
            return(
                <Text>
                    Pedido Pendente, aguarde um técnico
                </Text>
            );
        }
    }

    async function onPressRecusar(){
        try{
            const response =  await api.patch(`pedidosDispatch/${pedido.id_pedido}`,null,{
                validateStatus: s=>{return s<500}
            })
            Alert.alert(response.data.mensagem);
            setTimeout(()=>nav.goBack(), 2000);
        }catch(e){
            Alert.alert(e.menssage)
        }
    }

    async function onPressPagar(){
        try{
            const response =  await api.patch(`pedidosPay/${pedido.id_pedido}`,null,{
                validateStatus: s=>{return s<500}
            })
            Alert.alert(response.data.mensagem);
            setTimeout(()=>nav.goBack(), 2000);
        }catch(e){
            Alert.alert(e.menssage)
        }
    }

    useEffect(()=>{carregarUsuario()},[]);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Detalhes do pedido:</Text>
            <Text>Localização do pedido: {pedido.localizacao}</Text>
            <Text>Descrição do pedido: {pedido.descricao}</Text>
            {
                bindpagar(pedido)
            }
            
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