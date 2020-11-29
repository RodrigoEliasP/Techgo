import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Index from './Pages/Index';
import UsuarioCard from './Pages/UsuarioCard';
import TecnicoCard from './Pages/TecnicoCard';
import TecnicoMain from './Pages/TecnicoMain';
import UsuarioMain from './Pages/UsuarioMain';
import RegistroTecnico from './Pages/RegistroTecnico';
import RegistroUsuario from './Pages/RegistroUsuario';
import DetalhesPedidoTecnico from './Pages/DetalhesPedidoTecnico';
import DetalhesPedidoUsuario from './Pages/DetalhesPedidoUsuario';
import EditarPedido from './Pages/EditarPedido';

const AppStack = createStackNavigator();

export default function Routes(){
 return(
     <NavigationContainer>
         <AppStack.Navigator screenOptions = {{ headerShown: false }}>
             <AppStack.Screen name="Index" component={ Index }/>
             <AppStack.Screen name="UsuarioCard" component={ UsuarioCard }/>
             <AppStack.Screen name="TecnicoCard" component={ TecnicoCard }/>
             <AppStack.Screen name="TecnicoMain" component={ TecnicoMain }/>
             <AppStack.Screen name="UsuarioMain" component={ UsuarioMain }/>
             <AppStack.Screen name="RegistroTecnico" component={ RegistroTecnico }/>
             <AppStack.Screen name="RegistroUsuario" component={ RegistroUsuario }/>
             <AppStack.Screen name="DetalhesPedidoTecnico" component={ DetalhesPedidoTecnico }/>
             <AppStack.Screen name="DetalhesPedidoUsuario" component={ DetalhesPedidoUsuario }/>
             <AppStack.Screen name="EditarPedido" component={ EditarPedido }/>
         </AppStack.Navigator>
     </NavigationContainer>
 );
}