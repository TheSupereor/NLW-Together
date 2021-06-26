import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type firebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}

type RoomParams = {
    id: string;
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<RoomParams>();         //generic, pra que a const params saiba quais parâmetros vai receber
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);     //dizendo que o estado vai receber uma tipagem como a de question
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room =>{      //buscar uma única vez pelos valores contidos em room
            const databaseRoom = room.val();
            const firebaseQuestions: firebaseQuestions = databaseRoom.questions ?? {}; //o tipo vai dizer qual o tipo de informação vai ser recebido de databaseRoom.questions
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                }
            })     //aqui digo que o parsed questions vai receber as questões do firebase, se não houver nenhuma, fica nulo
            
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    },[roomId]);  // se o array, que são os arquivos que eu quero que ele monitore, for passado fazio ele vai executar apenas uma vez para os arquivos na tela



    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        if(newQuestion.trim() === ''){
            return
        }
        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name:user?.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);     //aqui a database é acessada, no endereço ID da sala, numa nova informação de "questões" onde o dado da questão enviada é postado
    
        setNewQuestion('');     //zera o valor do estado, ou seja o campo da pergunta, quando é enviado
    }

    return(
        <div id="page-room">
            <header>
                <div>
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code={roomId}></RoomCode>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você quer perguntar?" onChange={event => setNewQuestion(event.target.value)} value={newQuestion}/>
                    <div className="form-footer">
                        {  user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button> faça seu login</button></span>
                        )  }
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}