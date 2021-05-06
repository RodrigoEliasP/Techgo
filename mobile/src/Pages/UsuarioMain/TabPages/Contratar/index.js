import React, { useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, TextInput, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api';

import * as yup from 'yup'
import { useAuth } from '../../../../Contexts/AuthContext';

export default function Home(){
    const nav = useNavigation();
    const {getUserToken} = useAuth();

    const [getLocalizacao, setLocalizacao] = useState('');
    const [getDescricao, setDescricao] = useState('');
    
    
    const campos = yup.object().shape({
        localizacao: yup.string().required('Digite a localização'),
        descricao: yup.string().required('Crie Uma descrição')//.min(30, 'Descrição insuficiente')
    });

    async function onPressCriar(){
        try{
            const dados = {
                descricao: getDescricao,
                localizacao: getLocalizacao
            }

            campos.validateSync(dados);

            const token = `Bearer ${await getUserToken()}`;

            const resolve = await api.post('pedidosPost', 
            {
                ...dados,
            },
            {
                headers:{
                    authorization: token
                },
                validateStatus: status => {
                    return status < 500;
                }
            });
            if(resolve.data.error){
                throw new Error(resolve.data.error);
            }
            Alert.alert("sucesso", resolve.data.mensagem, [{
                text: "ok",
                onPress: () => nav.navigate('Home')
            }]);

        }catch(e){
            Alert.alert("Erro", e.message);
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Para criar um pedido nos informe:</Text>
            <View style={styles.formContainer}>
                <View style={styles.fieldControl}>
                    <Text>Sua localização:</Text>
                    <TextInput style={styles.field} onChangeText={setLocalizacao}/>
                </View>
                <View style={styles.fieldControl}>
                    <Text>Crie uma descrição:</Text>
                    <TextInput multiline={true} style={styles.descField} onChangeText={setDescricao}/>
                </View>
                <TouchableOpacity style={styles.btn} onPress={onPressCriar}>
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

    },
    titulo:{
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