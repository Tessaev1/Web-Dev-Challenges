import React from "react";

import "whatwg-fetch";

import {Link, IndexLink} from "react-router";
import Movie from "./movie.jsx";
import Genre from "./genre.jsx";
import SearchForm from "./search-form.jsx";
import {store, addToCart} from "./shared-state.js";

const APIKEY = "bc6e1e26758495c5b36c383a58eb8b73";
const BASE_URL = "https://api.themoviedb.org/3"
const DISCOVER_API = BASE_URL + "/discover/movie?api_key=" + APIKEY;
const GENRES_API = BASE_URL + "/genre/movie/list?api_key=" + APIKEY;
const SEARCH_API = BASE_URL + "/search/movie?api_key=" + APIKEY;

var currentAPI;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch(GENRES_API)
            .then(response => response.json())
            .then(data => this.setState({genres: data}))
            .catch(err => alert(err.message));

        this.handleGenreClick(-1, 1);
    }

    handleSearch(query, page=1) {
        currentAPI = SEARCH_API + "&query=" + query + "&page=" + page;
        fetch(currentAPI)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                query: query,
                page: page
            }))
            .catch(err => alert(err.message));
    }

    handleGenreClick(genreID, page=1) {
        this.setState({
            activeGenre: genreID
        });
        if (genreID === -1) {
            currentAPI = DISCOVER_API + "&page=" + page;
        } else {
            currentAPI = DISCOVER_API + "&with_genres=" + genreID + "&page=" + page;
        }
        fetch(currentAPI)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                currentGenre: genreID,
                page: page
            }))
            .catch(err => alert(err.message));
    }

    handlePageChange(page) {
        if (currentAPI.includes(SEARCH_API)) {
            this.handleSearch(this.state.query, page)
        } else {
            this.handleGenreClick(this.state.currentGenre, page)
        }
    }

    render() {
        var genres, totalPages, movies;
        if (this.state.genres) {
            genres = this.state.genres.genres.map(genre => <Genre key={genre.id} active={this.state.activeGenre === genre.id} genre={genre} handleClick={genre => this.handleGenreClick(genre)} />);
        }
        if (this.state.movies) {
            totalPages = (<span>{this.state.movies.total_pages}</span>)
            movies = this.state.movies.results.map(movie => 
                <Movie key={movie.id} movie={movie}>
                    <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                        onClick={() => store.dispatch(addToCart(movie, "DVD", 1, 14.95))}>BUY ON DVD
                    </button>
                    <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                        onClick={() => store.dispatch(addToCart(movie, "Blu-ray", 1, 19.95))}>BUY ON BLU-RAY
                    </button>
                </Movie>);
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <SearchForm onSearch={query => this.handleSearch(query)} />
                        <div className={"row-genres " + ((this.state.activeGenre === -1) ? "active" : "")}>
                            <a className="mdl-navigation__link" href="#" onClick={() => this.handleGenreClick(-1)}>Popular</a>
                        </div>
                        {genres}
                    </div>
                    
                    <div className="col">
                        <div className="page-nav">
                            <button className="mdl-button mdl-js-button"
                                onClick={() => this.handlePageChange(this.state.page-1)}
                                disabled={!this.state.page || this.state.page === 1}>
                                <i className="material-icons nav-arrows">keyboard_arrow_left</i>
                            </button>
                            <span>{this.state.page} of {totalPages}</span>
                            <button className="mdl-button mdl-js-button"
                                onClick={() => this.handlePageChange(this.state.page+1)}
                                disabled={!this.state.page || this.state.page === this.state.movies.total_pages}>
                                <i className="material-icons nav-arrows">keyboard_arrow_right</i>
                            </button>
                        </div>
                        <div className="row-movies">
                            {movies}
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
}
