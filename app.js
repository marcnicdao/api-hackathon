class App{
    constructor(mainContainer){
        this.baseUrl = 'https://api.themoviedb.org/3/?api_key=a135da89bb4463a852b9155a6280f76b'
        this.mainContainer = mainContainer;
        this.getPopularSuccessHandler = this.getPopularSuccessHandler.bind(this);
        //this.getPopularErrorHandler = this.getPopularErrorHandler.bind(this);
    }
    getPopularMovies(){
        $.ajax({
            method: "Get",
            url: 'https://api.themoviedb.org/3/movie/popular?api_key=a135da89bb4463a852b9155a6280f76b&language=en-US&page=1',
            success: (movies)=>this.getPopularSuccessHandler(movies.results),
            error: this.getPopularErrorHandler
        })
    }
    getPopularSuccessHandler(movies){
        console.log(movies)
        var popularContainer = document.createElement('div');
        popularContainer.classList.add('movie-scroll')
        var popularTable = document.createElement('table')
        popularTable.classList.add('table','table-dark')
        //var popularTableHead = document.createElement('thead');
        //var thEl = document.createElement('th');
        var popularTableBody = document.createElement('tbody');
        //thEl.textContent = 'Popular Movies';
        //thEl.classList.add('section-title')
        //thEl.colSpan = 2
        //popularTableHead.append(thEl);
        //popularTable.append(popularTableHead);

        movies.forEach((movies)=>{
            var row = document.createElement('tr')
            var posterTd = document.createElement('td');
            var moviePoster = document.createElement('img');
            moviePoster.src = `https://image.tmdb.org/t/p/w200${movies.poster_path}`;

            var movieInfo = document.createElement('td');
            var moviePlot = document.createElement('p');
            moviePlot.textContent = movies.overview;

            movieInfo.append(moviePlot)
            posterTd.append(moviePoster)
            row.append(posterTd, movieInfo)
            popularTableBody.append(row)
        })
        popularTable.append(popularTableBody)
        popularContainer.append(popularTable);
        this.mainContainer.append(popularContainer)
    }
}
