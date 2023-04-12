import './MenuHome.css';
import { Link } from 'react-router-dom';

const MenuHome = () => {
    return (
        <header className="HeaderHomeMenu">
            <nav>
                <ul><li><Link to={"/"}>GtorneioS</Link></li></ul>
                <ul>
                    <li class="right"><Link to={"/login"}>LOG IN</Link></li>
                    <li class="right"><Link to={"/register"}>SING UP</Link></li>
                </ul>
            </nav>
        </header>
    )
}


export default MenuHome;