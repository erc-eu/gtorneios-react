import React, { useState } from 'react';
import './styles/register.css';
import axios from 'axios';
import MenuNav from '../layout/MenuNav';
import {Link} from 'react-router-dom';
const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const user = {
        username,
        password,
        email
    }
    const handleSubmit = (event) => {
        axios.post("http://localhost:8080/api/user", user).then(result => {
            console.log(result)
        }).catch(err => console(err));
        console.log({ user });
        event.preventDefault();

    };

    return (
        <div>
            <div className='voltarHomeRegister'><Link to={'/'}>Gtorneios</Link></div>
            <form className="register-form" onSubmit={handleSubmit}>
                <div><MenuNav /></div>

                <h2>SING UP</h2>
                <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Insira seu e-mail"
                        name='email'
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Nome de usuário:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Insira seu nome de usuário"
                        name='username'
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Insira sua senha"
                        name='password'
                        required
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default Register; 