$(document).ready(function () {

    var cardSource = $('#card-template').html(); // Clono il template di Handlebars e glielo dò in pasto
    var cardTemplate = Handlebars.compile(cardSource);

    $('#btn-search').click(function () {
        search();
    });
    $('#search').keypress(function (event) {
        if (event.keyCode == 13) {
            search();
        };
    });

    function search() { // Funzione ricerca con autoeliminazione input e controllo sull'inserimento di almeno un carattere per la ricerca
        var input = $('#search').val();
        $('#search').val('');
        if (input.length > 0) {
            apiCall(input);
        } else {
            alert('Campo di ricerca vuoto');
        };
    };

    function apiCall(query) { // Funzione di chiamata API con query in entrata
        var baseUrl = 'https://api.themoviedb.org/3';
        $.ajax({
            url: baseUrl + '/search/movie',
            data: {
                api_key: '826bc99f9afd0a331c43a3695d0d0263',
                query: query,
                language: 'it-IT'
            },
            method: 'GET',
            success: function (data) {
                var cards = data.results;
                printCard(cards);
            },
            error: function () {
                alert('Database Error');
            }
        });
    };

    function printCard(array) { // Funzione di stampa della Card con Handlebars con array di oggetti in entrata
        $('.card').remove(); // Innanzittuo rimuovo tutte le card prima di crearne di nuove
        for (var i = 0; i < array.length; i++) {
            var card = array[i];
            var cardInfos = {
                titolo: card.title,
                titoloOriginale: card.original_title,
                lingua: card.original_language,
                voto: transformVote(card.vote_average)
            };
            var cardHtml = cardTemplate(cardInfos);
            $('.container').append(cardHtml);
            stars(cardInfos.voto);
        };
    };

    function transformVote(vote) { // Funzione che converte il voto in decimi in quinti
        return Math.ceil(vote / 2);
    };

    function stars(vote) { // Funzione che calcola la percentuale di larghezza che deve avere il div delle stelle piene
        var percentage = (vote * 100) / 5;
        $(".card:last-child").find(".fill-stars").css( "width", percentage + "%");
    };
});
