import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({ //decompor a estrutura do objeto passado para pegar apenas os componentes desejados
    content,               //desestruturação do obj
    author,
    isAnswered = false,
    isHighlighted = false,
    children
}: QuestionProps) {        
    return(
        <div className={cx(     //pacote cx ou classnames
            'question',         //permite pegar várias classes, essa é uma 
            { answered: isAnswered },       //aqui passa um objeto como classe, a classe answered só é aplicada caso a boolean isAnswered for verdadeira
            { highlighted: isHighlighted && !isAnswered},   //aqui só coloca a classe highlighted se isHighlighted for true E isAnswered for false, HOLLY MOLLY
        )}>
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
