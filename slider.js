
/*--------------------------------------------------
  07. Main sliders
---------------------------------------------------*/

function mainSlider1Init() {

  const slider = document.querySelector('.js-sliderMain-type-1');

  if (!slider) return;

  const nav = slider.querySelector('.js-slider-nav');
  let current = 0;

  const sliderInstance = new Swiper (slider, {
    spaceBetween: 0,
    speed: 1000,
    parallax: true,
    grabCursor: true,
    allowTouchMove: true,
    touchMoveStopPropagation: true,

    lazy: {
      loadPrevNext: true,
    },

    breakpoints: {
      575: {
        parallax: false,
      },
    },
  
    navigation: {
      prevEl: nav.querySelector('.js-prev'),
      nextEl: nav.querySelector('.js-next'),
    },
  });

}


function mainSlider2Init() {

  const slider = document.querySelector('.js-sliderMain-type-2');

  if (!slider) return;

  const sliderInstance = new Swiper (slider, {
    spaceBetween: 0,
    speed: 600,
    parallax: true,
    
    loop: true,
    slidesPerView: 3,
    centeredSlides: true,

    lazy: {
      loadPrevNext: true,
    },

    breakpoints: {
      991: {
        slidesPerView: 1,
      },
    },

    pagination: {
      el: '.js-pagination',
      bulletClass: 'pagination__item',
      bulletActiveClass: 'is-active',
      clickable: true
    },

    navigation: {
      prevEl: '.js-nav-prev',
      nextEl: '.js-nav-next',
    },
  });


  const images = slider.querySelectorAll('.js-slider-img');

  let nextImg;
  let prevImg = images[sliderInstance.realIndex];

  sliderInstance.on('transitionStart', function () {
    nextImg = images[sliderInstance.realIndex];

    prevImg.classList.remove('is-active');
    nextImg.classList.add('is-active');

    prevImg = images[sliderInstance.realIndex];
  });

  sliderInstance.on('loopFix', function () {
    if (App.config.cursorFollower.enabled) {
      Cursor.update();
    }
  });

}


const MainSlider3 = (function() {

  let state = false;
  let sliderInstance;
  let current;

  function init() {

    const slider = document.querySelector('.js-sliderMain-type-3');
    if (!slider) return;

    state = true;

    const container = slider.querySelector('.swiper-container');
    const contents = slider.querySelectorAll('.js-slider-content');
    const nav = slider.querySelector('.js-slider-nav');
    const pagination = slider.querySelector('.js-slider-pagination');
    current = 0;

    let sliderSpeed = 1000;
    if (slider.getAttribute('data-speed')) sliderSpeed = slider.getAttribute('data-speed');

    let sliderAutoplay = false;
    if (slider.getAttribute('data-autoplay-delay')) {
      sliderAutoplay = {
        delay: slider.getAttribute('data-autoplay-delay'),
        disableOnInteraction: false,
      };
    }

    let sliderAutoplayStartDelay = 0;
    if (slider.getAttribute('data-autoplay-start-delay')) {
      sliderAutoplayStartDelay = slider.getAttribute('data-autoplay-start-delay');
    }


    sliderInstance = new Swiper (container, {
      spaceBetween: 0,
      speed: parseInt(sliderSpeed),
      parallax: true,
      // direction: 'vertical',
      allowTouchMove: false,
      lazy: {
        loadPrevNext: true,
      },
      autoplay: sliderAutoplay,
      navigation: {
        prevEl: nav.querySelector('.js-prev'),
        nextEl: nav.querySelector('.js-next'),
      },
      pagination: {
        el: pagination,
        bulletClass: 'pagination__item',
        bulletActiveClass: 'is-active',
        clickable: true
      },
    });


    gsap.set(slider.querySelectorAll('.js-button'), {
      y: '100%',
    })

    nav.classList.add('is-active');

    sliderInstance.autoplay.stop();

    // setTimeout(() => {
    //   sliderInstance.autoplay.start();
    // }, sliderAutoplayStartDelay);


    sliderInstance.on('transitionStart', function() {
      const currentContent = contents[current];
      const activeContent = contents[sliderInstance.realIndex];

      nav.classList.remove('is-active');

      gsap.timeline()
        .to([
          currentContent.querySelectorAll('.js-subtitle .split__line'),
          currentContent.querySelectorAll('.js-title .split__line'),
          currentContent.querySelector('.js-button'),
        ], {
          y: '-100%',
          stagger: 0.06,
          duration: 0.6,
          ease: 'quart.inOut',
          onStart: () => {
            current = sliderInstance.realIndex;
            currentContent.classList.remove('is-active');
          }
        })
        .fromTo([
          activeContent.querySelectorAll('.js-subtitle .split__line'),
          activeContent.querySelectorAll('.js-title .split__line'),
          activeContent.querySelector('.js-button'),
        ], {
          y: '100%',
        }, {
          y: '0%',
          stagger: -0.06,
          duration: 0.6,
          ease: 'quart.inOut',
          onStart: () => {
            activeContent.classList.add('is-active');
          },
          onComplete: () => {
            nav.classList.add('is-active');
          },
        }, '>-0.2')
    });

  }

  function autoplayStart() {
    if (!state) return;
    sliderInstance.autoplay.start();
  }

  function autoplayStop() {
    if (!state) return;
    sliderInstance.autoplay.stop();
  }

  function isActive() {
    return state;
  }

  return {
    init: init,
    autoplayStart: autoplayStart,
    autoplayStop: autoplayStop,
    isActive: isActive,
  };

})();
/*--------------------------------------------------
  08. Section sliders
---------------------------------------------------*/

function sectionSlidersInit() {

  const sectionSlider = document.querySelectorAll('.js-section-slider');

  if (!sectionSlider.length) return;

  for (let i = 0; i < sectionSlider.length; i++) {
    const el = sectionSlider[i];
    
    let gap = 0;
    let loop = false;
    let centered = false;
    let pagination = false;

    if (el.getAttribute('data-gap'))    gap = el.getAttribute('data-gap');
    if (el.hasAttribute('data-loop'))   loop = true;
    if (el.hasAttribute('data-center')) centered = true;

    if (el.hasAttribute('data-pagination')) {
      pagination = {
        el: el.querySelector('.js-pagination'),
        bulletClass: 'pagination__item',
        bulletActiveClass: 'is-active',
        bulletElement: 'div',
        clickable: true
      };
    }


    const colsArray = el.getAttribute('data-slider-col').split(' ');

    let cols_base = 1;
    let cols_lg = 1;
    let cols_md = 1;
    let cols_sm = 1;

    colsArray.forEach(el => {
      if (el.includes('base')) cols_base = el.slice(-1);
      if (el.includes('lg')) cols_lg = el.slice(-1);
      if (el.includes('md')) cols_md = el.slice(-1);
      if (el.includes('sm')) cols_sm = el.slice(-1);
    });

    new Swiper(el, {
      speed: 800,
      autoHeight: true,
      spaceBetween: parseInt(gap),
      centeredSlides: centered,
      parallax: true,

      loop: loop,
      
      lazy: {
        loadPrevNext: true,
      },

      slidesPerView: parseInt(cols_base),

      breakpoints: {
        1199: { slidesPerView: parseInt(cols_lg) },
        991:  { slidesPerView: parseInt(cols_md) },
        767:  { slidesPerView: parseInt(cols_sm) },
      },

      navigation: {
        prevEl: el.querySelector('.js-prev'),
        nextEl: el.querySelector('.js-next'),
      },

      pagination: pagination,
    });
  }

}

/*--------------------------------------------------*/