import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';


export default function Index(){
    const Nav = useNavigation();

    const navigateToTecnico = () => {
        Nav.navigate('Técnico Login');
    }

    const navigateToUsuario = () => {
        Nav.navigate('Usuário Login');
    }

    return(
        <SafeAreaView style = {styles.container}>
            <Text style={styles.menutitle}>Você quer entrar como:</Text>

            <TouchableOpacity style={styles.btnTecnico} onPress={navigateToTecnico}>
                <Text style={styles.menuop}>Técnico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnUsuario} onPress={navigateToUsuario}>
                <Text style={styles.menuop}>Usuário</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}   

const styles = StyleSheet.create({
    
    container:{
        flex: 1 ,
        paddingHorizontal: 24,
        margin: "5%",
        justifyContent: 'center',
        
    },
    menutitle:{
        textAlign:"center",
        fontSize: 20,
        marginBottom:"10%",
        fontWeight: "bold",
        
        
    },
    btnTecnico:{
        //Borda e Cores
        backgroundColor: "#3d3d3d",
        borderStyle: "solid", 
        borderColor: "#3d3d3d",
        borderWidth: 5,
        borderRadius: 15,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        //Alinhamento e afins
        width:"80%",
        height: 50,
        paddingTop: 20,
        alignSelf: "center",
    
    },
    btnUsuario:{
            //Borda e Cores
            backgroundColor: "#490f87",
            borderStyle: "solid", 
            borderColor: "#490f87",
            borderWidth: 5,
            borderRadius: 15,
            shadowColor: "#2a094d",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            //Alinhamento e afins
            width:"80%",
            height: 50,
            paddingTop: 20,
            alignSelf: "center",
            marginTop: 10,
    },
    menuop:{
      textAlign:"center",
      marginTop: -10,
      color: "white",
      fontWeight: "bold",
      letterSpacing: 2,
    }
});