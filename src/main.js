
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import '@fortawesome/fontawesome-free/css/all.css'


import './style.css'

var City = 'cairo'
var DAY = 0;
const API_KEY = "48ef6540816a43269e0172236251111";
var weatherData = null;



// initail 
// getWeatherData() 

getFutureWeather()


// async function getWeatherData (city = "cairo"){

// const API = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`


//   var response = await fetch(API);
//   var result = await response.json()
//   console.log(result)
  

//   display(result)
//   backgroundCange(result.current.condition.text)
// }
var nextDayDiv = document.querySelector('div.next-days');




function next14dDay(forecastday){


  
  
  var width = nextDayDiv.getBoundingClientRect().width < 450 ? 450 :nextDayDiv.getBoundingClientRect().width;
  var height = nextDayDiv.getBoundingClientRect().height;

  


  var arrMax = ``;
  var arrMaxPoints = ``;
  var arrMAXdegree = ``;

  var arrMin = ``;
  var arrMinPoints = ``;
  var arrMindegree = ``;

  var arrdate = ``

  

 




  
   var firstMaxPoint = [ (1/15)*width , (height*0.7  - ( forecastday[0].day['maxtemp_c'] / 40)* height*0.4)];
   var firstMinPoint = [ (1/15)*width , (height*0.7  - ( forecastday[0].day['mintemp_c'] / 40)* height*0.4)];

  for (var i = 0 ; i < forecastday.length ;i++){
  
    var   x = ((i+1)/15)*width ;

    var  yMax  = (height*0.7  - ( forecastday[i].day['maxtemp_c'] / 40)* height*0.4)  ;
    var  yMin = (height*0.7  - ( forecastday[i].day['mintemp_c'] / 40)* height*0.4)  ;

  
    
  
    // max line
    arrMax+= `L${x} ${yMax}`
    arrMaxPoints +=`<circle  class="${DAY == i ? "active":""}"  stroke="#ffffffd8" cx="${x}" cy="${yMax}" r="4" />`
    arrMAXdegree += ` <text x="${x}" y="${yMax}" dx="0" dy="-10">${forecastday[i].day['maxtemp_c'] }ْ c</text>`;
    // min line

     arrMin+= `L${x} ${yMin}`
    arrMinPoints +=`<circle class="${DAY == i ? "active":""}"  stroke=" #ffffffd8" cx="${x}" cy="${yMin}" r="4" />`
    arrMindegree += ` <text x="${x}" y="${yMin}" dx="0" dy="17">${forecastday[i].day['mintemp_c'] }ْ c</text>`;

    // date
    arrdate += ` <text x="${x}" y="0" fill="#b6b6b6d8" dx="0" dy="${height-5}">${forecastday[i].date.match(/(?<=-)\d{1,2}-\d{1,2}/i)[0] }</text>`
    

  }

//   var str = `
//    <svg  class="" height="${height}" width="${width}" >
//   <path d=" M${ firstPoint[0]} ${ firstPoint[1]}  ${arrMax} "
//   style="fill:none;stroke: #b6b6b6d8;stroke-width:1" />

//    <g stroke="#b6b6b6d8" stroke-width="2" fill="#000000">
//     ${arrPoints}
//   </g>

//   <g font-size="10" font-family="sans-serif" fill="white" text-anchor="middle">
//     ${arrMAXdegree}
    
//   </g>
//   <g font-size="10" font-family="sans-serif" fill="white" text-anchor="middle">
//     ${arrdate}
    
//   </g>
// </svg> 
  
//   `

  // svgGraph.innerHTML = str

   var str2 = `
  
   
  <path d=" M${ firstMaxPoint[0]} ${ firstMaxPoint[1]}  ${arrMax} "
  style="fill:none;stroke: #b6b6b6d8;stroke-width:1" />

   <g class="maxtemp" stroke="#b6b6b6d8" stroke-width="2" fill="#000000">
    ${arrMaxPoints}
  </g>

  <g font-size="10" font-family="sans-serif" fill="white" text-anchor="middle">
    ${arrMAXdegree}
    
  </g>

   <path d=" M${ firstMinPoint[0]} ${ firstMinPoint[1]}  ${arrMin} "
  style="fill:none;stroke: #b6b6b6d8;stroke-width:1" />

   <g class="mintemp" stroke="#b6b6b6d8" stroke-width="2" fill="#000000">
    ${arrMinPoints}
  </g>

  <g font-size="10" font-family="sans-serif" fill="white" text-anchor="middle">
    ${arrMindegree}
    
  </g>
  <g font-size="10" font-family="sans-serif" fill="white" text-anchor="middle">
    ${arrdate}
    
  </g>
 
  
  `

  document.querySelector('svg').innerHTML = str2


  // coloring the today points

  var currentPointMax = document.querySelector('svg g.maxtemp circle.active')

  console.log(currentPointMax)
  currentPointMax.setAttribute('stroke','red');
  currentPointMax.setAttribute('r','6');
  currentPointMax.classList.add('active')

  var currentPointMin = document.querySelector('svg g.mintemp circle.active')

  console.log(currentPointMin)
  currentPointMin.setAttribute('stroke','red');
  currentPointMin.setAttribute('r','6');
  currentPointMin.classList.add('active')






  
}


