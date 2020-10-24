import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../../Services/api'

export default function Home(){

    const nav = useNavigation();

    const [getTecnico, setTecnico] =  useState({});
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
            params: {page: getPage},
        });

        setPedidos([ ...getPedidos, ...response.data ]);
        setTotal(response.headers['x-total-count']);
        setPage(getPage + 1);
        setLoading(false);
    }

    function mostrarDetalhes(pedido){
        nav.navigate('DetalhesPedidoTecnico', {pedido})
    }

    useEffect(()=>{
        
        const loadPage = nav.addListener('focus', async ()=>{
            setLoading(true)
            await carregarTecnico();
            await loadPedidos();
        });

        return loadPage;
    },[nav])

    return(
        <SafeAreaView style={styles.container}>
            <Text>
                Seja bem vindo {getTecnico.nome}, sinta se a vontade para aceitar um pedido
            </Text>
            <FlatList 
                data={getPedidos}
                keyExtractor = {pedido => String(pedido.id_pedido) }
                onEndReached={loadPedidos}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={true}
                renderItem={({ item : pedido }) => {
                    if(!pedido.trabalhadore){
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
                    }
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