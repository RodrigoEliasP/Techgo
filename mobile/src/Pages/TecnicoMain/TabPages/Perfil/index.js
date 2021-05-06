import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    SafeAreaView, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    View,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import emptypfp from '../../../../../assets/emptypfp.jpg';
import api from '../../../../Services/api';
import { useAuth } from '../../../../Contexts/AuthContext';

export default function Home(){

    const {getUserInfos, getUserToken, killSession} = useAuth();

    const [getImage, setImage] = useState('');
    const [getTecnico, setTecnico] = useState({});

    useEffect(
        ()=>{
            getUserInfos().then(e=>{
                setTecnico(e)
                e.pfp && setImage(e.pfp + '?time=' + new Date())
            })
        },
        []
    );

    useEffect(() => {
        (async () => { 
            const { status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === ImagePicker.PermissionStatus.DENIED) {
                alert('Nós precisamos da permissão para poder editar sua foto de perfil!');
            }
        })();
      }, []);

    async function onPressLogOut(){
        Alert.alert(
            'Sair',
            'Deseja sair?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    await killSession();
                }
              },
              {
                text: 'Não',
                onPress: () => {},
                style: 'cancel'
              }
            ],
            { cancelable: false }
          );
    }

    async function onPressEditPfp(){
        const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!permissions.granted){
            Alert.alert('Atenção','Nós precisamos da permissão para poder editar sua foto de perfil!');
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if(!result.cancelled){
                Alert.alert(
                    'Atenção',
                    'Você deseja realmente mudar sua foto de perfil?',
                    [{
                        text: 'Sim',
                        onPress: async () =>{
                            const formData = new FormData();
                            const imageLocalUri = String(result.uri);
                            const imageExtension = imageLocalUri.split('.')[imageLocalUri.split('.').length -1]
                            const imageType = 'image/' + imageExtension;
                            const userToken = `Bearer ${await getUserToken()}`
                            formData.append('image', {
                                uri: imageLocalUri,
                                type: imageType,
                                name: 'sentImg.' + imageExtension
                            });
                            api.patch('tecnicosPfp/', formData, {
                                headers:{
                                    authorization: userToken
                                }
                            }).then(res=>{
                                Alert.alert("Sucesso", res.data.mensagem)
                            }).catch(e=>{
                                console.log(e)
                                Alert.alert("Erro", e.response.data.error);
                            })
                            setImage(result.uri);
                        }
                    },
                    {
                        text: 'Não'
                    }
                ]
                );
                
            }
        }
    }

    async function onPressDeletar(){

        Alert.alert(
            'Deletar Conta',
            'Deletar a conta apagará todos seus dados, deseja continuar?',
            [
              {
                text: 'Sim',
                onPress: async () => {
                    const token =  `Bearer ${await getUserToken()}`
                    const response = await api.delete(`tecnicosDelete`, {
                        headers:{ 
                            authorization: token
                        }
                    });
                    Alert.alert("Atenção", response.data.mensagem);
                    await killSession()
                }
              },
              {
                text: 'Não',
                onPress: () => {},
                style: 'cancel'
              }
            ],
            { cancelable: false }
          );
    }



    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.pfpContainer}>
                {!getImage ? (<Image style={styles.pfp} source={emptypfp}/>): (<Image style={styles.pfp} source={{uri: getImage}}/>)}
                <TouchableOpacity onPress={onPressEditPfp} style={styles.btnPfpChange}>
                    <MaterialCommunityIcons style={styles.pfpIcon} name="pencil" color={'#000'} size={26} />
                    <Text style={styles.pfpBtnText}>Trocar Foto</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>
                Nome: {"\n"+ getTecnico.nome}
            </Text>
            <Text style={styles.text}>
                Email: {"\n"+ getTecnico.email}
            </Text>
            <View style={styles.containerBtn}>
                <TouchableOpacity style={styles.btn} onPress={onPressDeletar}>
                    <Text style={styles.textBtn}>
                        Deletar Conta
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={onPressLogOut}>
                    <Text style={styles.textBtn}>
                        Log Out
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
    containerBtn:{
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 100
    },
    text: {
        fontSize:18,
        lineHeight: 30
    },
    textBtn: {
        fontSize:18,
        lineHeight: 30,
        color:'#FFF'
    },
    btn:{
        backgroundColor: '#ff0000',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    },
    pfpContainer:{
        alignSelf: 'center'
    },
    pfp:{
        height: 200,
        width: 200,
        borderRadius: 100
    },
    pfpBtnText:{
        fontSize:20,
        lineHeight: 30,
        color:'#000',
        alignSelf: 'center'
    },
    pfpIcon:{
        alignSelf: 'center'
    },
    btnPfpChange: {
        marginTop:10,
        backgroundColor: '#DDD',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        width: 150,
        height: 40,
        borderRadius: 20,
    }
});