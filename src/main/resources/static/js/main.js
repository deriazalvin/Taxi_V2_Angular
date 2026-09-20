/* TaxiFleet — animations fluides (AOS + micro-interactions) */
(function () {
    var RUNTIME = 750;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js');
    document.documentElement.classList.add('aos-active');

    function initAOS() {
        if (reduced || typeof AOS === 'undefined') {
            document.documentElement.classList.remove('aos-active');
            document.querySelectorAll('[data-aos]').forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }
        AOS.init({
            duration: RUNTIME,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60
        });
        // Reveal par indice pour les listes .stagger
        document.querySelectorAll('.stagger').forEach(function (container) {
            Array.prototype.forEach.call(container.children, function (child, i) {
                child.style.transitionDelay = Math.min(i * 70, 800) + 'ms';
            });
        });
    }

    function countUp() {
        if (reduced) return;
        document.querySelectorAll('[data-count]').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var duration = Math.min(1400, 500 + target * 40);
            var start = null;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min(1, (ts - start) / duration);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    function tilt() {
        if (reduced || !window.matchMedia('(hover: hover)').matches) return;
        document.querySelectorAll('.tilt').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(800px) rotateX(' + (-py * 5) + 'deg) rotateY(' + (px * 5) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    function progressBars() {
        document.querySelectorAll('.progress > span[data-target]').forEach(function (bar) {
            var target = parseFloat(bar.getAttribute('data-target')) || 0;
            setTimeout(function () { bar.style.width = target + '%'; }, 220);
        });
    }

    function ripples() {
        document.querySelectorAll('.btn-ripple').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var r = btn.getBoundingClientRect();
                var wave = document.createElement('span');
                var size = Math.max(r.width, r.height);
                wave.className = 'ripple-wave';
                wave.style.width = wave.style.height = size + 'px';
                wave.style.left = (e.clientX - r.left - size / 2) + 'px';
                wave.style.top = (e.clientY - r.top - size / 2) + 'px';
                btn.appendChild(wave);
                setTimeout(function () { wave.remove(); }, 750);
            });
        });
    }

    function activeNav() {
        var path = window.location.pathname;
        document.querySelectorAll('#main-nav a[data-nav]').forEach(function (a) {
            if (path.indexOf(a.getAttribute('data-nav')) === 0) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('load', function () {
        initAOS();
        tilt();
        ripples();
        progressBars();
        activeNav();
        setTimeout(countUp, 450);
        var login = document.querySelector('.login-card');
        if (login) {
            setTimeout(function () { login.classList.add('ready'); }, 120);
        }
    });
})();