import React from "react";

// polyfill for Safari and older browser
import "whatwg-fetch";

// https://api.themoviedb.org/3/discover/movie?api_key=your-api-key
const API_KEY = "bc6e1e26758495c5b36c383a58eb8b73";
const BASE_URL = "https://api.themoviedb.org/3/";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                genres: []
            },
        };
    }

    componentDidMount() {
        this.handleGenres();
    }

    handleGenres() {
        fetch(BASE_URL + "genre/movie/list?api_key=" + API_KEY)
            .then(response => response.json())
            .then(genres => this.setState({
                data: genres
            }));
    }

    // https://webdesign.tutsplus.com/tutorials/learning-material-design-lite-navigation--cms-24565
    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">Movie Shopper</span>
                        <div className="mdl-layout-spacer"></div>
                        <nav className="mdl-navigation">
                            <a className="mdl-navigation__link" href="#">
                                <i className="material-icons">search</i>
                            </a>
                            <a className="mdl-navigation__link" href="#">
                                <i className="material-icons">add_shopping_cart</i>
                            </a>
                        </nav>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">Movie Shopper</span>
                    <nav className="mdl-navigation">
                        <form action="#">
                            <div className="mdl-textfield mdl-js-textfield">
                                <input className="mdl-textfield__input" type="text" placeholder="Search"></input>
                            </div>
                        </form>
                        {
                            this.state.data.genres.map(data => (
                                <li className="mdl-list__item" key={data.id}>{data.name}</li>))
                        }
                    </nav>
                </div>
            </div>
        );
    }
}


        // <a className="mdl-navigation__link" href="#">Products</a>
        // <a className="mdl-navigation__link" href="#">Services</a>
        // <a className="mdl-navigation__link" href="#">Portfolios</a>
