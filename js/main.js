$(document).ready(function () {
    var baseUrl = 'https://api.themoviedb.org/3';

    var source = $('#card-template').html();
    var template = Handlebars.compile(source);

    $('#btn-search').click(function () {
        var input = $('#search').val();
        console.log(input);
        $('#search').val('');
        $.ajax({
            url: baseUrl + '/search/movie',
            data: {
                api_key: '826bc99f9afd0a331c43a3695d0d0263',
                query: input,
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {
                var films = data.results;
                for (var i = 0; i < films.length; i++) {
                    var film = films[i];
                    console.log(film);
                    var filmTemplate = {
                        titolo: film.title,
                        titoloOriginale: film.original_title,
                        lingua: film.original_language,
                        voto: film.vote_average
                    };
                        var cardFilm = template(filmTemplate);
                        $('.container-card').append(cardFilm);
                };
            },
            error: function () {
                alert('C\'è qualquadra che non cosa');
            }
        });
    });

});
