import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, View} from 'react-native';

import api from '../../../../Services/api';
import { useAuth } from '../../../../Contexts/AuthContext';

export default function Home(){

    const [getTecnico, setTecnico] =  useState({});
    const {getUserInfos, getUserToken, killSession} = useAuth()

    async function onPressPagar(){
        const token = `Bearer ${await getUserToken()}`
        const response = await api.patch(`tecnicosPremium/`, null, {
            headers:{
                authorization: token
            }
        });
        Alert.alert(response.data.mensagem, 'logue novamente para ativar seu premium', 
        [{
            text: 'ok',
            onPress: async () => {
                await killSession();
            }
        }]);
    }

    useEffect(()=>{
        getUserInfos().then(e=>setTecnico(e)).catch(e=>{})
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Para trabalhar conosco é necessário ser um usuário premium!
            </Text>

            <View>{
                getTecnico.status == 'premium'? 
                (<Text style={styles.text}>
                    Status: Você já premium vá para Home/Procurar para achar algum pedido
                </Text>) : 
                (<>
                    <Text style={styles.text}>
                        Freemium, Assine o pacote por R$50,00 e venha trabalhar conosco!
                    </Text>
                    <TouchableOpacity style={styles.btnPremium} onPress={onPressPagar}>
                        <Text style={styles.btnText}>
                            Pagar
                        </Text>
                    </TouchableOpacity>
                </> )}
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
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 50
    },
    text:{
        fontSize: 16,
    },
    btnText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        alignSelf: 'center'
    },
    btnPremium:{
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
});