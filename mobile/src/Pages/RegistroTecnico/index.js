import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import RNPickerSelect from 'react-native-picker-select';
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
            <TopBar/>
            <Text style={styles.tittle}>Preencha os campos</Text>
            <View style={styles.formContainer}>
                <Text style={styles.formText}>Nome:</Text>
                <TextInput style={styles.cadField} onChangeText={setNome}></TextInput>

                <Text style={styles.formText}>CPF:</Text>
                <TextInputMask
                style={styles.cadField} 
                onChangeText={setCpf}
                value={getCpf}
                type={'cpf'}
                />

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
                <TextInput style={styles.cadField} secureTextEntry={true} onChangeText={setSenha}></TextInput>

                <Text style={styles.formText}>Categoria:</Text>
                <RNPickerSelect
                style={picker}
                onValueChange={handleValueChangeCategoria}
                placeholder={{label:'Selecione sua categoria'}}
                items={
                    getCategorias.map(categoria=>{
                        return {label: categoria.Nome, value: categoria.id}
                    })
                }  
                ></RNPickerSelect>
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
const picker = {
    inputAndroid:{
        color:'black',
        padding: 5,
    },
    inputIOS:{
        color:'black'
    }
}