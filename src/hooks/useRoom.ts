import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type firebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {         //os likes possuem uma id string e um valor que é um objeto
        authorId: string;
    }>;
}>


type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string){
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);     //dizendo que o estado vai receber uma tipagem como a de question
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room =>{      //buscar uma única vez pelos valores contidos em room
            const databaseRoom = room.val();
            const firebaseQuestions: firebaseQuestions = databaseRoom.questions ?? {}; //o tipo vai dizer qual o tipo de informação vai ser recebido de databaseRoom.questions
            
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })     //aqui digo que o parsed questions vai receber as questões do firebase, se não houver nenhuma, fica nulo
            
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

        return () => {
            roomRef.off('value');   //removendo todos os event listeners
        }
    },[roomId, user?.id]);  // se o array, que são os arquivos que eu quero que ele monitore, for passado fazio ele vai executar apenas uma vez para os arquivos na tela

    return { questions, title};
}