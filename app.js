class App {
    constructor(mainContainer, popularContainer, upcomingContainer, searchedContainer, searchField, similarMovieContainer, genreContainer) {
        this.mainContainer = mainContainer;
        this.popularContainer = popularContainer;
        this.upcomingContainer = upcomingContainer;
        this.searchedContainer = searchedContainer;
        this.genreContainer = genreContainer;
        this.movies = [];
        this.searchField = searchField;
        this.searchField.addEventListener('change', () => this.getSearchedMovies(this.searchField.value))
        this.getMoviesSuccessHandler = this.getMoviesSuccessHandler.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.getModalElementsSuccessHandler = this.getModalElementsSuccessHandler.bind(this)
        this.trailerLink = null;
        this.trailerPlayer = document.querySelector('.trailer-player')
        this.movieModal = document.querySelector('.modal');
        this.myApikey1 = myApikey1;
        this.myApikey2 = myApikey2;
        this.exitModal = this.exitModal.bind(this)
        this.domElements = {}
        this.similarMovieContainer = similarMovieContainer;
    }

    start() {
        this.getPopularMovies();
        this.getUpcomingMovies();
        this.getSearchedMovies('star wars');
        this.getGenreList();
        this.getMovieByGenre();
    }

    getGenreList() {
        $.ajax({
            method: 'GET',
            url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.myApikey1}`,
            success: (response) => this.fillNavBar(response.genres)
        })
    }
    fillNavBar(genres){
        genres.forEach((genres)=>{
            var newLi = document.createElement('li');
            newLi.textContent = genres.name;
            newLi.classList.add('genre');
            newLi.dataset.genreId = genres.id;
            navUl.append(newLi)
        })
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

    errorHandler(err) {
        console.error(err)
    }

    getUpcomingMovies() {
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.upcomingContainer),
            error: this.errorHandler
        })
    }

    getSearchedMovies(title) {
        this.searchedContainer.textContent = " ";
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/search/movie?api_key=${this.myApikey1}&query=${title}`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.searchedContainer),
            error: () => {
                this.errorHandler();
                alert('Could not contact server ')
            }
        })
        this.searchField.value = " ";
    }

    getMovieByGenre(e){
        var genreId = (genreTitle.textContent ? e.target.dataset.genreId : '28');
        genreTitle.textContent = (genreTitle.textContent ? e.target.textContent : "Action") ;
        this.genreContainer.textContent = " ";
        $.ajax({
            method: 'GET',
            url: `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=10&api_key=${this.myApikey1}`,
            success: (movies) => this.loadMovies(movies.results, this.genreContainer),
            error: ()=> {
                this.errorHandler();
                alert('Could not contact server ')
            }
        })
    }

    loadMovies(movies, container) {
        container.textContent = ""
        movies.forEach((movie) => {
            var moviePoster = document.createElement('img');
            var movieCard = document.createElement('div')
            movieCard.classList.add('cards')
            moviePoster.title = movie.title
            moviePoster.dataset.movieId = movie.id
            moviePoster.classList.add('poster')
            movieCard.append(moviePoster)
            moviePoster.addEventListener('click', (e) => this.showModal(e))
            if (movie.poster_path) {
                moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                container.append(movieCard);
            }
        })

    }

    getModalElements(movieId) {
        $.ajax({
            method: "GET",
            url: `http://api.themoviedb.org/3/movie/${movieId}?api_key=${this.myApikey1}&language=en-US&append_to_response=videos,similar`,
            success: response => {
                this.getModalElementsSuccessHandler(response)
            },
            error: this.getMoviesErrorHandler
        })
    }
    showErrorModal(){

    }

    getModalElementsSuccessHandler(response) {
        if (response.videos.results[0]) {
            this.trailerLink = `https://www.youtube.com/embed/${response.videos.results[0].key}`
            this.trailerPlayer.setAttribute('src', this.trailerLink);
        }
        movieOverview.textContent = response.overview;
        releaseDate.textContent = "Released: " + response.release_date;
        averageRate.textContent = `Average ratings: ${response.vote_average} (${response.vote_count} votes)`;
        this.loadMovies(response.similar.results, this.similarMovieContainer)
    }

    showModal(e) {
        this.movieModal.classList.remove('hidden');
        this.getModalElements(e.target.dataset.movieId);
    }

    exitModal() {
        this.similarMovieContainer.textContent = " ";
        this.movieModal.classList.add('hidden');
        this.trailerPlayer.setAttribute('src', null);
    }

    eventHandler(e) {
        if (e.target.classList.contains('scroll')) {
            this.scroll(e)
        }
        if (e.target.classList.contains('genre')){
            this.getMovieByGenre(e)
        }
        if (e.target.classList.contains('nav')){
            this.handleNav()
        }
    }

    scroll(e) {
        var targetContainer = document.getElementById(e.target.dataset.target)
        if (e.target.classList.contains('right')) {
            targetContainer.scrollBy(window.innerWidth/1.5, 0)
        } else {
            targetContainer.scrollBy(-window.innerWidth/1.5, 0)
        }

    }

    handleNav(){
        if(navUl.classList.contains('no-display')){
            navUl.classList.remove('no-display')
        } else {
            navUl.classList.add('no-display')
        }
    }

}
