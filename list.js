let car = document.getElementById('car');
let moto = document.getElementById('moto');
let manufacturer = document.querySelector('.select')
const selection = document.getElementsByClassName('selection')
const motoMessage = document.getElementById('moto-message')


moto.addEventListener('click', () => {
    car.style.color = 'black';
    moto.style.color = 'orange';

    selection[0].style.display = 'none'
    motoMessage.style.display = 'block'
    motoMessage.style.display = 'flex'
})
car.addEventListener('click', () => {
    moto.style.color = 'black';
    car.style.color = 'orange';

    motoMessage.style.display = 'none'
    selection[0].style.display = 'block'
    selection[0].style.display = 'grid'
})



document.addEventListener('click', function(event) {
    let selected = event.target.closest('.select');

    document.querySelectorAll('.select').forEach(s => {
        if (s !== selected) s.classList.remove('active');
    });
    document.querySelectorAll('.arrow').forEach(arrow => {
        if (!selected  || !selected.contains(arrow)) arrow.classList.remove('rotate');
    });
    document.querySelectorAll('.select p').forEach(p => {
        if (!selected || !selected.contains(p)) p.classList.remove('textTransform');
    });

    if (!selected) return;

    const isActive = selected.classList.contains('active');
    selected.classList.toggle('active', !isActive);

    const arrow = selected.querySelector('.arrow');
    if (arrow) arrow.classList.toggle('rotate', !isActive);

    const text = selected.querySelector('p');
    if (text) text.classList.toggle('textTransform', !isActive);
});


const languageBtn = document.getElementById('choose-language');
const chooseLanguage = document.querySelector('.chooselanguage');
const arrowdown = document.querySelector('.downarrow')

languageBtn.addEventListener('click', () =>{
    const isActive = chooseLanguage.classList.contains('langactive');

    chooseLanguage.classList.toggle('langactive', !isActive);
    arrowdown.classList.toggle('rotate',!isActive)
    languageBtn.classList.toggle('afterclick',!isActive)
})

document.addEventListener('click', (e) => {

  if (!languageBtn.contains(e.target) && !chooseLanguage.contains(e.target)) {
    chooseLanguage.classList.remove('langactive');
    arrowdown.classList.remove('rotate')
    languageBtn.classList.remove('afterclick')
  }
});

 document.getElementById('add-car').addEventListener('click', () => {
    window.location.href = 'add.html';
  });


  function giveActive(e) {
  let pageNumbers = document.getElementsByClassName('page-number');
  Array.from(pageNumbers).forEach(pageNumber => {
    pageNumber.classList.remove('active');
  });
  e.currentTarget.classList.add('active');
}

let pageNumbers = document.querySelectorAll('.page-number');
pageNumbers.forEach(page => {
  page.addEventListener('click', giveActive);
});



const modal = document.getElementById('carModal');
const closeBtn = document.querySelector('.close');
const mainImage = document.getElementById('mainImage');
const thumbsContainer = document.getElementById('thumbs');
const modalTitle = document.getElementById('modalTitle');
const modalYear = document.getElementById('modalYear');
const modalFuel = document.getElementById('modalFuel');
const modalPrice = document.getElementById('modalPrice');
const modalLocation = document.getElementById('modalLocation');
document.addEventListener('click', function (e) {
  const swipeCard = e.target.closest('.swipe');
  if(!swipeCard) return;


  const imageSrc = swipeCard.querySelector('.imageof').src;
  const manufacturer = swipeCard.querySelector('.manufacturerof').textContent;
  const model = swipeCard.querySelector('.modelof').textContent;
  const year = swipeCard.querySelector('.yearof').textContent;
  const fuel = swipeCard.querySelector('.fuelof').textContent;
  const price = swipeCard.querySelector('.priceof').textContent;
  const location = swipeCard.querySelector('.swipelocation').textContent;

  const otherImages = [imageSrc];
  let deg = 1;

  mainImage.src = imageSrc;
  modalTitle.textContent = `${manufacturer} ${model}`;
  modalYear.textContent = year;
  modalFuel.textContent = fuel;
  modalPrice.textContent = price;
  modalLocation.textContent = location;

  thumbsContainer.innerHTML = '';
  const thumb = document.createElement('img');
  thumb.src = imageSrc;
  thumb.addEventListener('click', () => {
      mainImage.src = thumb.src;
    });
  thumbsContainer.appendChild(thumb);
  otherImages.forEach(img => {
    deg += 90;
    const thumb = document.createElement('img');
    thumb.src = 'https://mediapool.bmwgroup.com/cache/P9/201805/P90304842/P90304842-the-new-bmw-m3-cs-05-2018-2250px.jpg';
    thumb.addEventListener('click', () => {
      mainImage.src = 'https://mediapool.bmwgroup.com/cache/P9/201805/P90304842/P90304842-the-new-bmw-m3-cs-05-2018-2250px.jpg';
    });
    thumbsContainer.appendChild(thumb);
  });

  modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});