function display(result){

  

  var todayForecast = result['forecast']['forecastday'].at(DAY)['day'];

  var date = new Date(`${ result['forecast']['forecastday'].at(DAY).date}`);
  

  document.getElementById('city').innerText = result['location'].name;

  document.getElementById('day').innerText = date.toLocaleDateString('en-US',{weekday:'long'});

  
  
  
  document.getElementById('date').innerText =`${date.getDate() }  ${date.toLocaleDateString('en-US',{month:'long'})}`;

 

  // overview about wearher over all day

  document.querySelector('div.avg-temp>p').innerHTML = `${todayForecast['maxtemp_c']}/${todayForecast['mintemp_c']}  C`;

  document.querySelector('div.avg-wind>p').innerHTML = `${todayForecast["maxwind_kph"]} kph`;

  document.querySelector('div.avg-humidity>p').innerHTML = `${todayForecast.avghumidity}%`;

  document.querySelector('div.avg-uv>p').innerHTML = `${todayForecast.uv}`;




  var condition = document.querySelector('div.condition');
  condition.querySelector('p').innerHTML = `${todayForecast['avgtemp_c']}ْ C`;
  condition.querySelector('img').src = `https:${todayForecast.condition.icon}`;

  condition.querySelector('span.text').innerHTML = `${todayForecast.condition.text}`
  

  
// display all data over the hours

createTimes(result.forecast.forecastday.at(DAY).hour,result.forecast.forecastday.at(DAY).astro)


}









