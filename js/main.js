$(document).ready(function () {
    // Definizioni Variabili usate in seguito
    var apiBaseUrl = 'https://api.themoviedb.org/3';
    var coverBaseUrl = 'https://image.tmdb.org/t/p/';
    var coverBaseSize = 'w342';
    // Clono il template di Handlebars e glielo dò in pasto
    var cardSource = $('#card-template').html();
    var cardTemplate = Handlebars.compile(cardSource);

    $('#icon-search').click(function () {
        search();
    });
    $('#search').keypress(function (event) {
        if (event.keyCode == 13) {
            search();
        };
    });

    $('.container').on('mouseenter', '.card', function () {
        $(this).children('.front').hide();
        $(this).children('.back').fadeIn(100);
    });

    $('.container').on('mouseleave', '.card', function () {
        $(this).children('.front').fadeIn(100);
        $(this).children('.back').hide();
        $(this).children('.back-click').hide();
    });

    $('.container').on('click', '.card .back', function () {
        $(this).hide();
        $(this).siblings('.back-click').fadeIn(100);
        $('.card .back-click-cast').children('p').remove();
        $('.card .back-click-genres').children('p').remove();
        var type = $(this).parent().data('type');
        var id = $(this).parent().data('card');
        apiCallCast(type, id);
        apiCallGenres(type, id);
    });

    $('.container').on('click', '.card .back-click', function () {
        $(this).siblings('.back').fadeIn(100);
        $(this).hide();
    });

    function search() { // Funzione di ricerca con autoeliminazione input e controllo sull'inserimento di almeno un carattere per la ricerca
        var input = $('#search').val();
        $('#search').val('');
        if (input.length > 0) {
            $('.card').remove(); // Innanzittuo rimuovo tutte le card prima di crearne di nuove
            apiCall('movie', input);
            apiCall('tv', input);
        } else {
            alert('Campo di ricerca vuoto');
        };
    };

    function apiCall(type, query) { // Funzione di chiamata API con tipo e query in entrata
        $.ajax({
            url: apiBaseUrl + '/search/' + type,
            data: {
                api_key: 'e99307154c6dfb0b4750f6603256716d',
                query: query,
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {
                var cards = data.results;
                printCard(type, cards);
            },
            error: function (err) {
                alert('Database Error');
            }
        });
    };

    function apiCallCast(type, id) { // Funzione di chiamata API per trovare il Cast con tipo e ID in entrata
        $.ajax({
            url: apiBaseUrl + '/' + type + '/' + id + '/credits',
            data: {
                api_key: 'e99307154c6dfb0b4750f6603256716d'
            },
            method: 'GET',
            success: function (data) {
                var cast = data.cast;
                printCast(cast);
            },
            error: function (err) {
                alert('Database Error');
            }
        });
    };

    function apiCallGenres(type, id) { // Funzione di chiamata API per trovare i generi con tipo e ID in entrata
        $.ajax({
            url: apiBaseUrl + '/' + type + '/' + id,
            data: {
                api_key: 'e99307154c6dfb0b4750f6603256716d',
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {
                var genres = data.genres;
                printGenres(genres);
            },
            error: function (err) {
                alert('Database Error');
            }
        });
    };

    function printCard(type, array) { // Funzione di stampa della Card con Handlebars con tipo e array di oggetti in entrata
        for (var i = 0; i < array.length; i++) {
            var card = array[i];
            if (type == 'movie') {
                titolo = card.title;
                titoloOriginale = card.original_title;
            } else if (type == 'tv') {
                titolo = card.name;
                titoloOriginale = card.original_name;
            }
            var cardInfos = {
                contatore: card.id,
                tipo: type,
                cover: linkCover(card.poster_path),
                titolo: titolo,
                titoloOriginale: titoloOriginale,
                lingua: createFlag(card.original_language),
                voto: transformVote(card.vote_average),
                stars: createStars(transformVote(card.vote_average)),
                trama: createDefaultOverview(card.overview)
            };
            var cardHtml = cardTemplate(cardInfos);
            $('.container').append(cardHtml);
            deleteTitle(cardInfos.titolo, cardInfos.titoloOriginale);
        };
    };

    function printCast(array) { // Funzione di stampa dei primi 5 attori del Cast
        if (array.length > 0) {
            for (var i = 0; i < 5; i++) {
                var member = array[i];
                var memberName = member.name;
                $('.back-click-cast').append('<p> - ' + memberName + '</p>');
            };
        } else {
            $('.back-click-cast').append('<p> Cast non disponibile </p>');
        };
    };

    function printGenres(array) { // Funzione di stampa dei generi
        if (array.length > 0) {
            for (var i = 0; array.length; i++) {
                var genre = array[i];
                var genreName = genre.name;
                $('.back-click-genres').append('<p> - ' + genreName + '</p>');
            };
        } else {
            $('.back-click-genres').append('<p> Genere non disponibile </p>');
        };
    };

    function createFlag(language) { // Funzione di sostituzione della lingua in bandiere della nazione corrispondente
        var flags = [
            'be',
            'cn',
            'cs',
            'cz',
            'da',
            'de',
            'en',
            'es',
            'fr',
            'it',
            'ja',
            'nl',
            'pl',
            'pt',
            'ro',
            'ru',
            'ta',
            'tl',
            'tr'
        ];
        if (flags.includes(language)) {
            var flag = '<img class="flag" src="img/flags/' + language + '.png" alt="' + language + '">';
            return flag;
        }
        return language;
    }

    function transformVote(vote) { // Funzione di conversione del voto da decimi a quinti
        return Math.ceil(vote / 2);
    };

    function createStars(vote) { // Funzione di creazione stelle in numero uguale al voto in quinti
        var stars = '';
        for (var i = 1; i <= 5; i++) {
            if (i <= vote) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    };

    function deleteTitle(title, original) { // Funzione di eliminazione del titolo originale se è uguale al titolo
        if (title == original) {
            $(".card:last-child").find(".title").remove();
        }
    };

    function linkCover(link) { // Funzione di creazione del link alle cover e immagine standard in caso di cover assente
        if (link !== null) {
            return coverBaseUrl + coverBaseSize + link;
        } else {
            return 'img/nocover.png';
        }
    }

    function createDefaultOverview(text) { // Funzione di correzione testo vuoto in caso di trama assente
        if (text == '') {
            return 'Trama non disponibile';
        } else {
            return text;
        }
    }
});
