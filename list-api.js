const listPageNumbers = document.getElementsByClassName('page-number');
const first = document.getElementById('first-chevron');
const prev = document.getElementById('prev-chevron');
const next = document.getElementById('next-chevron');
const last = document.getElementById('last-chevron');

function getPageNumber(){
    let selected = Array.from(listPageNumbers).find(listPage => 
        listPage.classList.contains('active')
    );

    if (selected.textContent > 1) {
        first.style.display = 'block';
        prev.style.display = 'block';
    } else {
        first.style.display = 'none';
        prev.style.display = 'none';
    }

    if (selected.textContent < 5) {
        next.style.display = 'block';
        last.style.display = 'block';
    } else {
        next.style.display = 'none';
        last.style.display = 'none';
    }
    return Number(selected.textContent)
}

function goNext(){
    let currPage = getPageNumber();
    if(currPage <= 4){
        Array.from(pageNumbers).forEach(pageNumber => {
            pageNumber.classList.remove('active');
        });
        listPageNumbers[currPage].classList.add('active');
        DisplayPosts(currPage + 1);
        getPageNumber();
    }
}

function goPrev(){
    let currPage = getPageNumber();
    if(currPage > 1){
        Array.from(pageNumbers).forEach(pageNumber => {
            pageNumber.classList.remove('active');
        });
        listPageNumbers[currPage - 2].classList.add('active');
        DisplayPosts(currPage - 1);
        getPageNumber();
    }
}

function goFirst(){
    Array.from(pageNumbers).forEach(pageNumber => {
        pageNumber.classList.remove('active');
    })
    listPageNumbers[0].classList.add('active');
    DisplayPosts(1);
    getPageNumber();
}

function goLast(){
    Array.from(pageNumbers).forEach(pageNumber => {
        pageNumber.classList.remove('active');
    })
    listPageNumbers[4].classList.add('active');
    DisplayPosts(5);
    getPageNumber();
}

last.addEventListener('click', goLast);
first.addEventListener('click', goFirst);
prev.addEventListener('click', goPrev);
next.addEventListener('click', goNext);

let fetchForPage = getPageNumber();

async function getCorrectImage(carData) {
    if (carData.image && carData.image.trim() !== '') {
        if (carData.image.startsWith('http')) {
            return carData.image;
        } else {
            return `http://localhost:3000${carData.image}`;
        }
    }
    
    try {
        const API = 'fiP1mN4FrJjVLOFXsY17ZXotZrlqMBR-5SVrII3khI4';
        const carResponse = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${carData.manufacturer} ${carData.model}&client_id=${API}`);
        const carImageData = await carResponse.json();
        
        if (carImageData.results && carImageData.results.length > 0) {
            return carImageData.results[0].urls.small;
        }
    } catch (error) {
        console.error('Error fetching fallback image:', error);
    }
    
    return 'https://via.placeholder.com/300x200?text=No+Image';
}

async function DisplayPosts(page) {
    const response = await fetch('http://localhost:3000/api-back');
    const data = await response.json()
    console.log(data)
    
    if (data.length > 0) {
        const container = document.querySelector('.posteditemscontainer');
        const template = document.getElementById('car-template');
        const reversedData = [...data].reverse();
        const limitedData = page == 1 ? reversedData.slice(0, page*20) : reversedData.slice((page-1)*20, page*20);
        const savedTemplate = template.cloneNode(true);
        
        container.innerHTML = '';
        container.appendChild(savedTemplate);

        for(i=0; i<limitedData.length; i++){
            const clone = savedTemplate.cloneNode(true);
            clone.style.display = 'block'; 
            clone.removeAttribute('id');   

            const imageElement = clone.querySelector('.imageof');
            imageElement.src = await getCorrectImage(limitedData[i]);
            
            imageElement.onerror = function() {
                this.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            };

            clone.querySelector('.swipelocation').textContent = limitedData[i].location;
            clone.querySelector('.yearof').textContent = limitedData[i].year + " - ";
            clone.querySelector('.manufacturerof').textContent = limitedData[i].manufacturer;
            clone.querySelector('.modelof').textContent = limitedData[i].model;
            clone.querySelector('.priceof').textContent = limitedData[i].price + ' ₾';
            clone.querySelector('.fuelof').textContent = limitedData[i].fuel_type;

            container.appendChild(clone);
        }
    } 
}

DisplayPosts(fetchForPage)


async function getImage(input){
    const API = 'fiP1mN4FrJjVLOFXsY17ZXotZrlqMBR-5SVrII3khI4';
    const carResponse = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${input}&client_id=${API}`);
    const carImageData = await carResponse.json();
    const carImage = carImageData.results[0].urls.small;
    return carImage;
}

