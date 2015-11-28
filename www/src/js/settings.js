$(document).ready(function() {
    loadYandex();
    colorboxSettings();
    $('#topButton').click(function() {
        $('body, html').animate({ scrollTop: $('#mainMenu').offset().top + 1 }, 'fast');
        return false;
    });
    $('#content').on('click', '#servicesInfo .table > div', function() {
        $(this).next('.description').slideToggle('fast');
    });
});

function loadScript(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
}

function loadYandex() {
    loadScript('https://api-maps.yandex.ru/2.0/?load=package.map,package.controls,package.geoObjects&amp;lang=ru-RU&amp;onload=ymap');
}

function ymapID(id) {
    var map = new ymaps.Map(id, {
        center: [57.990794,56.304386],
        zoom: 15
    });
    map.controls
        .add('smallZoomControl', { left: '20', top: '20' })
        .add(new ymaps.control.TypeSelector(['yandex#map', 'yandex#satellite', 'yandex#hybrid', 'yandex#publicMap']),
            { left: '50', top: '20' });
    map.geoObjects
        .add(new ymaps.Placemark(
            [57.991806,56.305568],
            { iconContent: '<img height="40" alt="Авто Сига59" src="/assets/img/logo.png" />' },
            { preset: 'twirl#darkgreenStretchyIcon' }
        ));
}

function ymap() {
    ymapID('ymap');
    if ((document.location.pathname === '/contacts') || (document.location.hash === '#/contacts'))
        ymapID('ymapContacts');
}

function colorboxSettings()
{
    $('#content').on('click', '.groupColorBox', function() {
        $('.groupColorBox').colorbox({
            previous:'Назад',
            next:'Вперед',
            close:'Закрыть',
            imgError:'Произошла ошибка при загрузке изображения'
        });
    });
    $('#content').on('click', '.noGroupColorBox', function() {
        $('.noGroupColorBox').colorbox({
            close:'Закрыть',
            imgError:'Произошла ошибка при загрузке изображения'
        });
    });
}