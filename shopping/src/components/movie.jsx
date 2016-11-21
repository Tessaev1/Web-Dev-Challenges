import React from "react";
import MediaQuery from "react-responsive";

const IMG_BASE_URL_NARROW = "http://image.tmdb.org/t/p/w154"
const IMG_BASE_URL_WIDE = "http://image.tmdb.org/t/p/w780"

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    truncate(p) {
        if (p.length > 200) {
            return p.substring(0,200) + "...";
        } else {
            return p;
        }
    }

    getNarrowMoviePoster() {
        var poster = "img/image-not-available.jpg";
        if (this.props.movie.poster_path) {
            poster = IMG_BASE_URL_NARROW + this.props.movie.poster_path;
        }        
        return poster;
    }

    getWideMoviePoster() {
        var poster;
        if (this.props.movie.backdrop_path) {
            poster = IMG_BASE_URL_WIDE + this.props.movie.backdrop_path;
        }
        var imgStyle = {
            backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.4)), url(" + poster + ")"
        }   
        return imgStyle;
    }

    render() {
        return (
            <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                <MediaQuery query='(max-width: 1269px)'>
                    <div className="row small-screen">
                        <div className="col-img img-wide" style={this.getWideMoviePoster()}></div>
                        <div className="col-content">
                            <h4 className="mdl-card__title-text">{this.props.movie.title}
                                <div className="movie-rating">
                                    {this.props.movie.vote_average}
                                    <i className="material-icons">grade</i>
                                </div>
                            </h4>
                            <p className="mdl-card__supporting-text">{this.truncate(this.props.movie.overview)}</p>
                            <div className="mdl-card__actions mdl-card--border">
                                {this.props.children}
                            </div>
                        </div> 
                    </div>
                </MediaQuery>
                <MediaQuery query='(min-width: 1270px)'>
                    <div className="row large-screen">
                        <div className="col-img">
                            <img src={this.getNarrowMoviePoster()} alt="movie poster"/> 
                        </div>
                        <div className="col-content">
                            <h4 className="mdl-card__title-text">{this.props.movie.title}
                                <div className="movie-rating">
                                    {this.props.movie.vote_average}
                                    <i className="material-icons movie-rating-icon">grade</i>
                                </div>
                            </h4>
                            <p className="mdl-card__supporting-text">{this.truncate(this.props.movie.overview)}</p>
                            <div className="mdl-card__actions mdl-card--border">
                                {this.props.children}
                            </div>
                        </div> 
                    </div>
                </MediaQuery>

            </div>
        );
    }
}