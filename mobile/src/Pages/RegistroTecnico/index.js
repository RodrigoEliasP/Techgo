import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';

import api from '../../Services/api';


export default function RegistroTecnico(){
    const Nav = useNavigation();

    const [getCpf, setCpf] = useState('');
    const [getNascimento, setNascimento] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getNome, setNome] = useState('');
    const [getSenha, setSenha] = useState('');
    const [getCategoria, setCategoria] = useState('');
    const [getCategorias, setCategorias] = useState([]);

    const campos = yup.object().shape({
        cpf: yup.string().length(11, 'cpf inválido').required('preencha o campo cpf'),
        nome: yup.string().min(10, 'nome muito pequeno').required('preencha o campo nome'),
        nascimento: yup.date().required('preencha o campo nascimento'),
        senha: yup.string().min(6, 'senha muito pequena').required('preencha a senha'),
        email: yup.string().email('digite um email valido').required('preencha o campo email'),
        categoria: yup.string().required('selecione uma categoria')
    });


    function handleValueChangeCategoria(value){
        setCategoria(value);
    }

    async function onPressCadastrar(){
        try{
            const tempo = getNascimento.split('/');
            const dados = {
                cpf: getCpf.replace( /[-.]/g , ''),
                nome: getNome,
                nascimento: new Date(tempo[1]+'/'+tempo[0]+'/'+tempo[2]),
                senha: getSenha,
                email: getEmail,
                categoria: getCategoria
            }
            campos.validateSync(dados);
            const response = await api.post('tecnicosPost', dados,{
                validateStatus: status => {
                    return status < 500;
                }
            });
            
            if(response.data.error){
                throw new Error(response.data.error)
            }
            Alert.alert(response.data.mensagem);
            setTimeout(()=>{
                Nav.goBack();
            }, 2000)
        }catch(e){
            Alert.alert(e.message)
        }
    }

    async function loadCategorias(){
        const result = await api.get('categoriasGet');
        setCategorias(result.data);
    }

    useEffect(()=>{loadCategorias();},[]);

    return(
        <SafeAreaView style={styles.container}>
            <Text>Preencha os campos</Text>
            <Text>nome</Text>
            <TextInput onChangeText={setNome}></TextInput>

            <Text>cpf</Text>
            <TextInputMask 
              onChangeText={setCpf}
              value={getCpf}
              type={'cpf'}
            ></TextInputMask>

            <Text>Nascimento</Text>
            <TextInputMask 
              onChangeText={setNascimento}
              value={getNascimento}
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY'
              }}
            ></TextInputMask>

            <Text>email</Text>
            <TextInput textContentType={"emailAddress"} onChangeText={setEmail}></TextInput >

            <Text>senha</Text>
            <TextInput secureTextEntry={true} onChangeText={setSenha}></TextInput>

            <Text>Categoria</Text>
            <RNPickerSelect
              style={{inputAndroid:{
                  color:'black'
              }}}
              onValueChange={handleValueChangeCategoria}
              placeholder={{label:'Selecione sua categoria'}}
              items={
                  getCategorias.map(categoria=>{
                      return {label: categoria.Nome, value: categoria.id}
                  })
              }  
            ></RNPickerSelect>
            <TouchableOpacity onPress={onPressCadastrar}>
                <Text>Cadastrar</Text>
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