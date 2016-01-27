//create the stars effect on homepage
export const stars = (canvas) => {

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 30);
        };
    })();

    $(canvas).attr("width", $(window).width() - 20);
    $(canvas).attr("height", $("#top-home-container").height() - 10);

    const context = canvas.getContext('2d');
    const sizes = ['micro', 'mini', 'medium', 'big', 'max'];
    const elements = [];
    const max_bright = 1;
    const min_bright = .2;

    /* FUNCTIONS */
    const generate = (starsCount, opacity) => {
        for (var i = 0; i < starsCount; i++) {
            var x = randomInt(2, canvas.offsetWidth - 2),
                y = randomInt(2, canvas.offsetHeight - 2),
                size = sizes[randomInt(0, sizes.length - 1)];

            elements.push(star(x, y, size, opacity));
        }
    }

    const star = (x, y, size, alpha) => {
        var radius = 0;
        switch (size) {
            case 'micro':
                radius = 0.5;
                break;
            case 'mini':
                radius = 1;
                break;
            case 'medium':
                radius = 1.5;
                break;
            case 'big':
                radius = 2;
                break;
            case 'max':
                radius = 3;
                break;
        }

        var gradient = context.createRadialGradient(x, y, 0, x + radius, y + radius, radius * 2);

        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + alpha + ')');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        /* clear background pixels */
        context.beginPath();
        context.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
        context.closePath();

        /* draw star */
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = gradient;
        context.fill();

        return {
            'x': x,
            'y': y,
            'size': size,
            'alpha': alpha
        };
    }

    const randomInt = (a, b) => {
        return Math.floor(Math.random() * (b - a + 1) + a);
    }

    const randomFloatAround = (num) => {
        var plusminus = randomInt(0, 1000) % 2,
            val = num;
        if (plusminus)
            val += 0.1;
        else
            val -= 0.1;
        return parseFloat(val.toFixed(1));
    }

    /* init */
    generate(200, .6);

}
