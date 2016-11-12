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
            poster = "../img/img_not_available.jpg";
        }
        return (
            <div className="col-movie-card">
                <div className="row">
                    <div className="col-img">
                        <img src={poster} alt="movie poster"/> 
                    </div>
                    <div className="col-content">
                        <h4>{this.props.movie.title}</h4>
                        <p className="release-date">{this.props.movie.release_date}</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad asperiores deleniti ducimus aut iste. Soluta perspiciatis quisquam iusto tenetur beatae ad consectetur ratione eveniet quasi! Quidem obcaecati vitae, doloremque consequuntur!
                        </p>
                    </div> 
                </div>
            </div>
        );
    }
}

// <p>{this.props.movie.overview}</p>