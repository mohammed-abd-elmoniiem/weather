
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import '@fortawesome/fontawesome-free/css/all.css'


import './style.css'

var City = 'cairo'
const API_KEY = "48ef6540816a43269e0172236251111";



// initail 
// getWeatherData() 

getFutureWeather(1)


async function getWeatherData (city = "cairo"){

const API = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`


  var response = await fetch(API);
  var result = await response.json()
  console.log(result)
  

  display(result)
  backgroundCange(result.current.condition.text)
}



function display(result){

  

  var todayForecast = result['forecast']['forecastday'][0]['day'];

  var date = new Date(result['location']['localtime']);

  document.getElementById('city').innerText = result['location'].name;

  document.getElementById('day').innerText = date.toLocaleDateString('en-US',{weekday:'long'});

  
  
  
  document.getElementById('date').innerText =`${date.getDate() }  ${date.toLocaleDateString('en-US',{month:'long'})}`;

  // remove 
  document.querySelectorAll('div.remove').forEach(ele=>ele.remove())

  // overview about wearher over all day

  createWeatherInfo('uv index',`${todayForecast["uv"]} `,'fa-solid fa-radiation')


   createWeatherInfo('humidity',`${todayForecast.avghumidity}%`,"fa-solid fa-droplet" );

   createWeatherInfo('wind',`${todayForecast["maxwind_kph"]} kph`,'fa-solid fa-wind')

// temperature info
  createWeatherInfo('temperature', `${todayForecast['maxtemp_c']}/${todayForecast['mintemp_c']}  ْ  C`  ,'fa-solid fa-sun',true);


  var condition = document.querySelector('div.condition');
  

  condition.innerHTML =`
            <span class="position-absolute top-0 start-0 ms-4 display-6">now</span>
            <p>${result['current']['temp_c']}ْ C</p>
            <div class="image">
              <img src="https:${result['current'].condition.icon}" alt="">

              <span>${result['current'].condition.text}</span>
            </div>
            
  
  `



  

 

 

  
// display all data over the hours

createTimes(result.forecast.forecastday[0].hour,result.forecast.forecastday[0].astro)
 

 

 


}

function createWeatherInfo(name,value,icon){
  var div = document.createElement('div');
  div.classList.add('info','remove')

  div.innerHTML = `
            <div class="">
              <i class="${icon}"></i>
              <span>${name}</span>
            </div>

            <p >${value}</p>
  `
  document.querySelector('div.condition').after(div);
}









function getFutureWeather(day){

  var API = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${City}&days=${day}&aqi=no`


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

  newPromes.then(respone=>{
    console.log(respone)
    display(respone)
    
    
  
  })


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
  times.innerHTML = ""

  console.log(astro)
  var sunrise = +astro.sunrise.match(/^\d{2}(?=:)/i)[0];
  var sunset = +astro.sunset.match(/^\d{2}(?=:)/i)[0]+12;
  console.log(+sunrise)

  

  
  for(var i = 0 ; i< 24 ;i++){

    // var rotationZ= ((i+6.5)/24)*360 ;
  

   

    var time = document.createElement('div');
    time.setAttribute('time',i)
    time.classList.add('time');

    // if(new Date().getHours() == i){
    //   time.classList.add('active')
    // }

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
    // divIamge.style.transform = `rotateZ(-${rotationZ}deg)`
    divIamge.innerHTML = `<img src="https:${allHoursData[i].condition.icon}" alt="" />`

    var pTemp = document.createElement('p')
    // pTemp.style.transform = `rotateZ(-${rotationZ}deg)`
    pTemp.innerHTML = `${allHoursData[i].temp_c}ْ`;

    var pClock = document.createElement('p');
    // pClock.style.transform = `rotateZ(-${rotationZ}deg)`
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
      console.log(result
      )

      

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
  getFutureWeather(2)
  
  ulList.innerHTML = ""
  searchInput.value = ""
})

// -----------