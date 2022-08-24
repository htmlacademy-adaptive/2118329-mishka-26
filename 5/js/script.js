let header = document.querySelector('.main-header');
let navToggle = document.querySelector('.main-header__toggle');
let navigation = document.querySelector('.main-header__navigation');

header.classList.remove('main-header--no-js');

navToggle.addEventListener('click', function () {
  if (navigation.classList.contains('main-header__navigation--closed')) {
    navigation.classList.remove('main-header__navigation--closed');
    navigation.classList.add('main-header__navigation--open');
    navToggle.classList.remove('main-header__toggle--closed');
    navToggle.classList.add('main-header__toggle--open');
  } else {
    navigation.classList.remove('main-header__navigation--open');
    navigation.classList.add('main-header__navigation--closed');
    navToggle.classList.remove('main-header__toggle--open');
    navToggle.classList.add('main-header__toggle--closed');
  }
});
