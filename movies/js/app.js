"use strict";

var columnHeadings = Object.keys(MOVIES[0]);
var reportHeading = document.querySelector("h2");
var selectReport = document.getElementById("report-select");

// generates a report when the user selects an option in the drop-down list
selectReport.addEventListener("change", function(e) {
    var reportName = selectReport.value;
    // set heading equal to the event target  
    var heading = Array.from(e.target).find(function(child) {
        return child.value === e.target.value;
    }).innerText;
    reportHeading.innerText = heading;
    if (reportName == "star-wars") {
        render(starWars); 
    } else if (reportName == "20th") {
        render(movies20thCentury);
    } else if (reportName == "avg-by-genre") {
        render(getAvgSalesByGenre());
    } else {
        render(top100Movies());
    }
});

// creates a column element
function createColumnElement(elemName, text, columnName) {
    var elem = document.createElement(elemName);
    if (text) {
        if (typeof MOVIES[0][columnName] === "number" || 
            columnName.toLowerCase().includes("sales") ||
            columnName.toLowerCase().includes("tickets")) {
            elem.classList.add("num-col-heading");
        }
        elem.textContent = text;
    }
    return elem;
}

// creates a row element and formats it accordingly
function createRowElement(elemName, text, columnName) {
    var elem = document.createElement(elemName);
    if (text) {
        var formattedText = text;
        if (columnName.toLowerCase().includes("sales")) {
            formattedText = numeral(text).format('$0,0[.]00');
            elem.classList.add("sales-column");
        } else if (columnName.toLowerCase().includes("ticket")) {
            elem.classList.add("ticket-column");
            formattedText = numeral(text).format('0,0');
        } else if (columnName.toLowerCase().includes("released")) {
            elem.classList.add("released-column");
            formattedText = moment(text).format("l");
        } else if (columnName.toLowerCase().includes("year")) {
            elem.classList.add("year-column");
        } 
        elem.textContent = formattedText;
    }
    return elem;
}

var thead = document.querySelector("thead");
var tbody = document.querySelector("tbody");

// renders a table with the given row and column data
function render(rows) {
    var columnHeaders = Object.keys(rows[0]);
    thead.innerHTML = "";
    tbody.innerHTML = "";

    var tr = document.createElement("tr");
    columnHeaders.forEach(function(column) {
        tr.appendChild(createColumnElement("th", column.toTitleCase(), column));
        thead.appendChild(tr);
    });

    rows.forEach(function(row) {
        var tr = document.createElement("tr");
        columnHeaders.forEach(function(header) {
            tr.appendChild(createRowElement("td", (row[header] || "N/A"), header));
        });
        tbody.appendChild(tr);
    });
}

// returns all movies with 'star wars' in the title, sorted in alphabetically ascending order
var starWars = MOVIES.filter(function(movie) {
    return movie.title.toLowerCase().indexOf("star wars") >= 0;
}).sort(compareLocale);

// returns all movies that were released before Jan. 1st 2000 and made revenues between 2006 and 2015
// sorted in ascending order (oldest at the top)
var movies20thCentury = MOVIES.filter(function(movie) {
    return (movie.released < "2000-01-01T01:00:00Z") && (movie.year >= 2006 && movie.year <= 2015);
}).sort(compareDate);

// returns the average sales of each genre
// output: [{ "genre" :"Comedy", "sales" : 1234}, {...}, {...}]
function getAvgSalesByGenre() {
    var movieGenres = getMovieProperty(MOVIES, ["genre"]);
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
    return output.sort(function(movie1, movie2) {
        return movie2["Average Sales"] - movie1["Average Sales"];
    });
}

// returns the top 100 movies with the highest number of tickets sold
function top100Movies() {
    var distinctMovies = getMovieProperty(MOVIES, ["title", "released"]);
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
    return output.sort(function(movie1, movie2) {
        return movie2["Total Tickets Sold"] - movie1["Total Tickets Sold"];
    }).slice(0,99);
}

function getMovieProperty(movies, property) {
    var current = {};
    movies.forEach(function(movie) {
        var key = "";
        property.forEach(function(prop) {
            key += movie[prop];
        });
        if (key in current) {
            current[key].push(movie);
        } else {
            current[key] = [movie]
        }
    });
    return current;
}

function compareLocale(movie1, movie2) {
    return movie1.title.localeCompare(movie2.title);
}

function compareDate(movie1, movie2) {
    var releasedCompare = moment(movie1.released).diff(movie2.released);
    if (releasedCompare === 0) {
        return movie1.year - movie2.year;
    }
    return releasedCompare;
}

// String to title case
// Alex Bell-Towne gave me this function
String.prototype.toTitleCase = function() {
    return this.split(" ").map(function(word) {
        // Capitalize first letter of each word
        word = word.toLocaleLowerCase();
        return word.substring(0, 1).toLocaleUpperCase()
                + word.substring(1, word.length);

    }).join(" ");
}