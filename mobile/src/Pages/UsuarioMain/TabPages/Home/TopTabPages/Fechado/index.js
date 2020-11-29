import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Text, TouchableOpacity, View, AsyncStorage, StyleSheet} from 'react-native';
import api from '../../../../../../Services/api';
import Card from '../../../../../../Components/Card/index';


export default function Pendente(){
    const nav = useNavigation();

    const [getPedidos, setPedidos] = useState([]);
    const [total, setTotal] =  useState(0);
    const [getPage, setPage] =  useState(1);
    const [loading, setLoading] =  useState(false);

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
                page:  getPage,
                usuarioId: usuario.id,
                usuarioTipo: 'usuario',
                status: 'fechado'
            }
        });
        

        setPage(getPage + 1);
        setPedidos([ ...getPedidos, ...response.data ]);
        setTotal(response.headers['x-total-count']);
        setLoading(false);
    }

    function mostrarDetalhes(pedido){
        nav.navigate('DetalhesPedidoUsuario', {pedido})
    }

    useEffect(()=>{
        
        const loadPage = nav.addListener('focus', async ()=>{
            setLoading(true);
            await loadPedidos();
        });
        return loadPage;
    },[nav]);

    return(
        <FlatList 
            contentContainerStyle={styles.container}
            data={getPedidos}
            keyExtractor = {pedido => String(pedido.id_pedido) }
            onEndReached={()=>{
                loadPedidos()
            }}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={true}
            renderItem={({ item : pedido }) => {
                return(
                    <Card pedido ={pedido} mostrar={mostrarDetalhes}/>
                )
            }}
        />
    );
}
const styles = StyleSheet.create({
    
    container:{
        alignItems: 'center',
        alignContent: 'center'
    }
})