import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, AsyncStorage, Alert, View } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import TopBar from '../../Components/TopBar'
import api from '../../Services/api'

export default function DetalhesPedidoTecnico(){

    const nav = useNavigation();
    const route = useRoute();
    const pedido = route.params.pedido;
    
    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(!usuario){
            nav.navigate('Index')
        }
    }
    function onPressEditar(){
        nav.navigate('EditarPedido', {pedido})
    }
    async function onPressDeletar(){
        try{
            const response =  await api.patch(`pedidosDelete/${pedido.id_pedido}`,null,{
                validateStatus: s=>{return s<500}
            })
            Alert.alert(response.data.mensagem);
            setTimeout(()=>nav.goBack(), 2000);
        }catch(e){
            Alert.alert(e.menssage)
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

    function bindpagar(pedido){
        const {valor_fechado, status} = pedido;
        const usuario = pedido.trabalhadore;
        const data_conclusao = new Date(pedido.data_conclusao)
        if(status == 'cobrar'){
            return(
                <>
                    <Text style={styles.text}>Técnico: {'\n' + usuario.nome}</Text>
                    <Text style={styles.text}>Email: {'\n' + usuario.email}</Text>
                    <Text style={styles.text}>
                        Um técnico se propôs a realizar seu pedido por R${
                            valor_fechado.replace('.', ',')
                        }
                    </Text>
                    <View style={styles.containerBtn}>
                        <TouchableOpacity style={styles.btnSuccess} onPress={onPressPagar}>
                            <Text style={styles.txtBtn}>Pagar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnError} onPress={onPressRecusar}>
                            <Text style={styles.txtBtn}>Recusar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }else if(status == 'fechado'){
            return(
                <>

                    <Text style={styles.text}>data de conclusão {'\n' + data_conclusao.getDate()+'/'+data_conclusao.getMonth()+'/'+data_conclusao.getFullYear()}</Text>
                    <Text style={styles.text}>Técnico: {'\n' + usuario.nome}</Text>
                    <Text style={styles.text}>Email: {'\n' + usuario.email}</Text>
                    <Text style={styles.text}>
                        Pedido fechado por R${
                            valor_fechado.replace('.', ',')
                        }
                    </Text>
                </>
            );
        }else{
            return(
                <>
                <Text style={styles.text}>
                    Pedido Pendente, aguarde um técnico
                </Text>
                <View style={styles.containerBtn}>
                    <TouchableOpacity style={styles.btnError} onPress={onPressDeletar}>
                        <Text style={styles.txtBtn}>Deletar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSuccess} onPress={onPressEditar}>
                        <Text style={styles.txtBtn}>Editar</Text>
                    </TouchableOpacity>
                </View>
                </>
            );
        }
    }

    useEffect(()=>{carregarUsuario()},[]);

    return (
        <SafeAreaView style={styles.container}>
            <TopBar/>
            <Text style={styles.title}>Detalhes do pedido:</Text>
            <Text style={styles.text}>Localização do pedido: {'\n'+ pedido.localizacao}</Text>
            <Text style={styles.text}>Descrição do pedido: {'\n'+ pedido.descricao}</Text>
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
        margin: "5%",
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20
    },
    text:{
        fontSize: 16,
        marginBottom: 20
    },
    containerBtn:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtBtn:{
        color: '#fff',
        alignSelf: 'center',
        fontSize: 20
    },
    btnError:{
        backgroundColor: '#ff0000',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    },
    btnSuccess:{
        backgroundColor: '#00ff00',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    }
});