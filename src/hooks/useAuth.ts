import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
//enviando duas importações como uma só

export function useAuth(){
    const value = useContext(AuthContext);

    return value;
}