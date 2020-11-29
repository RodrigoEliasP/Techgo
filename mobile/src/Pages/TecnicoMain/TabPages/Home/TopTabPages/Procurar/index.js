import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Text, TouchableOpacity, View, AsyncStorage, StyleSheet} from 'react-native';
import api from '../../../../../../Services/api';
import Card from '../../../../../../Components/Card';

export default function Pendente(){
    const nav = useNavigation();

    const [getTecnico, setTecnico] = useState({});
    const [getPedidos, setPedidos] = useState([]);
    const [total, setTotal] =  useState(0);
    const [getPage, setPage] =  useState(1);
    const [loading, setLoading] =  useState(false);

    async function carregarTecnico(){
        const tecnico = JSON.parse(await AsyncStorage.getItem('Session'));
        if(tecnico){
            setTecnico(tecnico);
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

        const response = await api.get('pedidosGet', {
            params: {
                page:  getPage
            }
        });
        

        setPage(getPage + 1);
        setPedidos([ ...getPedidos, ...response.data ]);
        setTotal(response.headers['x-total-count']);
        setLoading(false);
    }

    function mostrarDetalhes(pedido){
        nav.navigate('DetalhesPedidoTecnico', {pedido})
    }

    useEffect(()=>{
        carregarTecnico();
        const loadPage = nav.addListener('focus', async ()=>{
            setLoading(true);
            await loadPedidos();
        });
        console.log('a')
        return loadPage;
    },[nav]);
    if(getTecnico.status === 'premium'){
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
    }else{
        return(
            <Text style={styles.text}>Ooops! você precisa de ser premium para achar pedidos</Text>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        alignContent: 'center'
    },
    text:{
        alignSelf: 'center',
        width: '80%',
        fontWeight: 'bold',
        fontSize: 16
    }
    
})