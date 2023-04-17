import React, { useRef, useState } from "react";
import './styles/login.css'

import axios from "axios";
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';



import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const inputUsername = useRef(null);
    const inputPassword = useRef(null);
    const onClickIconUsername = () => {
        inputUsername.current.focus();
    };

    const onClickIconPassword = () =>{
        inputPassword.current.focus();
    }



    
    const handleSubmit = (event) => {
        event.preventDefault();

        const config = {
            headers: {
                Authorization: 'Basic ' + btoa(`${username}:${password}`)
            }
        };
        axios.get('http://localhost:8080/api/user/me', config)
            .then(response => {
                localStorage.setItem('usuario', btoa(username + ':' + password));
                Location.reload();
            })
            .catch(error => {
                setErrorMessage('Usuário ou senha inválidos');
            });
    }



    if (localStorage.getItem('usuario')) {
        return <Redirect to="/" />
    }

    return (
        <div>

            <div className='voltarHome'><Link to={'/'}>Gtorneios</Link></div>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <h2>Log In</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="input-icons">
                        <i className="icon" onClick={onClickIconUsername}><AccountCircleIcon /></i>
                        <input type="text"
                            ref={inputUsername}
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Insira seu nome de usuário"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-icons">
                        <i className="icon" onClick={onClickIconPassword}><LockOpenIcon /></i>
                        <input type="password"
                            id="password"
                            ref={inputPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insira sua senha"
                            required
                        />
                    </div>
                </div>
                <button type="submit">Login</button>
                <h4>não possui conta? <Link to={'/register'}>registre-se aqui</Link></h4>
            </form>
        </div>
    );

}

export default Login;
