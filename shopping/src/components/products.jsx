import React from "react";

import "whatwg-fetch";

import {Link, IndexLink} from "react-router";
import Movie from "./movie.jsx";
import Genre from "./genre.jsx";
import SearchForm from "./search-form.jsx";

// https://api.themoviedb.org/3/discover/movie?api_key=your-api-key
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
            .then(data => this.setState({genres: data}));
            // .catch

        fetch(DISCOVER_API)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data
            }));
            // .catch(err => alert(err.message));
    }

    handleSearch(query, page=1) {
        currentAPI = SEARCH_API + "&query=" + query + "&page=" + page;
        fetch(currentAPI)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                query: query,
                page: page
            }));
    }

    handleGenreClick(genreID, page=1) {
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
            }));
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
            genres = this.state.genres.genres.map(genre => <Genre key={genre.id} genre={genre} handleClick={genre => this.handleGenreClick(genre)} />);
        }
        if (this.state.movies) {
            totalPages = (<span>{this.state.movies.total_pages}</span>)
            movies = this.state.movies.results.map(movie => <Movie key={movie.id} movie={movie} />);
        }
        // links not active?
        // default pictures not rendering
        // pull buttons into function
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <SearchForm onSearch={query => this.handleSearch(query)} />
                        <div className="row-genres">
                            <Link className="mdl-navigation__link" href="#" activeClassName="active" onClick={() => this.handleGenreClick(-1)}>Popular</Link>
                        </div>
                        {genres}
                    </div>
                    
                    <div className="col">
                        <button className="btn btn-default"
                            onClick={() => this.handlePageChange(this.state.page-1)}
                            disabled={!this.state.page || this.state.page * 30 > this.state.movies.total_pages}>
                            Previous Page
                        </button>
                        <h4>{this.state.page} of {totalPages}</h4>
                        <button className="btn btn-default"
                            onClick={() => this.handlePageChange(this.state.page+1)}
                            disabled={!this.state.page || this.state.page * 30 > this.state.movies.total_pages}>
                            Next Page
                        </button>
                        <div className="row-movies">
                            {movies}
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
}
