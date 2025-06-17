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
  const apiKey = '25c23bdf-6733-4a49-afa5-1dff120896e3'; // замени на свой ключ
  const firmId = '70000001032112293'; // замените на ID вашей фирмы
  const mapgl = window.mapgl; // Предполагается, что mapgl уже подключен в HTML

  async function loadMapWithFirm() {
    try {
      const response = await fetch(`https://catalog.api.2gis.com/3.0/items/byid?id=${firmId}&fields=items.point,items.name&key=${apiKey}`);
      const data = await response.json();

      const item = data.result.items[0];
      const coords = [item.point.lon, item.point.lat];

      const map = new mapgl.Map('map', {
        center: coords,
        zoom: 17,
        key: apiKey
      });

      new mapgl.Marker(map, {
        coordinates: coords,
      
      });
    } catch (error) {
      console.error('Ошибка загрузки данных из Places API:', error);
      document.getElementById('map').innerHTML = '<p>Не удалось загрузить карту.</p>';
    }
  }

  loadMapWithFirm();

  function copyPhone(phone) {
            // Создаем временный элемент для копирования
            const tempInput = document.createElement('input');
            tempInput.value = phone;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Показываем уведомление
            alert('Номер телефона скопирован в буфер обмена: ' + phone);
        }
});

 