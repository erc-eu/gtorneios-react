import React, { useState } from "react";
import './styles/login.css'

import axios from "axios";
import { Redirect } from "react-router-dom";
import { Link } from 'react-router-dom';

import MenuNav from "../layout/MenuNav";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
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
                <div><MenuNav /></div>
                <div className="form-group">
                    <h2>LOG IN</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <label htmlFor="username"><AccountCircleIcon /> Username:</label>
                    <input type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Insira seu nome de usuário"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><LockOpenIcon /> Password:</label>
                    <input type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Insira sua senha"
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );

}

export default Login;
