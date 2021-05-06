import React, {useContext, createContext} from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {

    const [isLogged, setIsLogged] = useState(false);
    const [userType, setUserType] = useState('');

    useEffect(()=>{
        setUserType('ami')
        getUserToken().then(e=>setIsLogged(true)).catch(e=>{})
        setUserType('amb')
        getUserToken().then(e=>setIsLogged(true)).catch(e=>{})
    }, [])

    async function startSession(user, type){
        setUserType(type);
        setIsLogged(true);
        await SecureStore.setItemAsync(type, JSON.stringify(user));
    }

    async function getUserToken(){
        const result = await SecureStore.getItemAsync(userType);
        if(result){
            return JSON.parse(result).token;
        }else{
            throw new Error('Sem usuário Logado');
        }
    }

    async function getUserInfos(){
        const result = await SecureStore.getItemAsync(userType);
        if(result){
            return JSON.parse(result).usuario;
        }else{
            throw new Error(`Sem ${userType === 'ami'? 'trabalhador': 'usuario'} Logado`);
        }
    }

    async function killSession(){
        setIsLogged(false);
        await SecureStore.deleteItemAsync(userType);
    }

    return(
        <AuthContext.Provider value={{
            isLogged, 
            userType,
            startSession,
            getUserToken,
            getUserInfos,
            killSession
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);