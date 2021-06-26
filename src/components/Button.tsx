import {ButtonHTMLAttributes} from 'react'; //livraria react para colocar tags html no bot]ap
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;     //atribuindo os elementos html ao button props

export function Button(props: ButtonProps){
    return(
        <button className="button" {...props} /> //spread operator
        //com isso vou poder atribuir classes css quando for utilizar o botão
        //como <Button display:flex />
    )
}
