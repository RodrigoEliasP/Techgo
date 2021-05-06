import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Card({pedido, mostrar}){

    const agora = new Date();
    const dataDoPedido = new Date(pedido.data_criacao);
    const diferenca = Math.abs(agora.getTime() - dataDoPedido.getTime());
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const minutos = Math.floor(diferenca / (1000 * 60));
    let mensagem = '';

    if(dias != 0){
        mensagem = "há: \n" + dias + " Dias";
    }else if(horas != 0){
        mensagem = "há: \n" + horas + " Horas";
    }else if(minutos != 0){
        mensagem = "há: \n" + minutos + " Minutos";
    }else{
        mensagem = "agora mesmo"
    }

    return(
        <View style={styles.pedidoCard}>
            <Text style={styles.text}>
                Endereço:{"\n" + pedido.localizacao}
            </Text>
            <Text style={styles.text}>
                Descrição:{"\n" + pedido.descricao}
            </Text>
            <Text style={styles.text}>
                Criado {mensagem}
            </Text>
            <TouchableOpacity style={styles.cardButton} onPress={() => mostrar(pedido)}>
                <Text style={styles.buttonText}>Ver Pedido</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    pedidoCard:{
        padding: 10,
        marginTop: 10,
        height: "auto",
        minHeight: 100,
        maxHeight: 500,
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        borderBottomWidth: 1,
        borderTopWidth:1,
        borderLeftWidth:1,
        borderRightWidth: 1,
        borderRadius: 10,
        width: 350,
    }, 
    text:{
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5
    },
    buttonText:{
        fontSize: 16,
        color: '#FFFFFF'
    },
    cardButton:{
        width: '100%',
        backgroundColor:'#e60014',
        marginTop: 10,
        borderRadius: 5,
        height: 30,
        alignItems: 'center',
        alignContent: 'center'
    }
});