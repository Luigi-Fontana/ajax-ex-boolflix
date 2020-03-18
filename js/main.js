$(document).ready(function(){
    var baseUrl = 'https://api.themoviedb.org/3';
    $.ajax({
        url: baseUrl + '/search/movie',
        data: {
            api_key: '826bc99f9afd0a331c43a3695d0d0263',
            query: 'Lo Hobbit',
            language: 'it-IT',
            page: '1',
            include_adult: 'false'
        },
        method: 'GET',
        success: function (data) {
            var films = data.results;
            for (var i = 0; i < films.length; i++) {
                var film = films[i];
                console.log(film);
            }
        },
        error: function () {
            alert('C\'è qualquadra che non cosa');
        }
    });

});
