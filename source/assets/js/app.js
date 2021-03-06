import Modernizr from 'modernizr';

const $ = window.$;
const TEYEPE = window.TEYEPE || {};

TEYEPE.blink = () => {
    const logo = document.getElementById('animatable-logo'),
        animationEnter = document.getElementById('animation-enter'),
        animationOut = document.getElementById('animation-out');

    for (let i = 0; i < logo.length; i++) {
        logo[i].addEventListener('mouseenter', function() {
            animationEnter.beginElement();
        });
    }
};

TEYEPE.scrollLoop = () => {
    const app = {
        scrollInterval: 30,
        scrollOffset: 150,
        pageHeight: null,
        loop: function() {
            app.pageHeight = $(".js-loop").outerHeight();
            $(".js-loop").clone().attr('id', 'is-clone').insertAfter(".js-loop");
            $("#is-clone").removeClass('js-loop');
            $(window).on("load", function() {
                app.pageHeight = $(".js-loop").outerHeight();
            });
            $(window).on("resize", function() {
                app.pageHeight = $(".js-loop").outerHeight();
            });
            let initialOffset = app.scrollOffset;
            $(window).scrollTop(initialOffset);
            app.interval = setInterval(app.watchScroll, app.scrollInterval);
        },
        watchScroll: function() {
            let pos = $(window).scrollTop();
            if (pos < app.scrollOffset) {
                $(window).scrollTop(pos + app.pageHeight);
            }
            if (pos > app.pageHeight*2 - $(window).outerHeight() - app.scrollOffset*4) {
                $(window).scrollTop(pos - app.pageHeight);
            }
        },
        isMobile: function() {
            return Modernizr.mq('(max-width:429px)');
        },
        isTablet: function() {
            return Modernizr.mq('(min-width:430px) and (max-width:959px)');
        },
        isDesktop: function() {
            return Modernizr.mq('(min-width:960px)');
        }
    }

    app.loop();
};

TEYEPE.init = function() {
    TEYEPE.scrollLoop();
    TEYEPE.blink();
};

$(function() {
    if (document.readyState !== 'loading') {
        TEYEPE.init();
    } else {
        document.addEventListener('DOMContentLoaded', TEYEPE.init, false);
    }
});
