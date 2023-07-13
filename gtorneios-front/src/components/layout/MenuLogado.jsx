import './MenuLogado.css';
import Dropdown from './Dropdown';
import { Link } from 'react-router-dom';

const MenuLogado = () => {
    return (
        <div className="menu">
            <div className="menu-left">
                <Dropdown />
            </div>
            
            <div className="menu-right">
                <Link to={'/'}><button className="menu-button">Home</button></Link>
            </div>
        </div>
    );
};

export default MenuLogado;
