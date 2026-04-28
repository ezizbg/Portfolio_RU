import '/src/style.scss';

/*------------------------------------------------------------------------------------------------------------------*/

// Меню бургер

const iconBurger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__top-menu');
if (iconBurger) {
  iconBurger.addEventListener('click', function (e) {
    iconBurger.classList.toggle('_x');
    menu.classList.toggle('_x');
    document.body.classList.toggle('_lock');
  });
}

/*------------------------------------------------------------------------------------------------------------------*/

// Кроссбраузерная плавная прокрутка по якорным ссылкам
const menuLinks = document.querySelectorAll(
  '.header__top-menu-link[data-goto], .header__bottom-scroll[data-goto]'
);

if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener('click', onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);

      const offset = 30;
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.pageYOffset - offset;

      if (iconBurger.classList.contains('_x')) {
        iconBurger.classList.remove('_x');
        menu.classList.remove('_x');
        document.body.classList.remove('_lock');
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth',
      });

      e.preventDefault();
    }
  }
}

// Полифилл для smooth-прокрутки в Safari
const originalScrollTo = window.scrollTo;
window.scrollTo = function (options) {
  if (options?.behavior === 'smooth') {
    const start = window.pageYOffset;
    const distance = options.top - start - 30;
    const duration = 400;
    let startTime = null;

    const animate = (time) => {
      startTime = startTime || time;
      const progress = Math.min((time - startTime) / duration, 1);
      originalScrollTo(0, start + distance * progress);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return;
  }
  originalScrollTo.apply(this, arguments);
};

/*------------------------------------------------------------------------------------------------------------------*/

// Анимация появления карточек портфолио

document.addEventListener('DOMContentLoaded', function () {
  const portfolioCards = document.querySelectorAll('.works__card');
  const showPortfolioCard = (card, index = 0) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 80);
  };

  if (!('IntersectionObserver' in window)) {
    portfolioCards.forEach(showPortfolioCard);
    return;
  }

  // Добавляем анимацию появления карточек с задержкой
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          showPortfolioCard(entry.target, index);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  portfolioCards.forEach((card) => {
    observer.observe(card);
  });
});

/*------------------------------------------------------------------------------------------------------------------*/

//Анимация при прокрутке

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
  const getScrollTop = () =>
    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  const getViewportHeight = () =>
    window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;

  const activateHeaderItems = () => {
    document.querySelectorAll('.header ._anim-items').forEach((animItem) => {
      animItem.classList.add('_active');
    });
  };

  function animOnScroll() {
    const scrollTop = getScrollTop();
    const viewportHeight = getViewportHeight();

    if (!viewportHeight) {
      activateHeaderItems();
      return;
    }

    for (let index = 0; index < animItems.length; index++) {
      const animItem = animItems[index];
      const animItemHeight = animItem.offsetHeight;
      const animItemOffset = offset(animItem).top;
      const animStart = 4;

      let animItemPoint = viewportHeight - animItemHeight / animStart;

      if (animItemHeight > viewportHeight) {
        animItemPoint = viewportHeight - viewportHeight / animStart;
      }

      if (
        scrollTop >= animItemOffset - animItemPoint &&
        scrollTop <= animItemOffset + animItemHeight
      ) {
        animItem.classList.add('_active');
      } else {
        if (!animItem.classList.contains('_anim-no-hide')) {
          animItem.classList.remove('_active');
        }
      }
    }
  }

  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  const requestAnimCheck = () => {
    requestAnimationFrame(animOnScroll);
  };

  activateHeaderItems();
  requestAnimCheck();
  window.addEventListener('scroll', requestAnimCheck, { passive: true });
  window.addEventListener('resize', requestAnimCheck);
  window.addEventListener('orientationchange', requestAnimCheck);
  window.addEventListener('load', requestAnimCheck);
  window.addEventListener('pageshow', requestAnimCheck);
  document.addEventListener('DOMContentLoaded', requestAnimCheck);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', requestAnimCheck);
    window.visualViewport.addEventListener('scroll', requestAnimCheck);
  }

  [150, 350, 800, 1400].forEach((delay) => {
    setTimeout(requestAnimCheck, delay);
  });
}

/*------------------------------------------------------------------------------------------------------------------*/
// Решение проблемы с анимацией печатающегося текста в Safari
document.addEventListener('DOMContentLoaded', function () {
  // Добавляем небольшую задержку перед началом анимации
  setTimeout(function () {
    const nameAnimation = document.querySelector('.name-animation');
    const jobAnimation = document.querySelector('.job-animation');

    if (nameAnimation && jobAnimation) {
      // Принудительно перезапускаем анимации
      nameAnimation.style.animation = 'none';
      jobAnimation.style.animation = 'none';

      // Небольшая задержка перед повторным применением анимации
      setTimeout(function () {
        nameAnimation.style.animation = '';
        jobAnimation.style.animation = '';
      }, 50);
    }
  }, 300); // Задержка в 300мс после загрузки DOM
});
/*------------------------------------------------------------------------------------------------------------------*/
