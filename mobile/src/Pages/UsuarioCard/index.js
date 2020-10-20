import React, {useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, AsyncStorage, Text, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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

    async function clickLogar(){
        try{
            const response = await api.post('usuarioLog', {
                nome: getNome,
                senha: getSenha
            },{
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
            <Text  >Nome</Text>
            <TextInput onChangeText={setNome} />
            <Text>Senha</Text>
            <TextInput onChangeText={setSenha}/>
            <TouchableOpacity onPress={clickLogar}>
                <Text>
                    Logar
                </Text>
            </TouchableOpacity>
            <Text>Não tem uma conta? Cadastre-se</Text>
            <TouchableOpacity >
                <Text onPress={clickCadastro}>
                    Cadastrar
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