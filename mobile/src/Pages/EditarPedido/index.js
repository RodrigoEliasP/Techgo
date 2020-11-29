import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, TouchableOpacity, Alert, TextInput, View} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from '../../Components/TopBar';
import api from '../../Services/api';

import * as yup from 'yup'

export default function Home(){
    const nav = useNavigation();
    const route = useRoute();
    const pedido = route.params.pedido;
    const [getLocalizacao, setLocalizacao] = useState('');
    const [getDescricao, setDescricao] = useState('');
    
    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(!usuario){
            nav.navigate('Index');
        }
    }
    const campos = yup.object().shape({
        localizacao: yup.string().required('Digite a localização'),
        descricao: yup.string().required('Coloque Uma descrição válida')//.min(30, 'Descrição insuficiente')
    });

    async function onPressEditar(){
        try{
            const dados = {
                descricao: getDescricao,
                localizacao: getLocalizacao
            }

            campos.validateSync(dados);

            const resolve = await api.put('pedidosPut', 
            {
                ...dados,
                id: pedido.id_pedido
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
            }, 1000)

        }catch(e){
            Alert.alert(e.message);
        }
    }

    useEffect(()=>{carregarUsuario();}, []);

    return(
        <SafeAreaView style={styles.container}>
            <TopBar/>
            <Text style={styles.titulo}>EditarPedido:</Text>
            <View style={styles.formContainer}>
                <View style={styles.fieldControl}>
                    <Text>Edite sua localização:</Text>
                    <TextInput style={styles.field} defaultValue={pedido.localizacao} onChangeText={setLocalizacao}/>
                </View>
                <View style={styles.fieldControl}>
                    <Text>Edite a descrição:</Text>
                    <TextInput multiline={true} defaultValue={pedido.descricao} style={styles.descField} onChangeText={setDescricao}/>
                </View>
                <TouchableOpacity style={styles.btn} onPress={onPressEditar}>
                        <Text style={styles.btnTxt}>
                            Criar
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
        margin: '5%'
    },
    titulo:{
        marginTop: '10%',
        fontSize: 16,
        fontWeight: 'bold'
    },
    formContainer:{
        marginTop: 40
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
    descField:{
        height: 200,
        textAlign: 'justify',
        textAlignVertical: 'top',
        padding: 5,
        borderStyle: "solid",
        borderColor: "black",
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRadius: 2
    },
    btn:{
        marginTop: 50,
        color: "white",
        fontWeight: "bold",
        backgroundColor: "#3d3d3d",
        borderStyle: "solid", 
        borderColor: "#3d3d3d",
        borderWidth: 5,
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        width:"80%",
        height: 50,
        alignSelf: "center",
        textAlign:"center",
        paddingTop: 5,
    },
    btnTxt:{
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    fieldControl:{
        marginTop: 30
    }
});