import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Text, StyleSheet} from 'react-native';

import api from '../../../../../../Services/api';
import Card from '../../../../../../Components/Card';
import { useAuth } from '../../../../../../Contexts/AuthContext';

export default function Procurar(){
    const nav = useNavigation();

    const {getUserInfos} = useAuth();

    const [getTecnico, setTecnico] = useState({});
    const [getPedidos, setPedidos] = useState([]);
    const [total, setTotal] =  useState(0);
    const [getPage, setPage] =  useState(1);
    const [loading, setLoading] =  useState(false);

    useEffect(()=>{
        getUserInfos().then(e=>setTecnico(e)).catch(e=>{})
    },[])

    useEffect(()=>{
        
        const loadPage = nav.addListener('focus', async ()=>{
            setLoading(true);
            await loadPedidos();
        });
        return loadPage;
    },[nav]);

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
        nav.navigate('Detalhes Pedido Técnico', {pedido})
    }

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
            <Text style={styles.text}>Ooops! você precisa ser premium para achar pedidos</Text>
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