import './MenuLogado.css'
import Dropdown from './Dropdown';
import { Link } from 'react-router-dom';
const MenuLogado = () => {

    return (
        <div className="menu">
            <div className="menu-left">
                <Dropdown />
            </div>
            <div className="menu-right">
                <Link to={'/NovoTorneio'}><button className="menu-button">Novo Torneio</button></Link>
            </div>
        </div>

    )
}


export default MenuLogado;