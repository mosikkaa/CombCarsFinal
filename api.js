async function getData(){
    const response = await fetch('http://localhost:3000/api-back');
    const data = await response.json();

    console.log(data);
}

getData();


  
async function DisplayPosts() {
     const response = await fetch('http://localhost:3000/api-back');
     const data = await response.json()
     console.log(data)
     if (data.length > 0) {
      const normalContainer = document.getElementById('posteditemscont');
      const template = document.getElementById('car-template');
      const vipcont = document.getElementById('vipposted')
      const viplimiteddata = data.slice(0,20);
      const limitedData = data.reverse().slice(0, 5);
      console.log(limitedData);

      for(i=0;i<viplimiteddata.length;i++){
        
        const clone = template.cloneNode(true);
        clone.style.display = 'block'; 
        clone.removeAttribute('id');   


        const imgEl = clone.querySelector('.imageof');
        if(!viplimiteddata[i].image){
          imgEl.src = await getImage((`${viplimiteddata[i].manufacturer} ${viplimiteddata[i].model}`));
        }
        else{
          imgEl.src = viplimiteddata[i].image;
        }

        


        clone.querySelector('.swipelocation').textContent = viplimiteddata[i].location;
        clone.querySelector('.yearof').textContent = viplimiteddata[i].year + " - ";
        clone.querySelector('.manufacturerof').textContent = viplimiteddata[i].manufacturer;
        clone.querySelector('.modelof').textContent = viplimiteddata[i].model;
        clone.querySelector('.priceof').textContent = viplimiteddata[i].price + ' ₾';
        clone.querySelector('.fuelof').textContent = viplimiteddata[i].fuel_type;


          vipcont.appendChild(clone);
      };


      for(i=0;i<limitedData.length;i++){
        
        const clone = template.cloneNode(true);
        clone.style.display = 'block'; 
        clone.removeAttribute('id');   


        const imgEl = clone.querySelector('.imageof');
        if(!limitedData[i].image){
          imgEl.src = await getImage((`${limitedData[i].manufacturer} ${limitedData[i].model}`));
        }
        else{
          imgEl.src = limitedData[i].image;
        }

        


        clone.querySelector('.swipelocation').textContent = limitedData[i].location;
        clone.querySelector('.yearof').textContent = limitedData[i].year + " - ";
        clone.querySelector('.manufacturerof').textContent = limitedData[i].manufacturer;
        clone.querySelector('.modelof').textContent = limitedData[i].model;
        clone.querySelector('.priceof').textContent = limitedData[i].price + ' ₾';
        clone.querySelector('.fuelof').textContent = limitedData[i].fuel_type;


          normalContainer.appendChild(clone);
      };
    } 
}

DisplayPosts()


  async function getImage(input){
        const API = 'fiP1mN4FrJjVLOFXsY17ZXotZrlqMBR-5SVrII3khI4';
        const carResponse = await fetch(`https:api.unsplash.com/search/photos?page=1&query=${input}&client_id=${API}`);
        const carImageData = await carResponse.json();
        const carImage = carImageData.results[0].urls.small;
        return carImage;
      }


  




