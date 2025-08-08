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


async function addData(car) {
  const response = await fetch('http://localhost:3000/api-back-user', {  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(car)
  });
  const result = await response.json();
  console.log('added', result);
}

async function addPhoto(formData) {
  const response = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log('Uploaded:', result);
  return result.path; 
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-post').addEventListener('click', async (e) => {
    e.preventDefault();

    const form = document.getElementById('car-form');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const carmanu = document.getElementById('manufacturer').value;
    const carmodel = document.getElementById('model').value;
    const caryear = document.getElementById('year').value;
    const carfuel = document.getElementById('fuel').value;
    const carlocation = document.getElementById('location').value;
    const carprice = document.getElementById('price').value;
    const carphoto = document.getElementById('photo');
    const file = carphoto.files[0];

    const formData = new FormData();
    formData.append('carphoto', file);

    try {
      const imagePath = await addPhoto(formData);

      const car1 = {
        manufacturer: carmanu,
        model: carmodel,
        year: caryear,
        price: carprice,
        fuel_type: carfuel,
        location: carlocation,
        image: imagePath,
      };

      await addData(car1); 
      alert('Post added successfully!');
    } catch (error) {
      alert('Failed to add post.');
      console.error(error);
    }
  });
});










