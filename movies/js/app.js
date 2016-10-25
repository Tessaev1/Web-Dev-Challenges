"use strict";

var selectReport = document.getElementById("report-select");
selectReport.addEventListener("change", function() {
    var reportName = selectReport.value;
    if (reportName == "star-wars") {
        render(starWars, Object.keys(starWars[0]));
    } else if (reportName == "20th") {
        render(movies20thCentury, Object.keys(starWars[0]));
    } else if (reportName == "avg-by-genre") {
        render(getAvgSalesByGenre(), ["Genre", "Average Sales"]);
    } else {
        render(top100Movies(), ["Title", "Total Tickets Sold"]);
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
            // if (row[header] == "") {
            //     tr.appendChild(createElement("td", "N/A"))
            // }
            tr.appendChild(createElement("td", row[header]));
        });
        tbody.appendChild(tr);
    });
}

// returns all movies with 'star wars' in the title
var starWars = MOVIES.filter(function(movie) {
        return movie.title.toLowerCase().indexOf("star wars") >= 0;
    });

starWars.sort(compareLocale);

// sort string in ascending order
function compareLocale(movie1, movie2) {
    return movie1.title.localeCompare(movie2.title);
}

var movies20thCentury = MOVIES.filter(function(movie) {
    return (movie.released < "2000-01-01T01:00:00Z") && (movie.year >= 2006 && movie.year <= 2015);
});

movies20thCentury.sort(compareDate);
movies20thCentury.map(function(movie) {
    movie.released = formatDate(movie.released);
})

function compareDate(movie1, movie2) {
    return (movie1.released + movie1.year).localeCompare((movie2.released + movie2.year));
}

// categorizes all movies by genre
// make this an array????????????????????????????????
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
    // var genres = Object.keys(movieGenres);
    var salesSum = 0;
    Object.keys(movieGenres).forEach(function(genre) {
        salesSum = movieGenres[genre].reduce(function(sum, movie) {
            return sum + movie.sales;
        }, 0);
        movieGenres[genre] = salesSum / movieGenres[genre].length;
    });
    var output = [];
    Object.keys(movieGenres).forEach(function(key) {
        var genreSales = {
                         "Genre" : key,
                         "Average Sales" : movieGenres[key]
                         };
        output.push(genreSales);
    });
    output.sort(compareGenres).map(function(movie) {
        movie["Average Sales"] = formatCurrency(movie["Average Sales"]);
    });
    return output; 
}

function compareGenres(movie1, movie2) {
    return movie2["Average Sales"] - movie1["Average Sales"];
}

function formatCurrency(num) {
    return numeral(num).format('$0,0.00');
}

function formatDate(date) {
    return moment(date).format("l");
}

function top100Movies() {
    var distinctMovies = getDistinctMovies(MOVIES);
    var output = [];
    Object.keys(distinctMovies).forEach(function(movieKey) {
        var ticketTotal = 0;
        ticketTotal = distinctMovies[movieKey].reduce(function(sum, movie) {
            return sum + movie.tickets;
        }, 0);
        var movie = distinctMovies[movieKey][0];
        output.push({
            "Title" : movie.title + " (" + movie.year + ")",
            "Total Tickets Sold" : ticketTotal
        });
    });
    var top100 = output.sort(compareTicketTotals).slice(0,100);
    return top100;
}

function compareTicketTotals(movie1, movie2) {
    return movie2["Total Tickets Sold"] - movie1["Total Tickets Sold"];
}

// output: {"starwars02/02/2000T00:00" : [{movie object}]}}
function getDistinctMovies(movies) {
    var distinctMovies = {};
    movies.forEach(function(movie) {
        var uniqueID = movie['title'] + movie['released'];
        if (uniqueID in distinctMovies) {
            distinctMovies[uniqueID].push(movie);
        } else {
            distinctMovies[uniqueID] = [movie];
        }
    });
    return distinctMovies;
};

// function descending(comparator) {
//     return function(rec1, rec2) {
//         return -(comparator(rec1, rec2));
//     }
// }
