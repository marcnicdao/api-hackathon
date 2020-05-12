class App {
    constructor(mainContainer, popularContainer, upcomingContainer, searchedContainer, searchField, movieModal) {
        this.mainContainer = mainContainer;
        this.popularContainer = popularContainer
        this.upcomingContainer = upcomingContainer
        this.searchedContainer = searchedContainer
        this.searchField = searchField;
        this.searchField.addEventListener('change', () => this.getSearchedMovies(this.searchField.value))
        this.getMoviesSuccessHandler = this.getMoviesSuccessHandler.bind(this);
        this.getMoviesErrorHandler = this.getMoviesErrorHandler.bind(this);
        this.getTrailerLinkSuccessHandler = this.getTrailerLinkSuccessHandler.bind(this)
        this.trailerLink = null;
        this.movieModal = movieModal;
        this.myApikey1 = myApikey1;
    }
    getPopularMovies() {
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/popular?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.popularContainer),
            error: this.getMoviesErrorHandler
        })
    }


    getMoviesSuccessHandler(movies, container) {
        this.loadMovies(movies, container)
    }

    getMoviesErrorHandler(err) {
        console.error(err)
    }

    getUpcomingMovies() {
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.upcomingContainer),
            error: this.getPopularErrorHandler
        })
    }

    getSearchedMovies(title) {
        this.searchedContainer.textContent = " ";
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/search/movie?api_key=${this.myApikey1}&append_to_response=people&query=${title}`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.searchedContainer),
            error: this.getPopularErrorHandler
        })
        this.searchField.value = " ";
    }

    loadMovies(movies, container) {
        movies.forEach((movie) => {
            var movieCard = document.createElement('div');
            var trailerAnchor = document.createElement('a');
            var moviePoster = document.createElement('img');
            //debugger
            this.getTrailerLink(movie.id);

            trailerAnchor.href = this.trailerLink
            trailerAnchor.target = '_blank'
            movieCard.classList.add('cards')
            moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            trailerAnchor.append(moviePoster);
            movieCard.append(trailerAnchor)
            movieCard.dataset.movieId = movie.id


            if(movie.poster_path){
                container.append(movieCard);
            }
        })
    }

    getTrailerLink(movieId) {

        $.ajax({
            method: "GET",
            async: false,
            url: `http://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${this.myApikey1}`,
            success: (response) => { this.getTrailerLinkSuccessHandler(response.results)
            console.log(response) },
            error: this.getMoviesErrorHandler
        })
    }

    getTrailerLinkSuccessHandler(response) {
        if(response[0]){
            this.trailerLink = `https://www.youtube.com/watch?v=${response[0].key}`

        }

    }

}