function getFutureWeather(){

  var API = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${City}&days=${14}&aqi=no`


  var newPromes = new Promise((resolve,reject)=>{


    var request = new XMLHttpRequest();
    request.open('GET',API);
    request.send();

    request.addEventListener('load',(eve)=>{
      // console.log(request.response)
      resolve( JSON.parse(request.response) )
    })

    request.addEventListener('error',eve=>reject())


  })

  newPromes.then(result=>{
    weatherData = result;
    
    display(result);

   

    next14dDay(result['forecast']['forecastday'])
    

    
    
    
  
  })


}

window.addEventListener('resize',()=>{

    // display  predictions of the next 14 days
    next14dDay(weatherData['forecast']['forecastday'])
   
})


 document.querySelector('div.next-day-btn>i.fa-arrow-circle-right').addEventListener('click',(e)=>{
      DAY = ++DAY >=14 ? 0:DAY;
      display(weatherData);
      nextDayPoints()

    });
document.querySelector('div.next-day-btn>i.fa-arrow-circle-left').addEventListener('click',(e)=>{
      DAY = --DAY < 0 ? 13:DAY;
      display(weatherData);
      previoustDayPoints()

    });



function nextDayPoints(){

  var currentPointMax = document.querySelector('svg g.maxtemp circle.active');
  currentPointMax.setAttribute('stroke','white');
  currentPointMax.setAttribute('r','3');
  currentPointMax.classList.remove('active')

 

  
  // max temp
  if(currentPointMax.nextElementSibling != undefined){
   
      currentPointMax.nextElementSibling.setAttribute('stroke','red');
      currentPointMax.nextElementSibling.setAttribute('r','6');
      currentPointMax.nextElementSibling.classList.add('active')
  }else{

    var currentPointMax = document.querySelector('svg g.maxtemp circle:first-of-type')

    currentPointMax.setAttribute('stroke','red');
    currentPointMax.setAttribute('r','6');
    currentPointMax.classList.add('active')

  }


  // min temp
  var currentPointMin = document.querySelector('svg g.mintemp circle.active');
  currentPointMin.setAttribute('stroke','white');
  currentPointMin.setAttribute('r','3');
  currentPointMin.classList.remove('active')


  if(currentPointMin.nextElementSibling != undefined){
   
      currentPointMin.nextElementSibling.setAttribute('stroke','red');
      currentPointMin.nextElementSibling.setAttribute('r','6');
      currentPointMin.nextElementSibling.classList.add('active')
  }else{

    var currentPointMin = document.querySelector('svg g.mintemp circle:first-of-type')

    currentPointMin.setAttribute('stroke','red');
    currentPointMin.setAttribute('r','6');
    currentPointMin.classList.add('active')

  }

}


function previoustDayPoints(){

  var currentPointMax = document.querySelector('svg g.maxtemp circle.active');
  currentPointMax.setAttribute('stroke','white');
  currentPointMax.setAttribute('r','3');
  currentPointMax.classList.remove('active')

 

  
  // max temp
  if(currentPointMax.previousElementSibling != undefined){
   
      currentPointMax.previousElementSibling.setAttribute('stroke','red');
      currentPointMax.previousElementSibling.setAttribute('r','6');
      currentPointMax.previousElementSibling.classList.add('active')
  }else{

    var currentPointMax = document.querySelector('svg g.maxtemp circle:last-of-type')

    currentPointMax.setAttribute('stroke','red');
    currentPointMax.setAttribute('r','6');
    currentPointMax.classList.add('active')

  }


  // min temp
  var currentPointMin = document.querySelector('svg g.mintemp circle.active');
  currentPointMin.setAttribute('stroke','white');
  currentPointMin.setAttribute('r','3');
  currentPointMin.classList.remove('active')


  if(currentPointMin.previousElementSibling != undefined){
   
      currentPointMin.previousElementSibling.setAttribute('stroke','red');
      currentPointMin.previousElementSibling.setAttribute('r','6');
      currentPointMin.previousElementSibling.classList.add('active')
  }else{

    var currentPointMin = document.querySelector('svg g.mintemp circle:last-of-type')

    currentPointMin.setAttribute('stroke','red');
    currentPointMin.setAttribute('r','6');
    currentPointMin.classList.add('active')

  }


}
// getFutureWeather(2)


function createRotary(){

  var rotary = document.querySelector('.rotary')

  var str = '';

  for(var i = 0 ; i< 24 ;i++){

    var rotationZ= ((i+6.5)/24)*360 ;

    var time = document.createElement('div');
    time.setAttribute('time',i)
    time.classList.add('time');
    time.style.transform = `rotateZ(${rotationZ}deg) translateX(170px)`

    var innerTime = document.createElement('div');
    
    time.append(innerTime)



    var divIamge= document.createElement('div');
    divIamge.classList.add('img')
    divIamge.style.transform = `rotateZ(-${rotationZ}deg)`
    divIamge.innerHTML = `<img src="https:${allDayData.hour[i].condition.icon}" alt="" />`

    var pTemp = document.createElement('p')
    pTemp.style.transform = `rotateZ(-${rotationZ}deg)`
    pTemp.innerHTML = `${allDayData.hour[i].temp_c}ْ`;

    var pClock = document.createElement('p');
    pClock.style.transform = `rotateZ(-${rotationZ}deg)`
    pClock.innerHTML = `${i%12 == 0 ? 12 : i%12}  `

    innerTime.append(pClock,pTemp,divIamge)

    

    
    // innerTime.innerHTML= `
  
    //           <div class="img">
    //             <img src="https:${allDayData.hour[i].condition.icon}" alt="" />
    //           </div>
              
    //           <p>${allDayData.hour[i].temp_c}ْC</p>
    //           <p>${i} </p>
    // `

  rotary.append(time)

 


}
}
// createRotary()


