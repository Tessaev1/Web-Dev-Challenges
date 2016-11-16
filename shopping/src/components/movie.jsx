import React from "react";

const IMG_BASE_URL = "http://image.tmdb.org/t/p/w154"

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

    render() {
        var poster;
        if (this.props.movie.poster_path) {
            poster = IMG_BASE_URL + this.props.movie.poster_path;
        } else {
            poster = "img/image-not-available.jpg";
        }

        return (
            <div className="demo-card-wide mdl-card mdl-shadow--2dp">
                <div className="row">
                    <div className="col-img">
                        <img src={poster} alt="movie poster"/> 
                    </div>
                    <div className="col-content">
                        <h4 className="mdl-card__title-text">{this.props.movie.title}</h4>
                        <p className="mdl-card__supporting-text">{this.truncate(this.props.movie.overview)}</p>
                        <div className="mdl-card__actions mdl-card--border">
                            {this.props.children}
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}