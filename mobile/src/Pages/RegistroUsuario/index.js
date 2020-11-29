import React, {useState} from 'react';
import Constants from 'expo-constants';
import {SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {useNavigation} from '@react-navigation/native';
import TopBar from '../../Components/TopBar';
import * as yup from 'yup';

import api from '../../Services/api';


export default function RegistroTecnico(){
    const Nav = useNavigation();

    const [getCpf, setCpf] = useState('');
    const [getNascimento, setNascimento] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getNome, setNome] = useState('');
    const [getSenha, setSenha] = useState('');

    const campos = yup.object().shape({
        cpf: yup.string().length(11, 'cpf inválido').required('preencha o campo cpf'),
        nome: yup.string().min(10, 'nome muito pequeno').required('preencha o campo nome'),
        nascimento: yup.date().required('preencha o campo nascimento'),
        senha: yup.string().min(6, 'senha muito pequena').required('preencha a senha'),
        email: yup.string().email('digite um email valido').required('preencha o campo email')
    });



    async function onPressCadastrar(){
        try{

            const tempo = getNascimento.split('/');

            const dados = {
                cpf: getCpf.replace( /[-.]/g , ''),
                nome: getNome,
                nascimento: new Date(tempo[1]+'/'+tempo[0]+'/'+tempo[2]),
                senha: getSenha,
                email: getEmail,
            }

            campos.validateSync(dados);
            
            const resolve = await api.post('usuariosPost', dados,{
                validateStatus: status => {
                    return status < 500;
                }
            });
            
            if(resolve.data.error){
                throw new Error(resolve.data.error)
            }

            Alert.alert(resolve.data.mensagem);


            setTimeout(()=>{
                Nav.goBack();
            }, 2000)
        }catch(e){
            Alert.alert(e.message)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <TopBar/>
            <Text style={styles.tittle}>Preencha os campos</Text>
            <View style={styles.formContainer}>
                <Text style={styles.formText} >Nome:</Text>
                <TextInput style={styles.cadField} onChangeText={setNome}></TextInput>

                <Text style={styles.formText}>CPF:</Text>
                <TextInputMask
                style={styles.cadField} 
                onChangeText={setCpf}
                value={getCpf}
                type={'cpf'}
                ></TextInputMask>

                <Text style={styles.formText}>Nascimento:</Text>
                <TextInputMask 
                style={styles.cadField}
                onChangeText={setNascimento}
                value={getNascimento}
                type={'datetime'}
                options={{
                    format: 'DD/MM/YYYY'
                }}
                />

                <Text style={styles.formText}>Email:</Text>
                <TextInput 
                style={styles.cadField}
                textContentType={"emailAddress"} 
                onChangeText={setEmail}/>

                <Text style={styles.formText}>Senha:</Text>
                <TextInput 
                style={styles.cadField}
                secureTextEntry={true}
                onChangeText={setSenha}></TextInput>
            </View>

            <TouchableOpacity style={styles.btnCadastrar} onPress={onPressCadastrar}>
                <Text style={styles.cadBtnTxt}>Cadastrar</Text>
            </TouchableOpacity>
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
    tittle:{
        fontSize: 20,
        alignSelf: 'center'
    },
    formContainer:{
        marginTop: 20,
        
    },
    formText:{
        fontSize: 16,
        marginTop: 20
    },
    cadField:{
        padding: 5,
        borderStyle: "solid",
        borderColor: "black",
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRadius: 2
    },
    btnCadastrar:{
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
    cadBtnTxt:{
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    }
});