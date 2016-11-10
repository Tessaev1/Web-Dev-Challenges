import React from "react";

const IMG_BASE_URL = "http://image.tmdb.org/t/p/w154"

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <div className="container">
                <div className="col-movie-card">
                    <div className="row">
                        <div className="col-img">
                            <img src={IMG_BASE_URL + this.props.movie.poster_path} alt="movie poster"/> 
                        </div>
                        <div className="col-content">
                            <h4>{this.props.movie.title}</h4>
                            <p>{this.props.movie.release_date}</p>
                        </div> 
                    </div>
                </div>
            // </div>
        );
    }
}