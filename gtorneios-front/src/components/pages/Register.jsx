import React, { useState } from 'react';
import './styles/register.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Avartar from './user/AvatarAlterar';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null)
    const user = {
        username,
        password,
        email,
        avatar
    }
    const handleSubmit = (event) => {
        console.log(user);
        axios.post("http://localhost:8080/api/user", user).then(result => {
            console.log(result)

        }).catch(err => {console(err)});
        console.log({ user });
        console.log(event.target.avatar.value);
        event.preventDefault();

    };



    return (
        <div>
            <div className='voltarHomeRegister'><Link to={'/'}>Gtorneios</Link></div>
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Sing Up</h2>
                <Avartar imagem={avatar}/>
                <div className="form-group">
                    <label htmlFor="avatar">Avatar:</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={e => setAvatar(e.target.value)}
                        placeholder='Cole uma URL de uma imagem'
                        id="avatar"
                        name='avatar'
                        required
                    />
                </div>
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
                <h4>já possui conta? <Link to={'/login'}>Conecte-se</Link></h4>
            </form>
        </div>
    );
}

export default Register; 