Array.from(listPageNumbers).forEach(listPage => {
    listPage.addEventListener('click', () => {
        let page = getPageNumber();
        DisplayPosts(page);
    })
})

let wholeData = [];

function getFilters(){
    const filterArr = ['manufacturer','location','price','year','fuel_type'];
    const filters = {};

    filterArr.forEach(f =>{
        const selected = document.querySelector(`input[name=${f}]:checked`);
        filters[f] = selected ? selected.value : 'all';
    });

    const priceInput = document.querySelectorAll('#select-price input[type="number"]');
    const [priceFrom, priceTo] = [...priceInput].map(input => input.value);
    filters.pricefrom = priceFrom ? Number(priceFrom) : null;
    filters.priceTo = priceTo ? Number(priceTo) : null;

    const yearInput = document.querySelectorAll('#select-year input[type="number"]');
    const [yearFrom, yearTo] = [...yearInput].map(input => input.value);
    filters.yearFrom = yearFrom ? Number(yearFrom) : null;
    filters.yearTo = yearTo ? Number(yearTo) : null;

    return filters;
}

function filterData(data,filters){
    return data.filter(car => {
        const oneLvlFiltersPassed = ['manufacturer', 'location','price', 'year', 'fuel_type'].every(oneLvlFilter => {
            return filters[oneLvlFilter] === 'all' || 
                   String(car[oneLvlFilter]).toLowerCase() === String(filters[oneLvlFilter]).toLowerCase();
        });

        const priceFilter = (!filters.priceFrom || car.price >= filters.priceFrom) &&
                            (!filters.priceTo || car.price <= filters.priceTo);

        const yearFilter = (!filters.yearFrom || car.year >= filters.yearFrom) &&
                            (!filters.yearTo || car.year <= filters.yearTo);
                        
        return oneLvlFiltersPassed && priceFilter && yearFilter;
    });
}

async function display(filtered){
    let page = getPageNumber();
    const container = document.querySelector('.posteditemscontainer');
    const template = document.getElementById('car-template');

    const reversedFiltered = [...filtered].reverse();
    const limitedData = page == 1 ? reversedFiltered.slice(0, page*20) : reversedFiltered.slice((page-1)*20, page*20);
    const savedTemplate = template.cloneNode(true);
    
    container.innerHTML = '';
    container.appendChild(savedTemplate);

    for(i=0; i<limitedData.length; i++){
        const clone = savedTemplate.cloneNode(true);
        clone.style.display = 'block'; 
        clone.removeAttribute('id');   

        const imageElement = clone.querySelector('.imageof');
        imageElement.src = await getCorrectImage(limitedData[i]);
        
        imageElement.onerror = function() {
            this.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        };

        clone.querySelector('.swipelocation').textContent = limitedData[i].location;
        clone.querySelector('.yearof').textContent = limitedData[i].year + " - ";
        clone.querySelector('.manufacturerof').textContent = limitedData[i].manufacturer;
        clone.querySelector('.modelof').textContent = limitedData[i].model;
        clone.querySelector('.priceof').textContent = limitedData[i].price + ' ₾';
        clone.querySelector('.fuelof').textContent = limitedData[i].fuel_type;

        container.appendChild(clone);
    }
}

async function fetchData(){
    const response = await fetch('http://localhost:3000/api-back');
    const data = await response.json();
    return data;
}

async function filterAll(){
    const filters = getFilters();
    console.log(filters)
    data = await fetchData();
    const filtered = filterData(data,filters);
    console.log(filtered);
    display(filtered);
}

document.querySelector('#search-btn').addEventListener('click',filterAll);

const searchInput = document.getElementById('main-search');

/* gasworeba - pagination management backshi jer;search-ic gavides backshi,da mere moxdes gafiltvra da searchis wamogheba;id-ebi */

searchInput.addEventListener('input', async (e) => {
    const response = await fetch('http://localhost:3000/api-back');
    const wholeData = await response.json();
    const searchValue = e.target.value;
    const mainFiltered = wholeData.filter(car => {
        return (
            car.manufacturer.toLowerCase().includes(searchValue) ||
            car.model.toLowerCase().includes(searchValue) ||
            String(car.year).includes(searchValue) ||
            String(car.price).includes(searchValue) ||
            car.fuel_type.toLowerCase().includes(searchValue) ||
            car.location.toLowerCase().includes(searchValue)
        );
    });
    
    if(!mainFiltered){
        display(wholeData);
    }
    else{
        console.log(mainFiltered);
        display(mainFiltered);
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const filters = JSON.parse(localStorage.getItem('filters'));
    console.log('Loaded filters from localStorage:', filters);
    const data = await fetchData();
    console.log('Fetched data:', data);

    if (filters) {
        const filtered = filterData(data, filters);
        console.log('Filtered result:', filtered);
        display(filtered);
    } else {
        display(data);
    }
});