import MenuHome from "../layout/MenuHome";
import MenuLogado from "../layout/MenuLogado";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    if (!localStorage.getItem('usuario')) {
        return (
            <div>
                <MenuHome />

                <section class="description">
                    <h2>Sobre Nós</h2>
                    <p className="desc">
                        Se você é um entusiasta de esportes e está procurando uma maneira eficiente de organizar e acompanhar competições, você veio ao lugar certo.
                        Nosso site oferece uma plataforma completa para gerenciar torneios de forma fácil e intuitiva.
                    </p>
                    <br></br>
                    <p className="desc">
                        Com nosso gerenciador de campeonato, você pode criar e configurar competições personalizadas em diferentes modalidades esportivas.
                        Defina o formato do torneio, as regras específicas, os critérios de pontuação e muito mais.
                        Nosso sistema automatizado cuidará de todos os cálculos e atualizações, permitindo que você se concentre no que realmente importa: o jogo!
                    </p>
<br></br>
                    <p className="desc">Experimente agora mesmo e leve sua paixão pelos esportes a um novo nível com nosso gerenciador de campeonato!</p>
                </section>
            </div>
        );
    } else {
        return (
            <div>
                <MenuLogado />
                <div className="containerDiv">
                    <div className="divLeft">
                        <img src="backgroundTorneio.png" alt="Imagem" />
                        <Link to={'/NovoTorneio'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <button className="button2">
                                <EmojiEventsIcon className="icone" />
                                CRIE SEU CAMPEONATO
                            </button>
                        </Link>
                    </div>
                    <div className="divRight">
                        <h1>GERENCIADOR DE <h3 style={{ margin: '0', color: '#f40021', }}>TORNEIO </h3></h1>
                    </div>
                </div>
            </div>
        );
    }
};

export default Home;
