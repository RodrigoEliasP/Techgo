import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, View, Image } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import api from '../../Services/api'
import { useAuth } from '../../Contexts/AuthContext';

export default  function DetalhesPedidoTecnico(){

    const nav = useNavigation();
    const [getImage,setImage] = useState({})
    const {getUserToken} = useAuth();
    const {params:{pedido}} = useRoute();
    const data_conclusao = new Date(pedido.data_conclusao)


    useEffect(()=>{
        pedido.Trabalhador &&
        Image.prefetch(pedido.Trabalhador.pfp).then(e=>{
            setImage({
                uri: pedido.Trabalhador.pfp + '?time=' + new Date(),
                width: 100,
                height: 100,
                method: 'GET',
                headers: {
                    Pragma: 'no-cache'
                },
            })
        });
    },[])

    function onPressEditar(){
        nav.navigate('Editar Pedido', {pedido})
    }
    
    function onPressDeletar(){
        try{
            
            Alert.alert("Atenção", "Deseja realmente deletar o pedido?", [
                {
                    onPress: async ()=>{
                        const token = `Bearer ${await getUserToken()}`
                        const response =  await api.delete(`pedidosDelete/${pedido.id_pedido}`,{
                            validateStatus: s=> s < 500,
                            headers:{
                                authorization: token
                            }
                        })
                        Alert.alert("Sucesso", response.data.mensagem, [{
                            text: 'ok',
                            onPress: ()=>nav.goBack()
                        }])
                    }
                }
            ]);
        }catch(e){
            Alert.alert(e.message)
        }
    }

    async function onPressRecusar(){
        try{
            const token = `Bearer ${await getUserToken()}`
            const response =  await api.patch(`pedidosDispatch/${pedido.id_pedido}`,null,{
                validateStatus: s=> s < 500,
                headers:{
                    authorization: token
                }
            })
            Alert.alert("Sucesso", response.data.mensagem, [{
                onPress: ()=>nav.goBack()
            }]);
        }catch(e){
            Alert.alert("Erro",e.message)
        }
    }

    async function onPressPagar(){
        try{
            const token = `Bearer ${await getUserToken()}`
            const response =  await api.patch(`pedidosPay/${pedido.id_pedido}`,null,{
                validateStatus: s=> s < 500,
                headers:{
                    authorization: token
                }
            })
            Alert.alert("Sucesso", response.data.mensagem, [{
                text: 'ok',
                onPress: ()=>nav.goBack()
            }]);
        }catch(e){
            Alert.alert("Erro", e.message)
        }
    }

    function renderizarUIPorStatusDoPedido(pedido){
        const {valor_fechado, status} = pedido;
        const trabalhador = pedido.Trabalhador;
        if(status == 'cobrar'){
            return(
                <>
                    <Text style={styles.title}>Informações do Técnico</Text>
                    <View style={styles.containerTechnician}>
                        <View>
                            <Text style={styles.text}>Foto:</Text>
                            {!getImage ? 
                                (<Image style={styles.technicianPfp} source={emptypfp}/>)
                                : 
                                (<Image style={styles.technicianPfp} source={getImage}/>)
                            }
                        </View>
                        <Text style={styles.text}>Nome: {'\n' + trabalhador.nome}</Text>
                        <Text style={styles.text}>Email: {'\n' + trabalhador.email}</Text>
                    </View>
                    <Text style={styles.statusText}>
                        Um técnico se propôs a realizar seu pedido por R${
                            valor_fechado.replace('.', ',')
                        }
                    </Text>
                    <View style={styles.containerBtn}>
                        <TouchableOpacity style={styles.btnSuccess} onPress={onPressPagar}>
                            <Text style={styles.txtBtn}>Pagar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnError} onPress={onPressRecusar}>
                            <Text style={styles.txtBtn}>Recusar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }else if(status == 'fechado'){
            return(
                <>
                    <Text style={styles.title}>Informações do Técnico</Text>
                    <View style={styles.containerTechnician}>
                        <Text style={styles.text}>Foto:</Text>
                        {!getImage ? 
                            (<Image style={styles.technicianPfp} source={emptypfp}/>)
                            : 
                            (<Image style={styles.technicianPfp} source={getImage}/>)
                        }
                        <Text style={styles.text}>Nome: {'\n' + trabalhador.nome}</Text>
                        <Text style={styles.text}>Email: {'\n' + trabalhador.email}</Text>
                    </View>
                    <Text style={styles.statusText}>
                        Pedido fechado por R${
                            valor_fechado.replace('.', ',')
                        }
                    </Text>
                </>
            );
        }else{
            return(
                <>
                <Text style={styles.statusText}>
                    Pedido Pendente, aguarde um técnico
                </Text>
                <View style={styles.containerBtn}>
                    <TouchableOpacity style={styles.btnError} onPress={onPressDeletar}>
                        <Text style={styles.txtBtn}>Deletar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSuccess} onPress={onPressEditar}>
                        <Text style={styles.txtBtn}>Editar</Text>
                    </TouchableOpacity>
                </View>
                </>
            );
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.orderDetailContainer}>
                <Text style={styles.title}>Detalhes do pedido:</Text>
                <Text style={styles.text}>Localização do pedido: {'\n'+ pedido.localizacao}</Text>
                <Text style={styles.text}>Descrição do pedido: {'\n'+ pedido.descricao}</Text>
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
            {
                renderizarUIPorStatusDoPedido(pedido)
            }
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: "5%",
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20
    },
    text:{
        fontSize: 16
    },
    statusText:{
        fontSize: 16,
        fontWeight: 'bold',
        padding: 20,
    },
    containerBtn:{
        paddingHorizontal: 20,
        width: '100%',
        position: 'absolute',
        bottom: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderDetailContainer:{
        height: 200,
        justifyContent: 'space-around',
        padding: 10,
    },
    containerTechnician:{
        height: 300,
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#dedede'
    },
    technicianPfp:{
        borderRadius: 70,
    },
    txtBtn:{
        color: '#fff',
        alignSelf: 'center',
        fontSize: 20
    },
    btnError:{
        position: 'relative',
        backgroundColor: '#ff0000',
        marginTop: 10,
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    },
    btnSuccess:{
        position: 'relative',
        marginTop: 10,
        backgroundColor: '#00ff00',
        width: '40%',
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 9
    }
});