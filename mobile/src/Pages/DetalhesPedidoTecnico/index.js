import React, { useState, useEffect} from 'react';
import { 
    SafeAreaView, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
    Alert,
    Image
 } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import {useNavigation, useRoute} from '@react-navigation/native';

import emptypfp from '../../../assets/emptypfp.jpg';
import api from '../../Services/api'
import { useAuth } from '../../Contexts/AuthContext';

export default function DetalhesPedidoTecnico(){

    const nav = useNavigation();
    const route = useRoute();
    const pedido = route.params.pedido;
    const data_conclusao = new Date(pedido.data_conclusao)
    const {Usuario} = pedido;
    


    const [ getCobranca, setCobranca ] = useState('');
    const [ getImage, setImage ] = useState({});
    const {getUserToken} = useAuth()

    useEffect(()=>{
        
        Image.prefetch(Usuario.pfp).then(e=>{
            e && setImage({
                uri: Usuario.pfp + '?time=' + new Date(),
                width: 100,
                height: 100,
                method: 'GET',
                headers: {
                    Pragma: 'no-cache'
                },
            })
        });
    },[])

    async function onPressCobrar(){
        try{
            const valor_fechado = Number(getCobranca.replace(/[R$]/g, '').replace(/,/, '.'))
            const token = `Bearer ${await getUserToken()}`
            const dados = {
                valor_fechado,
                id_pedido: pedido.id_pedido
            }
            const response = await api.put('pedidosDemand', dados, {
                headers:{
                    authorization: token
                },
                validateStatus: status=>{
                    return status < 500
                }
            });
            if(response.data.error){
                throw new Error(response.data.error)
            }
            Alert.alert("Sucesso", response.data.mensagem, [{
                text: "ok",
                onPress: () => nav.goBack()
            }]);
        }catch(err){
            Alert.alert("Erro", err.message)
        }
    }
    function renderizarUIPorStatus(status){
        switch(status){
            case 'pendente':
                return (
                    <>
                        <TextInputMask 
                        style={styles.field}
                        value={getCobranca}
                        type={'money'}
                        onChangeText={setCobranca} />
                        <TouchableOpacity style={styles.btnCobrar} onPress={onPressCobrar}>
                            <Text style={styles.txtBtn}>Cobrar</Text>
                        </TouchableOpacity>
                    </>
                )
            case 'cobrar':
                return(
                    <Text style={styles.text}>Em andamento, aguarde seu Pagamento ou Rejeição</Text>
                );
            case 'fechado':
                return(
                    <Text style={styles.text}>
                    Pedido fechado por R${
                        pedido.valor_fechado.replace('.', ',')
                    }
                    </Text>
                )
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Detalhes do pedido:</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.text}>Localização: {'\n'+pedido.localizacao}</Text>
                <Text style={styles.text}>Descrição: {'\n'+pedido.descricao}</Text>
                {
                    pedido.status === 'fechado' && 
                    <Text style={styles.text}>
                        data de conclusão: 
                        {'\n' + data_conclusao.getDate()+'/'
                        +data_conclusao.getMonth()+'/'
                        +data_conclusao.getFullYear()}
                    </Text>
                }
            </View>
            <Text style={styles.title}>Informações sobre o emissor:</Text>
            <View style={styles.emitterContainer}>
                <View>
                    {!getImage ? (<Image style={styles.emitterPfp} source={emptypfp}/>): (<Image style={styles.emitterPfp} source={getImage}/>)}
                </View>
                <Text style={styles.text}>Nome: {'\n'+Usuario.nome}</Text>
                <Text style={styles.text}>Email: {'\n'+Usuario.email}</Text>
            </View>
            <View>
                {
                    renderizarUIPorStatus(pedido.status)
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: '5%'
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20
    },
    text:{
        fontSize: 16,
    },
    containerBtn:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtBtn:{
        color: '#fff',
        alignSelf: 'center',
        fontSize: 20
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
    btnCobrar:{
        marginTop: 30,
        alignSelf: 'center',
        backgroundColor: '#00ff00',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    }, 
    detailContainer:{
        minHeight: 150,
        maxHeight: 200,
        width: '100%',
        justifyContent: 'space-around',
        alignContent: 'center'
    },
    emitterContainer:{
        height: 250,
        paddingHorizontal: 30,
        justifyContent: 'space-evenly',
        backgroundColor: '#dedede',
        marginBottom: 20,
    }, 
    emitterPfp: {
        width: 100,
        height: 100,
        borderRadius: 70
    }
});