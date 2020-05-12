class App {
    constructor(mainContainer, popularContainer, upcomingContainer, searchedContainer, searchField) {
        this.baseUrl = 'https://api.themoviedb.org/3/?api_key=a135da89bb4463a852b9155a6280f76b'
        this.mainContainer = mainContainer;
        this.popularContainer = popularContainer
        this.upcomingContainer = upcomingContainer
        this.searchedContainer = searchedContainer
        this.searchField = searchField;
        this.searchField.addEventListener('change', ()=>this.getSearchedMovies(this.searchField.value))
        this.getMoviesSuccessHandler = this.getMoviesSuccessHandler.bind(this);
        this.getMoviesErrorHandler = this.getMoviesErrorHandler.bind(this);
        this.getTrailerLinkSuccessHandler = this.getTrailerLinkSuccessHandler.bind(this)
        this.trailerLink = null;
    }
    getPopularMovies() {
        $.ajax({
            method: "GET",
            url: 'https://api.themoviedb.org/3/movie/popular?api_key=a135da89bb4463a852b9155a6280f76b&language=en-US&page=1',
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.popularContainer),
            error: this.getMoviesErrorHandler
        })
    }
    getMoviesSuccessHandler(movies, container) {
        console.log(movies)
        this.loadMovies(movies, container)
    }

    getMoviesErrorHandler(err) {
        console.error(err)
    }
    getUpcomingMovies(){
        $.ajax({
            method: "GET",
            url: 'https://api.themoviedb.org/3/movie/upcoming?api_key=a135da89bb4463a852b9155a6280f76b&language=en-US&page=1',
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.upcomingContainer),
            error: this.getPopularErrorHandler
        })
    }
    getSearchedMovies(title){
        this.searchedContainer.textContent = " ";
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/search/movie?api_key=a135da89bb4463a852b9155a6280f76b&append_to_response=people&query=${title}`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.searchedContainer),
            error: this.getPopularErrorHandler
        } )
        this.searchField.value = " ";
    }
    loadMovies(movies, container) {
        movies.forEach((movie) => {
            var movieCard = document.createElement('div');
            var anchor = document.createElement('a');
            //debugger

            this.getTrailerLink(movie.id, anchor);

            movieCard.classList.add('cards')
            var moviePoster = document.createElement('img');
            moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            movieCard.append(moviePoster);
            anchor.append(movieCard)
            container.append(anchor);
        })
    }
    getTrailerLink(movieId){

        $.ajax({
            method: "GET",
            url: `http://api.themoviedb.org/3/movie/${movieId}/videos?api_key=a135da89bb4463a852b9155a6280f76b`,
            success: (response)=>{this.getTrailerLinkSuccessHandler(response.results)},
            error: this.getMoviesErrorHandler
        })
    }

    getTrailerLinkSuccessHandler(response){
        this.trailerLink = `www.youtube.com/watch?v=${response[0].key}`
        anchor.href = this.trailerLink
    }


}
