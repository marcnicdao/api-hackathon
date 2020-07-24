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
        var loading = document.createElement('div')
        loading.classList.add('loading')
        this.popularContainer.append(loading)
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/popular?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.popularContainer),
            error: (event, xhr)=>{ this.errorHandler(xhr, this.popularContainer) }
        })
    }


    getMoviesSuccessHandler(movies, container) {
        this.loadMovies(movies, container)
    }

    errorHandler(err, container) {
        console.error(err);
        container.textContent = ''
        var errorMessageDiv = document.createElement('div')
        errorMessageDiv.classList.add('flex', 'center', 'error-message')
        var errorMessage = document.createElement('h3')
        errorMessage.textContent = 'Network error: please try again later'
        errorMessageDiv.append(errorMessage)
        document.querySelector('.modal-similar').classList.remove('no-display')
        container.append(errorMessageDiv)
    }

    getUpcomingMovies() {
        var loading = document.createElement('div')
        loading.classList.add('loading')
        this.upcomingContainer.append(loading)
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.upcomingContainer),
            error: (event, xhr) => { this.errorHandler(xhr, this.upcomingContainer) }
        })
    }

    getSearchedMovies(title) {
        if(!title.trim()){
            this.searchField.value = ""
            return
        }
        var loading = document.createElement('div')
        loading.classList.add('loading')
        this.searchedContainer.append(loading)
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/search/movie?api_key=${this.myApikey1}&query=${title}`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.searchedContainer),
            error: (event, xhr) => {
                this.errorHandler(xhr, this.searchedContainer);
            }
        })
        searchedTitle.textContent = `You searched for: ${title}`
        this.searchField.value = "";
    }

    getMovieByGenre(e){
        var genreId = (genreTitle.textContent ? e.target.dataset.genreId : '28');
        genreTitle.textContent = (genreTitle.textContent ? e.target.textContent : "Action") ;
        var loading = document.createElement('div')
        loading.classList.add('loading')
        this.genreContainer.append(loading)
        $.ajax({
            method: 'GET',
            url: `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=10&api_key=${this.myApikey1}`,
            success: (movies) => this.loadMovies(movies.results, this.genreContainer),
            error: (event, xhr) => { this.errorHandler(xhr, this.genreContainer) }
        })
    }

    loadMovies(movies, container) {
        var leftScrollButton = container.previousElementSibling
        var rightScrollButton = container.nextElementSibling
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

        if (this.similarMovieContainer.childElementCount){
            document.querySelector('.modal-similar').classList.remove('no-display')
            similarMovieCaption.textContent = 'Similar Movies'
        } else {
            document.querySelector('.modal-similar').classList.add('no-display')
            similarMovieCaption.textContent = 'No similar movies found'
        }
        if (this.searchedContainer.childElementCount) {
            document.querySelector('.search-main-container').classList.remove('no-display')
            noResults.classList.add(`no-display`)
        } else {
            document.querySelector('.search-main-container').classList.add('no-display')
            noResults.classList.remove('no-display')
        }
        setTimeout(()=>{

            if (container.clientWidth >= container.scrollWidth) {
                rightScrollButton.disabled = true
                leftScrollButton.disabled = true
            } else {
                rightScrollButton.disabled = false
                leftScrollButton.disabled = true
            }
        }, 300)
    }

    getModalElements(movieId) {
        var loading = document.createElement('div')
        loading.classList.add('loading')
        this.similarMovieContainer.append(loading)
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.myApikey1}&language=en-US&append_to_response=videos,similar`,
            success: response => {
                this.getModalElementsSuccessHandler(response)
            },
            error: (event, xhr) => {
                this.errorHandler(xhr, this.similarMovieContainer)
                similarMovieCaption.classList.add('no-display')
            }
        })
    }


    getModalElementsSuccessHandler(response) {
        if (response.videos.results[0]) {
            this.trailerLink = `https://www.youtube.com/embed/${response.videos.results[0].key}`
            this.trailerPlayer.setAttribute('src', this.trailerLink);
            this.trailerPlayer.classList.remove('no-display')
            noTrailerCaption.classList.add('no-display')
        } else {
            this.trailerPlayer.classList.add('no-display')
            noTrailerCaption.classList.remove('no-display')
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
        this.trailerPlayer.removeAttribute('src');
    }

    eventHandler(e) {

        if (e.target.classList.contains('scroll')) {
            this.scroll(e)
            return
        }
        if (e.target.classList.contains('genre')){
            this.getMovieByGenre(e)
            navUl.classList.add('no-display')
            return
        }
        if (e.target.classList.contains('nav')){
            this.handleNav()
        }
        if(e.target.classList.contains('modal-inner-container')){
            this.exitModal()
        }
        if (!e.target.classList.contains('nav-ul') && !e.target.classList.contains('nav')){
            navUl.classList.add('no-display')
        }
    }

    scroll(e) {
        var targetContainer = document.getElementById(e.target.dataset.target)
        var leftScrollButton = targetContainer.previousElementSibling
        var rightScrollButton = targetContainer.nextElementSibling

        if (e.target.classList.contains('right')) {
            var scrollLenght = targetContainer.clientWidth / 1.5;
            var offset = ((targetContainer.scrollWidth - targetContainer.clientWidth) - targetContainer.scrollLeft)
            var isAtTheEnd = offset <= scrollLenght


            leftScrollButton.disabled = false
            targetContainer.scrollBy(scrollLenght, 0)
            rightScrollButton.disabled = isAtTheEnd

        } else {
            var offset = targetContainer.scrollLeft;
            var scrollLenght = targetContainer.clientWidth / 1.5;
            var isAtTheEnd = offset <= scrollLenght

            rightScrollButton.disabled = false
            targetContainer.scrollBy(-scrollLenght, 0)
            leftScrollButton.disabled = isAtTheEnd

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
