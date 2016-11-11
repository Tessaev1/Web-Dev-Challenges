import React from "react";

import "whatwg-fetch";

import Movie from "./movie.jsx";
import Genre from "./genre.jsx";
import SearchForm from "./search-form.jsx";

// https://api.themoviedb.org/3/discover/movie?api_key=your-api-key
const APIKEY = "bc6e1e26758495c5b36c383a58eb8b73";
const BASE_URL = "https://api.themoviedb.org/3"
const DISCOVER_API = BASE_URL + "/discover/movie?api_key=" + APIKEY;
const GENRES_API = BASE_URL + "/genre/movie/list?api_key=" + APIKEY;
const SEARCH_API = BASE_URL + "/search/movie?api_key=" + APIKEY;

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
            .then(data => this.setState({movies: data}));
            // .catch(err => alert(err.message));
    }

    handleSearch(query, page=1) {
        fetch(SEARCH_API + "&query=" + query + "&page=" + page)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data,
                query: query,
                page: page
            }));
    }

    handleGenreClick(genre) {
        fetch(DISCOVER_API + "&with_genres=" + genre)
            .then(response => response.json())
            .then(data => this.setState({
                movies: data
            }));
    }

    render() {
        var genres, totalPages, movies;
        if (this.state.genres) {
            genres = this.state.genres.genres.map(genre => <Genre key={genre.id} genre={genre} handleClick={genre => this.handleGenreClick(genre)} />);
        }
        if (this.state.movies) {
            totalPages = (<p>{this.state.movies.total_pages} pages</p>)
            movies = this.state.movies.results.map(movie => <Movie key={movie.id} movie={movie} />);
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <SearchForm onSearch={query => this.handleSearch(query)} />
                        <div className="row-genres">
                            <a className="mdl-navigation__link" href="#">Popular</a>
                        </div>
                        {genres}
                    </div>
                    
                    <div className="col">
                        <h1>Products View</h1>
                        <p>some nifty products for sale</p>
                        {totalPages}
                        <div className="row-movies">
                            {movies}
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
}
