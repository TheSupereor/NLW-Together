import {ButtonHTMLAttributes} from 'react'; //livraria react para colocar tags html no bot]ap
import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};     //atribuindo os elementos html ao button props

export function Button({ isOutlined = false, ...props }: ButtonProps){
    return(
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} /> //spread operator
        //com isso vou poder atribuir classes css quando for utilizar o botão
        //como <Button display:flex />
    )
}
