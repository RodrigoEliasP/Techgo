import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from './TabPages/Home';
import Perfil from './TabPages/Perfil';
import Premium from './TabPages/Premium';
  
  const Tab = createMaterialBottomTabNavigator();
  
  export default function App() {
    return (
        <Tab.Navigator 
            initialRouteName="Home"
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            barStyle={{ backgroundColor: '#694fad' }}
        >
          <Tab.Screen  
            name="Premium" 
            component={Premium}
            options={{
                tabBarLabel: 'Premium',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="diamond" color={color} size={26} />
                ),
              }}
            />
          <Tab.Screen  
            name="Home" 
            component={Home}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
          <Tab.Screen
           name="Perfil" 
           component={Perfil}
           options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="face-profile" color={color} size={26} />
            ),
          }}
           />
        </Tab.Navigator>
    );
  }
  