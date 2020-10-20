import React, {useEffect} from 'react';
import Constants from 'expo-constants'
import { SafeAreaView, Text, AsyncStorage, StyleSheet} from 'react-native';

export default function TecnicoMain(){
    
    async function carregarTecnico(){
        const tecnico = JSON.parse(await AsyncStorage.getItem('Session'));
        
        console.log(tecnico.nome);
    }

    useEffect(()=>{carregarTecnico();}, []);

    return(
        <SafeAreaView style={styles.container}>
            <Text>
                oi
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight + 20,
    }
});