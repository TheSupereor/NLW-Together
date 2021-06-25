import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;             //há apenas 2 estados para o usuário, logado ou indefinido
    signInWithGoogle: () => Promise<void>;       //passando a função que não recebe parâmetros nem dá retorno e, por usar async await, é uma promessa
}
  
type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);    //atribuo o contexto, a informação que quero passar para frente, a uma const e digo que tipo de valor esperar

export function AuthContextProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>();       //mostrando que o usuário do state é no formato do user criado acima

  //use effect monitora a mudança da info, recebe uma função pra executar quando a info altera e qual info deve monitorar, sendo sempre um vetor
  useEffect(() => {
    //ao colocar um eventListener dentro de um useEffect é bom atribuir uma forma de tirar esse eventlistener
    //para que assim ele não fique "ouvindo" mesmo após realizar o que devia, para isso retornamos um unsubscribe
    //ou uma função que te "retira" do event listener

    const unsubscribe = auth.onAuthStateChanged( user => {    //monitora a mudança de estado do usuário
      if (user){      //se houver um usuário já logado ele pega as informações e as atribui
        const { displayName, photoURL, uid} = user;

        if (!displayName || !photoURL){       //caso não tenha nome ou foto
          throw new Error('Missing information from google account!')
        }

        setUser({               //caso tenha
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }

  }, []);

  async function signInWithGoogle(){            // a função é enviada pelo contexto para que o usuário possa logar em várias partes da aplicação
    const provider = new firebase.auth.GoogleAuthProvider();       //código do firebase para realizar login com o google

    const result = await auth.signInWithPopup(provider);  //realiza o login com um poppup e, com os resultados, faz o que está dentro das chaves
    //o result vai esperar o valor retornar com o login do poppup para então prosseguir

    if (result.user)  {               //se a autenticação deu certo
      const { displayName, photoURL, uid} = result.user;

      if (!displayName || !photoURL){       //caso não tenha nome ou foto
        throw new Error('Missing information from google account!')
      }

      setUser({               //caso tenha
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }  
  }

    return(
        <AuthContext.Provider value={{ user, signInWithGoogle }}>    /* o contexto, no caso o usuário, vai ficar disponível para todos dentro da tag */
            {props.children} 
        </AuthContext.Provider>
    )
}