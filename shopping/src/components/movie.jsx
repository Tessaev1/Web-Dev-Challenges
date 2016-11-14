import React from "react";

const IMG_BASE_URL = "http://image.tmdb.org/t/p/w154"

export default class extends React.Component {
    constructor(props) {
        super(props);
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
                        <p className="mdl-card__supporting-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad asperiores Soluta perspiciatis quisquam iusto tenetur beatae ad consectetur ratione eveniet quasi!
                        </p>
                        <div className="mdl-card__actions mdl-card--border">
                            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                                BUY ON DVD 
                            </a>
                            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                                BUY ON BLU-RAY 
                            </a>
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}

// <p>{this.props.movie.overview}</p>