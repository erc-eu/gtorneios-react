import './MenuLogado.css'
import Dropdown from './Dropdown';
const MenuLogado = () => {

    return (
        <div className="menu">
            <div className="menu-left">
                <Dropdown />
            </div>
            <div className="menu-right">
                <button className="menu-button">Botão 1</button>
                <button className="menu-button">Botão 2</button>
                <button className="menu-button">Botão 3</button>
            </div>
        </div>

    )
}


export default MenuLogado;