function createTimes(allHoursData,astro){



  var times = document.querySelector('.times')
  times.innerHTML = `
     <span class="position-absolute top-0 start-0 mt-1 ms-2 small-info "
              >day predictions</span
    `

  console.log(astro)
  var sunrise = +astro.sunrise.match(/^\d{2}(?=:)/i)[0];
  var sunset = +astro.sunset.match(/^\d{2}(?=:)/i)[0]+12;
  console.log(+sunrise)

  

  
  for(var i = 0 ; i< 24 ;i++){

  

   

    var time = document.createElement('div');
    time.setAttribute('time',i)
    time.classList.add('time');

  
    console.log(sunrise,sunset)
   
    // sunrise
    if(i< sunrise ){
       time.style.background = 'var(--bg-color-transparent)'
    }else if(i == sunrise){
      time.setAttribute('sun',`sunrise  ${astro.sunrise}`)
      time.classList.add('sun-change','position-relative')
      time.style.background = `linear-gradient(90deg,var(--bg-color-transparent)  ,var(--bg-color-transparent-white) )`

    }else if(sunrise < i && i < sunset){
       time.style.background = 'var(--bg-color-transparent-white)'


    }else if(i == sunset) {
      time.setAttribute('sun',`sunset  ${astro.sunset}`)
      time.classList.add('sun-change','position-relative')
       time.style.background = `linear-gradient(90deg,var(--bg-color-transparent-white)  ,var(--bg-color-transparent) )`

    }else{
       time.style.background = 'var(--bg-color-transparent)'


    }
   


   



    var divIamge= document.createElement('div');
    divIamge.classList.add('img')
    divIamge.innerHTML = `<img src="https:${allHoursData[i].condition.icon}" alt="" />`

    var pTemp = document.createElement('p')
    pTemp.innerHTML = `${allHoursData[i].temp_c}ْ`;

    var pClock = document.createElement('p');
    pClock.innerHTML = `${i%12 == 0 ? 12 : i%12}${i< 12 ? 'am':'pm'} `

    time.append(pClock,divIamge,pTemp)

    

    
   

  times.append(time)

 


}

}








// search ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var searchInput  = document.getElementById('search');
var ulList = document.getElementById('listData')

searchInput.addEventListener('input',function(eve){
  console.log(eve.target.value)

  if(/ +/.test(eve.target.value) || eve.target.value.length == 0){
    console.log('there is a spces')
    ulList.innerHTML = ""
  }else{
    searchCity(eve.target.value)
  }
  
})

function searchCity(q){
  var request = new XMLHttpRequest();
  request.open('GET',`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${q}&aqi=no`)
  request.send();

  request.addEventListener('readystatechange',(eve)=>{
    if(request.readyState == 4){
      var result = JSON.parse(request.response) 
      console.log(result)

      
      var str = ``

      for(var i = 0 ; i <result.length ; i++ ){

        str+=`
        <li> ${result[i].name} </li>`

      }
      ulList.innerHTML = str
    }
  })
}

ulList.addEventListener('click',function(eve){

  console.log(eve.target.innerText);
  City = eve.target.innerText
  getFutureWeather()
  
  ulList.innerHTML = ""
  searchInput.value = ""
})

// -----------