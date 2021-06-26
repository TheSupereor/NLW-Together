import { useParams } from 'react-router-dom'

import deleteImg from '../assets/images/delete.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
    id: string;
}

//sempre que uma lógica/funcionalidade é usada por vários componentes é bom fazer um hook

export function AdminRoom(){
    //const { user } = useAuth();
    const params = useParams<RoomParams>();         //generic, pra que a const params saiba quais parâmetros vai receber
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
    }
    
    async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Are you sure?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return(
        <div id="page-room">
            <header>
                <div>
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId}></RoomCode>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question
                                key={question.id}       //ao percorrer um array e voltar uma listagem o react pede uma chave única para diferenciar cada componente
                                content={question.content}
                                author={question.author}
                            >
                                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="deletar" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}