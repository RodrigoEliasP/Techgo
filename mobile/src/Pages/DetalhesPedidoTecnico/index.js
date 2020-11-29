import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, AsyncStorage, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import {useNavigation, useRoute} from '@react-navigation/native';
import TopBar from '../../Components/TopBar';
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
    function bindar(status){
        switch(status){
            case 'pendente':
                return (
                    <>
                        <TextInputMask 
                        style={styles.field}
                        value={getCobrança}
                        type={'money'}
                        onChangeText={setCobrança} />
                        <TouchableOpacity style={styles.btnCobrar} onPress={onPressCobrar}>
                            <Text style={styles.txtBtn}>Cobrar</Text>
                        </TouchableOpacity>
                    </>
                )
            case 'cobrar':
                return(
                    <Text style={styles.text}>Em andamento, aguarde seu Pagamento ou Rejeição</Text>
                );
            case 'fechado':
                return(
                    <Text style={styles.text}>
                    Pedido fechado por R${
                        pedido.valor_fechado.replace('.', ',')
                    }
                    </Text>
                )
        }
    }

    useEffect(()=>{carregarTecnico()},[]);

    return (
        <SafeAreaView style={styles.container}>
            <TopBar/>
            <Text style={styles.title}>Detalhes do pedido:</Text>
            <Text style={styles.text}>Localização do pedido: {'\n'+pedido.localizacao}</Text>
            <Text style={styles.text}>Descrição do pedido: {'\n'+pedido.descricao}</Text>
            <Text style={styles.text}>Informações sobre o emissor:</Text>
            <Text style={styles.text}>Nome do Emissor: {'\n'+pedido.usuario.nome}</Text>
            <Text style={styles.text}>Email para contato: {'\n'+pedido.usuario.email}</Text>
            <View>
                {
                    bindar(pedido.status)
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
        margin: '5%'
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
    field:{
        padding: 5,
        borderStyle: "solid",
        borderColor: "black",
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRadius: 2
    },
    btnCobrar:{
        marginTop: 30,
        alignSelf: 'center',
        backgroundColor: '#00ff00',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    }
});