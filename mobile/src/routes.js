import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Index from './Pages/Index';
import UsuarioLog from './Pages/UsuarioLog';
import TecnicoLog from './Pages/TecnicoLog';
import TecnicoMain from './Pages/TecnicoMain';
import UsuarioMain from './Pages/UsuarioMain';
import RegistroTecnico from './Pages/RegistroTecnico';
import RegistroUsuario from './Pages/RegistroUsuario';
import DetalhesPedidoTecnico from './Pages/DetalhesPedidoTecnico';
import DetalhesPedidoUsuario from './Pages/DetalhesPedidoUsuario';
import EditarPedido from './Pages/EditarPedido';
import { useAuth } from './Contexts/AuthContext';

const AppStack = createStackNavigator();

const privateRoutes = {
    ami: (
        <>
            <AppStack.Screen name="Técnico Home" component={ TecnicoMain }/>
            <AppStack.Screen name="Detalhes Pedido Técnico" component={ DetalhesPedidoTecnico }/>
        </>
    ),
    amb: (
        <>
            <AppStack.Screen name="Usuário Home" component={ UsuarioMain }/>
            <AppStack.Screen name="Detalhes Pedido Usuário" component={ DetalhesPedidoUsuario }/>
            <AppStack.Screen name="Editar Pedido" component={ EditarPedido }/>
        </>
    )
}

export default function Routes(){
    const { isLogged, userType} = useAuth();
    
    return(
        <NavigationContainer>
            <AppStack.Navigator screenOptions = {{ headerShown: true }}>
             {(!isLogged)?
                (<>
                    <AppStack.Screen screenOptions={{headerShown: false}} name="Bem Vindo" component={ Index }/>
                    <AppStack.Screen name="Usuário Login" component={ UsuarioLog }/>
                    <AppStack.Screen name="Técnico Login" component={ TecnicoLog }/>
                    <AppStack.Screen name="Registro Técnico" component={ RegistroTecnico }/>
                    <AppStack.Screen name="Registro Usuário" component={ RegistroUsuario }/>
                </>):(<>
                    {privateRoutes[userType]}
                </>)}
         </AppStack.Navigator>
     </NavigationContainer>
 );
}