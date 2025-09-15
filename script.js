  document.addEventListener('DOMContentLoaded', function() {
        const track = document.getElementById('partnersTrack');
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollInterval;
        let isHovering = false;
        
        // Автоматическая прокрутка
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                if (!isDown && !isHovering) {
                    track.scrollLeft += 2; // Скорость прокрутки
                    
                    // Возврат в начало при достижении конца
                    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 10) {
                        setTimeout(() => {
                            track.scrollLeft = 0;
                        }, 1000);
                    }
                }
            }, 30); // Интервал обновления
        }
        
        // Обработчики мыши для drag-scroll
        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.classList.add('grabbing');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.classList.remove('grabbing');
        });
        
        track.addEventListener('mouseup', () => {
            isDown = false;
            track.classList.remove('grabbing');
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Чувствительность прокрутки
            track.scrollLeft = scrollLeft - walk;
        });
        
        // Остановка автоскролла при наведении
        track.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        track.addEventListener('mouseleave', () => {
            isHovering = false;
        });
        
        // Touch события для мобильных
        track.addEventListener('touchstart', (e) => {
            isDown = true;
            track.classList.add('grabbing');
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });
        
        track.addEventListener('touchend', () => {
            isDown = false;
            track.classList.remove('grabbing');
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
        
        // Запуск автоматической прокрутки
        startAutoScroll();
    });

    document.addEventListener('DOMContentLoaded', function() {
        $(function() {
    // Показываем кнопку при скролле
    $(window).scroll(function() {
        $('#toTop').toggle($(this).scrollTop() > 300);
    });
    
    // Плавный скролл наверх
    $('#toTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
});

// Инициализация карты после загрузки API
        ymaps.ready(init);
        
        function init() {
            // Координаты Национального центра детской реабилитации (Турана 36, Астана)
            var centerCoords = [51.120293, 71.404809];
            
            // Создание карты
            var footerMap = new ymaps.Map("footer-map", {
                center: centerCoords,
                zoom: 16,
                controls: [] // Убираем элементы управления для минималистичного вида
            });
            
            // Добавление метки
            var placemark = new ymaps.Placemark(centerCoords, {
                hintContent: 'Национальный центр детской реабилитации',
                balloonContent: 'Астана, ул. Турана, 36'
            }, {
                // Настройки внешнего вида метки
                iconLayout: 'default#image',
                iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40]
            });
            
            // Добавляем метку на карту
            footerMap.geoObjects.add(placemark);
            
            // Отключаем zoom при скролле колесиком мыши (опционально)
            footerMap.behaviors.disable('scrollZoom');
        }

});

 