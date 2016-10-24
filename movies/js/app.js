"use strict";

var selectReport = document.getElementById("report-select");
selectReport.addEventListener("change", function() {
    var reportName = selectReport.value;
    if (reportName == "star-wars") {
        render(starWars.sort(compareLocale), Object.keys(starWars[0]));
    } else if (reportName == "20th") {
        render(movies20thCentury.sort(compareDate), Object.keys(starWars[0]));
    } else if (reportName == "avg-by-genre") {
        render(getAvgSalesByGenre(), ["Genre", "Average Sales"]);
    } else {
        console.log(reportName);
    }
});

// https://github.com/info343-a16/info343-in-class/blob/completed/dom/js/app.js
function createElement(elemName, text) {
    var elem = document.createElement(elemName);
    if (text) {
        elem.textContent = text;
    }
    return elem;
}

var thead = document.querySelector("thead");
var tbody = document.querySelector("tbody");

// input: [{
//          title: "Star Wars" 
//          distributor: "Warer" 
//         }, ["title", "ditributor"]]
function render(rows, columnHeaders) {
    thead.innerHTML = "";
    tbody.innerHTML = "";

    var tr = document.createElement("tr");
    columnHeaders.forEach(function(column) {
        tr.appendChild(createElement("th", column));

        thead.appendChild(tr);
    });

    rows.forEach(function(row) {
        var tr = document.createElement("tr");
        columnHeaders.forEach(function(header) {
            tr.appendChild(createElement("td", row[header]));
        });
        tbody.appendChild(tr);
    });
}

// returns all movies with 'star wars' in the title
var starWars = MOVIES.filter(function(movie) {
        return movie.title.toLowerCase().indexOf("star wars") >= 0;
    });

// sort string in ascending order
function compareLocale(movie1, movie2) {
    return movie1.title.localeCompare(movie2.title);
}

var movies20thCentury = MOVIES.filter(function(movie) {
    return movie.released < "2000-01-01T00:00:00Z";
});

console.log(movies20thCentury.sort(compareDate));

function compareDate(movie1, movie2) {
    // return function(movie1, movie2) {
        return movie1.released < movie2.released;
    // }
}


// categorizes all movies by genre
function getGenres(movies) {
    var movieGenres = {};
    movies.forEach(function(movie) {
        var genre = movie.genre;
        if (genre in movieGenres) {
            movieGenres[genre].push(movie);
        } else {
            movieGenres[genre] = [movie]
        }
    });
    return movieGenres;
}

// output: {
//         'Comedy' : $23,542,352.43
//         'Horror' : $234,234,321.12
//         }
// output: [{ "genre" :"Comedy", "sales" : 1234}]
function getAvgSalesByGenre() {
    var movieGenres = getGenres(MOVIES);
    var genres = Object.keys(movieGenres);
    var salesSum = 0;
    genres.forEach(function(genre) {
        salesSum = movieGenres[genre].reduce(function(sum, movie) {
            return sum + movie.sales;
        }, 0);
        movieGenres[genre] = formatCurrency(salesSum / movieGenres[genre].length);
    });
    var output = [];
    Object.keys(movieGenres).forEach(function(key) {
        var genreSales = {
                         "Genre" : key,
                         "Average Sales" : movieGenres[key]
                         };
        output.push(genreSales);
    });
    return output; 
}

function formatCurrency(num) {
    return numeral(num).format('$0,0.00');
}

function formatDate(date) {
    var moment = require('moment');
    return moment(date).format();
}

function top100Movies(movies) {
    var ticketTotal = 0;
    ticketTotal = movies.reduce(function(sum, movie) {
        return sum + movie.tickets;
    });
    console.log(ticketTotal);
}


// function descending(comparator) {
//     return function(rec1, rec2) {
//         return -(comparator(rec1, rec2));
//     }
// }
