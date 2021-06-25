import {ButtonHTMLAttributes} from 'react'; //livraria react para colocar tags html no bot]ap
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps){
    return(
        <button className="button" {...props} /> //spread operator
    )
}
