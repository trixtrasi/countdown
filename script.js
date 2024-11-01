console.clear();

function CountdownTracker(label, value) {
    var el = document.createElement('span');

    el.className = 'flip-clock__piece';
  el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>' +
        '<span class="flip-clock__slot">'+label+'</span>';
    this.el = el;

    var top = el.querySelector('.card__top'),
        bottom = el.querySelector('.card__bottom'),
        back = el.querySelector('.card__back'),
        backBottom = el.querySelector('.card__back .card__bottom');

    this.update = function (val) {
        val = String(val); // Permitir qualquer número de dígitos
        if (val !== this.currentValue) {
            if (this.currentValue >= 0) {
                back.setAttribute('data-value', this.currentValue);
                bottom.setAttribute('data-value', this.currentValue);
            }
            this.currentValue = val;
            top.innerText = this.currentValue;
            backBottom.setAttribute('data-value', this.currentValue);

            this.el.classList.remove('flip');
            void this.el.offsetWidth;
            this.el.classList.add('flip');
        }
    }

    this.update(value);
}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var seconds = Math.floor((t / 1000) % 60);
    return {
        'Total': t,
        'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
        'Hours': (hours < 10) ? '0' + hours : hours,
        'Minutes': (minutes < 10) ? '0' + minutes : minutes,
        'Seconds': (seconds < 10) ? '0' + seconds : seconds
    };
}

function Clock(countdown, callback) {
    countdown = countdown ? new Date(Date.parse(countdown)) : false;
    callback = callback || function () { };

    var updateFn = getTimeRemaining;

    this.el = document.createElement('div');
    this.el.className = 'flip-clock';

    var trackers = {},
        t = updateFn(countdown),
        key, timeinterval;

    for (key in t) {
        if (key === 'Total') { continue; }
        trackers[key] = new CountdownTracker(key, t[key]);
        this.el.appendChild(trackers[key].el);
    }

    var i = 0;
    function updateClock() {
        timeinterval = requestAnimationFrame(updateClock);

        if (i++ % 10) { return; }

        var t = updateFn(countdown);
        if (t.Total < 0) {
            cancelAnimationFrame(timeinterval);
            for (key in trackers) {
                trackers[key].update(0);
            }
            callback();
            return;
        }

        for (key in trackers) {
            trackers[key].update(t[key]);
        }

        // Adicione aqui o Easter Egg
        maybeShowEasterEgg();
    }

    setTimeout(updateClock, 500);
}

// Função para exibir o Easter Egg no canto direito
function maybeShowEasterEgg() {
    // Probabilidade de 1 em 100 de aparecer o easter egg em cada atualização
    if (Math.random() < 0.0001) {
        //imagem
        var easterEggImage = document.createElement('img');
        //musica
        var easterEggSound = new Audio('sound.mp3');
        
        easterEggImage.src = 'url.webp'; // Coloque o caminho da sua imagem aqui
        easterEggImage.className = 'easter-egg';
        easterEggImage.style.position = 'fixed';
        easterEggImage.style.width = '10%';
        easterEggImage.style.bottom = '0px'; // Ajuste a posição de cima se necessário
        easterEggImage.style.right = '10px'; // Ajuste a posição da direita se necessário
        easterEggImage.style.zIndex = 1000; // Certifique-se de que a imagem apareça por cima
        
        document.body.appendChild(easterEggImage);
        easterEggSound.play()
        
        // Remova a imagem após alguns segundos
        setTimeout(function () {
            easterEggImage.remove();
        }, 3000); // 3 segundos de exibição
    }
}

var deadline = new Date('2025-10-31T00:00:00');
var c = new Clock(deadline, function () { alert('countdown complete'); });
document.body.appendChild(c.el);

var clock = new Clock();
