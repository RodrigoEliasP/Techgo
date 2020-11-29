import React, {useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, AsyncStorage, Text, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TopBar from '../../Components/TopBar';
import * as yup from 'yup';
import api from '../../Services/api';

export default function UsuarioCard(){
    const Nav = useNavigation();

    const [getNome, setNome] = useState('');
    const [getSenha, setSenha] = useState('');

    async function criarSessao(usuario){
        
        await AsyncStorage.setItem(
            'Session',
            JSON.stringify(usuario)
        );
    };

    const campos = yup.object().shape({
        nome: yup.string().required('Digite seu nome'),
        senha: yup.string().required('Digite sua senha'),
    })

    async function clickLogar(){
        try{
            const dados = {
                nome: getNome,
                senha: getSenha
            }
            campos.validateSync(dados);
            const response = await api.post('usuarioLog', dados  ,{
                validateStatus: status =>{
                    return status < 500
                },
            });
            if(response.data.error){
                throw new Error(response.data.error)
            }else{
                criarSessao(response.data);
                Nav.navigate('UsuarioMain');
            }
        }catch(e){
            Alert.alert('Atenção', e.message)
        }
        

    }

    function clickCadastro(){
        Nav.navigate('RegistroUsuario');
    }

    return(
        <SafeAreaView style={styles.container}>
            <TopBar nome="Login Usuário"/>
            <Text style={styles.logop}>Nome</Text>
            <TextInput onChangeText={setNome} style={styles.loginfield}/>
            <Text style={styles.logop}>Senha</Text>
            <TextInput secureTextEntry={true} onChangeText={setSenha} style={styles.loginfield}/>
            <TouchableOpacity onPress={clickLogar}>
            <Text style={styles.btnlogar}>
                    Entrar
                </Text>
            </TouchableOpacity>
            <Text style={styles.register}>Não tem uma conta?</Text>
            <TouchableOpacity >
                <Text style={styles.registerop} onPress={clickCadastro}>
                    Cadastre-se
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
        margin: "5%",
        justifyContent: "center"
    },
    logop:{
        fontWeight: "bold",

    },
    loginfield:{
        padding: 5,
        borderStyle: "solid",
        borderColor: "black",
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRadius: 2
    },
    btnlogar:{
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
        height: 40,
        alignSelf: "center",
        textAlign:"center",
        paddingTop: 5,
    },
    register:{
        marginTop:10,
        textAlign:"center"
    },
    registerop:{
        color:"#2486d1" ,
        fontWeight: "bold",
        textAlign:"center",
    },
});