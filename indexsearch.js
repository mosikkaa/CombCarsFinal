let wholeData = [];

function getFilters(){
  const filterArr = ['manufacturer','price','year','fuel_type'];
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
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#search-btn').addEventListener('click', () => {
    const filters = getFilters();
    localStorage.setItem('filters', JSON.stringify(filters));
    window.location.href = 'list.html';
  });
});

