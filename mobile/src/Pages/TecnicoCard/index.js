import React, {useState} from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity ,TextInput, Alert, AsyncStorage} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from '../../Services/api';

export default function TecnicoCard(){
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
            const response = await api.post('tecnicoLog', {
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
                Nav.navigate('TecnicoMain')
            }
        }catch(e){
            Alert.alert('Atenção', e.message)
        }
        

    }
    
    function clickCadastro(){
        Nav.navigate('RegistroTecnico');
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
            <TouchableOpacity onPress={clickCadastro}>
                <Text>
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