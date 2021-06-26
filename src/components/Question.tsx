import { ReactNode } from 'react';

import '../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
}

export function Question({ //decompor a estrutura do objeto passado para pegar apenas os componentes desejados
    content,               //desestruturação do obj
    author,
    children,
}: QuestionProps) {        
    return(
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>

                <div>
                  {children} 
                </div>
            </footer>
        </div>
    );
}
