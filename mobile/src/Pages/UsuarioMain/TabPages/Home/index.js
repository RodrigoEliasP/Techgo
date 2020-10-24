import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api'

export default function Home(){
    const nav = useNavigation();

    const [getUsuario, setUsuario] =  useState({});
    const [getPedidos, setPedidos] = useState([]);
    const [total, setTotal] =  useState(0);
    const [getPage, setPage] =  useState(1);
    const [loading, setLoading] =  useState(false);

    async function carregarUsuario(){
        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));
        if(usuario){
            setUsuario(usuario);
        }else{
            nav.navigate('Index')
        }
    }

    async function loadPedidos(){
        if(loading){
            return;
        }

        if(total > 0 && getPedidos.length === total){
            return;
        }

        setLoading(true);

        const usuario = JSON.parse(await AsyncStorage.getItem('Session'));

        const response = await api.get('pedidosGet/own', {
            params: {
                page: getPage,
                usuarioId: usuario.id,
                usuarioTipo: 'usuario'
            }
        });

        setPedidos([ ...getPedidos, ...response.data ]);
        setTotal(response.headers['x-total-count']);
        setPage(getPage + 1);
        setLoading(false);
    }
    
    function mostrarDetalhes(pedido){
        nav.navigate('DetalhesPedidoUsuario', {pedido})
    }

    useEffect(()=>{
        
        const loadPage = nav.addListener('focus', async ()=>{
            setLoading(true)
            await carregarUsuario();
            await loadPedidos();
        });

        return loadPage;
    },[nav])


    return(
        <SafeAreaView style={styles.container}>
            <Text>
                Seja bem vindo {getUsuario.nome}, Aqui estão os seus pedidos emitidos
            </Text>
            <FlatList 
                data={getPedidos}
                keyExtractor = {pedido => String(pedido.id_pedido) }
                onEndReached={loadPedidos}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={true}
                renderItem={({ item : pedido }) => {
                    return(
                        <View style={styles.pedidoCard}>
                            <Text style={styles.pedidoLocal}>
                                {pedido.localizacao}
                            </Text>
                            <Text>
                                {pedido.descricao}
                            </Text>
                            <TouchableOpacity onPress={() => mostrarDetalhes(pedido)}>
                                <Text>Ver Pedido</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
    },
    pedidoCard:{
        marginTop: 10,
        height: 100,
        alignItems: 'center',
        alignContent: 'center'
    }
});