import React from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';


export default function Index(){
    const Nav = useNavigation();

    const navigateToTecnico = () => {
        Nav.navigate('TecnicoCard');
    }

    const navigateToUsuario = () => {
        Nav.navigate('UsuarioCard');
    }

    return(
        <SafeAreaView style = {styles.container}>
            <Text>Selecione seu tipo de usuário</Text>

            <TouchableOpacity onPress={navigateToTecnico}>
                <Text>Técnico</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToUsuario}>
                <Text>Usuário</Text>
            </TouchableOpacity>
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