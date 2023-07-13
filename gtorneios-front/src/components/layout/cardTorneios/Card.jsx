import "./Card.css"
import { Link } from "react-router-dom";

const Card = (props) => {

    return (
        <div className="slide-container swiper">
            <div className="slide-content">
                <div className="card-wrapper swiper-wrapper">
                    <div className="card swiper-slide">
                        <div className="image-content" >
                            <span className="overlay"></span>

                            <div className="card-image" >
                                <h2 className="name">{props.nome}</h2>
                            </div>

                        </div>

                        <div className="bod">
                            <div className="card-content">
                                <p className="description">{props.descricao}</p>
                                <Link to={'/AddTimes/' + props.id + ''}><button className="button">Inserir Times</button></Link>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3 className="name-bottom">R$ {props.premio} | {props.esporte}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Card;