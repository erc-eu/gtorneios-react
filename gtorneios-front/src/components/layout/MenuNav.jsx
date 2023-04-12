import './MenuNav.css'
import { Link } from 'react-router-dom';

export default function menuNav() {
    return (
        <div>
            <nav className="Menu">
                <ul className="Menu-list-right">
                    <li className='loginLink' ><Link to="/login">CONECTAR</Link></li>
                    <li className='registerLink'><Link to="/register" >REGISTRAR</Link></li>
                </ul>
            </nav>
        </div>
    )
}
