import { Link, useHistory } from 'react-router-dom';
import { FormEvent } from 'react';
import { useState } from 'react';
 
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom(){
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {     //essa função vai pegar o valor do input e coloca como valor atual
        event.preventDefault();

        if(newRoom.trim() === ''){      //verificar se está vazio e retirar espaços
            return;
        }

        const roomRef =  database.ref('rooms');       //criando uma referência/dados como um registro para um dado no banco de dados
    
        const firebaseRoom = await roomRef.push({     //enviando a informação para dentro de "rooms"
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`);
    }
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real.</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder="Nome da Sala" onChange={event => setNewRoom(event.target.value)} value={newRoom}/>
                        <Button type="submit">Criar Sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}