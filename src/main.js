
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import '@fortawesome/fontawesome-free/css/all.css'


import './style.css'
import gsap from 'gsap';

var City = 'cairo'                                 // default city
var DAY = 0;                                       //current day index.
const API_KEY = "48ef6540816a43269e0172236251111";
var weatherData = null;                            // globl variable contain all data of the city



// initail 

// get weather data of the default city(cairo) and display it
getWeatherData() 



// fetch weather data++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function getWeatherData(){

  var API = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${City}&days=${7}&aqi=no`; // limiting data to 7 days only.


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
    weatherData = result; //assign to global variable.
    display(result);         //display the data of the current day.
    next14dDay(result['forecast']['forecastday']); //draaw svg graph .
  
  })


}

// ------------------------------------------------------- end of fetching data


// search ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var searchInput  = document.getElementById('search');
var ulList = document.getElementById('cities-list'); // ul will diplay available city with charcters that were entered

searchInput.addEventListener('input',function(eve){
  

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

      var result = JSON.parse(request.response);
     
      var str = ``

      for(var i = 0 ; i <result.length ; i++ ){

        str+=`
        <li> ${result[i].name} </li>`

      }
      ulList.innerHTML = str;
    }
  })
}

// on choose a city fetching its data and display it from 'getWeatherData function' after reset search parameters to null
ulList.addEventListener('click',function(eve){

  City = eve.target.innerText;

  getWeatherData()
  
  ulList.innerHTML = null;
  searchInput.value = null;
})

// when click on anywhere out of ul containg city will reset search parameters to initial
document.body.addEventListener('click',(eve)=>{
  ulList.innerHTML =''
  
})




// subscribe button on footer seaction
document.getElementById('subscribe-btn').addEventListener('click',function(eve){
  
  const banner = document.createElement('p');
  banner.classList.add('position-absolute','text-center','banner');

  const emailInput = document.querySelector('footer input')
  

  if(/^[a-zA-Z][a-zA-Z0-9\._]*@[a-zA-Z][a-zA-Z0-9\._]*(\.[a-zA-Z][a-zA-Z0-9]*)+/i.test(emailInput.value)){
    
    emailInput.value = null
    banner.classList.add('valid')
    banner.innerHTML = 'subscribed successfully' 
    

    emailInput.after(banner);

    const timeId = setTimeout(() => {
      gsap.to(banner,{
        duration:1,
        opacity:0,
        onComplete:()=>{
          banner.remove();
          clearTimeout(timeId)
        }
      })
      
    }, 1000);

  }else{
    
    banner.classList.add('invalid')


    banner.innerHTML = 'invaild email' 
    
    emailInput.after(banner)

    const timeId = setTimeout(() => {
      gsap.to(banner,{
        duration:1,
        opacity:0,
        onComplete:()=>{
          banner.remove();
          clearTimeout(timeId)
        }
      })
      
    }, 1000);
  }

})
// -----------





// end of the search section ------------------------------------------------------




// display data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function display(result){

  

  var todayForecast = result['forecast']['forecastday'].at(DAY)['day'];

  var date = new Date(`${ result['forecast']['forecastday'].at(DAY).date}`);
  
  document.getElementById('city').innerText = result['location'].name;

  document.getElementById('day').innerText = date.toLocaleDateString('en-US',{weekday:'long'});

  document.getElementById('date').innerText =`${date.getDate() }  ${date.toLocaleDateString('en-US',{month:'long'})}`;

 

  // overview about weather over all day

  document.querySelector('div.avg-temp>p').innerHTML = `${todayForecast['maxtemp_c']}/${todayForecast['mintemp_c']}  C`;

  document.querySelector('div.avg-wind>p').innerHTML = `${todayForecast["maxwind_kph"]} kph`;

  document.querySelector('div.avg-humidity>p').innerHTML = `${todayForecast.avghumidity}%`;

  document.querySelector('div.avg-uv>p').innerHTML = `${todayForecast.uv}`;



  // update the data of the average condtion of the display day
  var condition = document.querySelector('div.condition');

  condition.querySelector('p').innerHTML = `${todayForecast['avgtemp_c']}ْ C`;

  condition.querySelector('img').src = `https:${todayForecast.condition.icon}`;

  condition.querySelector('span.text').innerHTML = `${todayForecast.condition.text}`;


  // animating the temperature dagree from 0 to its value
  var number = {value:0};
  gsap.to(number,{
    value:todayForecast['avgtemp_c'],
    duration:0.5,
    ease:'power1.out',
    onUpdate:()=>{

      condition.querySelector('p').innerHTML = `${ Math.round(number.value*10)/10 }ْ C`;

    }
  })
  

  
// display all weather  data of each hour of the display day
createTimes(result.forecast.forecastday.at(DAY).hour,result.forecast.forecastday.at(DAY).astro);

}



// draw svg graph for next 7 days  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// all function in the next part about drawing svg and animating it

function next14dDay(forecastday ){

  var svg =document.querySelector('svg');
  
  var width = svg.getBoundingClientRect().width
  var height = svg.getBoundingClientRect().height;

  
  var arrMax = [];
  var arrMaxPoints = [];
  var arrMAXdegree = [];

  var arrMin = [];
  var arrMinPoints = [];
  var arrMindegree = [];

  var arrdate = []
  let arrVerticalLines =[]

  var numberDays = 8


   var firstMaxPoint = [ (1/numberDays)*width , (height*0.7  - ( forecastday[0].day['maxtemp_c'] / 40)* height*0.4)];
   var firstMinPoint = [ (1/numberDays)*width , (height*0.7  - ( forecastday[0].day['mintemp_c'] / 40)* height*0.4)];

  for (var i = 0 ; i < forecastday.length ;i++){
  
    var   x = ((i+1)/numberDays)*width ;

    var  yMax  = (height*0.7  - ( forecastday[i].day['maxtemp_c'] / 40)* height*0.4)  ;
    var  yMin = (height*0.7  - ( forecastday[i].day['mintemp_c'] / 40)* height*0.4)  ;

  
    
  
    // max line
    arrMax.push(`L${x} ${yMax}`) ;
    // max circles
    arrMaxPoints.push(`<circle  class="${DAY == i ? "active":""}"  stroke="#ffffffff" cx="${x}" cy="${yMax}" r="3" />`);
    // max texts
    arrMAXdegree.push(` <text x="${x}" y="${yMax}" dx="0" dy="-10">${forecastday[i].day['maxtemp_c'] }ْ c</text>`) ;

    // min line
    arrMin.push( `L${x} ${yMin}`);
    // min circles
    arrMinPoints.push(`<circle class="${DAY == i ? "active":""}"  stroke=" #ffffffff" cx="${x}" cy="${yMin}" r="3" />`);
    // min text
    arrMindegree.push(` <text x="${x}" y="${yMin}" dx="0" dy="17">${forecastday[i].day['mintemp_c'] }ْ c</text>`);

    // date
    arrdate.push(` <text x="${x}" y="0" fill="#ffffffd8" dx="0" dy="${height-5}">${forecastday[i].date.match(/(?<=-)\d{1,2}-\d{1,2}/i)[0] }</text>`);
    // vertical lines
    arrVerticalLines.push(`M${x} ${height*0.8} L${x} ${height*0.8} L${x} ${height*0.2}`)
    

  }


   var str2 = `

  <path id='lines' d= "${ arrVerticalLines.join(' ')}" style="fill:none;stroke: #ffffffd2;stroke-width:0.1" />

  <path id="maxPath" d=" M${ firstMaxPoint[0]} ${ firstMaxPoint[1]}  ${arrMax.join(' ')} "  style="fill:none;stroke: #ffffffff;stroke-width:1.5" />

  <g class="maxtemp" stroke="#ffffffff" stroke-width="1.5" fill="#000000"> ${arrMaxPoints.join(' ')}  </g>

  <g class="maxtemp" font-size="10" font-family="sans-serif" fill="white" text-anchor="middle"> ${arrMAXdegree.join(' ')}  </g>

  <path id="minPath" d=" M${ firstMinPoint[0]} ${ firstMinPoint[1]}  ${arrMin.join(' ')} " style="fill:none;stroke: #ffffffff;stroke-width:1.5" />

  <g class="mintemp" stroke="#ffffffff" stroke-width="1.5" fill="#000000"> ${arrMinPoints.join(' ')} </g>

  <g  class="mintemp" font-size="10" font-family="sans-serif" fill="white" text-anchor="middle"> ${arrMindegree.join(' ')} </g>

  <g font-size="11" font-family="sans-serif" fill="white" text-anchor="middle"> ${arrdate.join(' ')}  </g>
  
  `

  svg.innerHTML = str2

  // animating path  when creation
 
  // animating path of the max temperature (draw from 0 to 100%)
  var maxPath = document.getElementById('maxPath');
  var maxPathLenght = maxPath.getTotalLength();

  gsap.set(maxPath,{
    strokeDasharray:maxPathLenght,
    strokeDashoffset:maxPathLenght,
    
  });
  gsap.to(maxPath,{
    strokeDashoffset:0,
    duration:2,
    delay:0.4,
    ease:'power1.out'

  });


  // animating path of the min temperature (draw from 0 to 100%)
  
  var minPath = document.getElementById('minPath');
  var minPathLenght = minPath.getTotalLength();
  gsap.set(minPath,{
    strokeDasharray:minPathLenght,
    strokeDashoffset:minPathLenght,
    
  });
  gsap.to(minPath,{
    strokeDashoffset:0,
    duration:2,
    delay:0.4,
    ease:'power1.out'
  });

  // animating the draw verical lines
  var linesPath = document.getElementById('lines');
  var linePathLenght = maxPath.getTotalLength();

  gsap.set(linesPath,{
    strokeDasharray:linePathLenght,
    strokeDashoffset:linePathLenght,
    
  });
  gsap.to(linesPath,{
    strokeDashoffset:0,
    duration:2,
    delay:0,
    ease:'power1.out',
    stagger:0.2

  });

  // animating max circles 
  gsap.from('g.maxtemp circle ',{
    opacity:0,
    duration:0.5,
    stagger:0.2,
    delay:0,
    ease:'power1.out'

  })

  // animating min circles 
  gsap.from('g.mintemp circle ',{
    opacity:0,
    duration:0.5,
    stagger:0.2,
    delay:0,
    ease:'power1.out'

  })

  // animating max texts
  gsap.from('g.maxtemp text',{
    opacity:0,
    duration:0.5,
    stagger:0.4,
    delay:1


  })

  // animating min texts

  gsap.from('g.mintemp text',{
    opacity:0,
    duration:0.5,
    stagger:0.4,
    delay:1
  })


        

  
   // coloring the today points
  gsap.to('svg g.maxtemp circle.active',{
    duration:0.4,
    r:5,
    stroke:'red'
  })

  gsap.to('svg g.mintemp circle.active',{
    duration:0.4,
    r:5,
    stroke:'red'
  })


}


// control creation of the svg only on resize width
let prevoisWidth = window.innerWidth;

window.addEventListener('resize',(e)=>{

    // display  predictions of the next 14 day
    if(window.innerWidth != prevoisWidth){
      next14dDay(weatherData['forecast']['forecastday']);
      prevoisWidth = window.innerWidth
    }
})

// event handler of the change to next day 
document.querySelector('div.next-day-btn>i.fa-arrow-circle-right').addEventListener('click',(e)=>{
      DAY = ++DAY >=7 ? 0:DAY;
      display(weatherData);
      nextDayPoints();  //coloring the circle of that day on svg graph and make the previous point normal

});

// event handler of the change to previous day 

document.querySelector('div.next-day-btn>i.fa-arrow-circle-left').addEventListener('click',(e)=>{
      DAY = --DAY < 0 ? 6:DAY;
      display(weatherData);
      previoustDayPoints() //coloring the circle of that day on svg graph and make the previous point normal

});


// the function of changing the position of the colored circle on svg graph to the next circle with animation
function nextDayPoints(){

  // max temperature cirecle
  var currentPointMax = document.querySelector('svg g.maxtemp circle.active');

  // return the current circle to normal size and color 
  gsap.to(currentPointMax,{
    duration:1,
    delay:0,
    r:3,
    stroke:'white',
    onStart:function(){
      this._targets[0].classList.remove('active');
    }
  });

  
  // define the next circle (if reaching the end return to tthe first circle)
   var nextCircle = currentPointMax.nextElementSibling != undefined ? currentPointMax.nextElementSibling : document.querySelector('svg g.maxtemp circle:first-of-type');

  // change the next cirecle to the active state
  gsap.to(nextCircle,{
    duration:1,
    delay:0,
    r:5,
    stroke:'#fd0000ff',
    onStart:function(){
      this._targets[0].classList.add('active');
    }
  })

  



  // min temperature circle
  var currentPointMin = document.querySelector('svg g.mintemp circle.active');
  

  // return the current circle to normal size and color 
  gsap.to(currentPointMin,{
    duration:1,
    delay:0,
    r:3,
    stroke:'white',
    onStart:function(){
      this._targets[0].classList.remove('active');
    }
  });

  // define the next circle (if reaching the end return to tthe first circle)
   var nextCircle = currentPointMin.nextElementSibling != undefined ? currentPointMin.nextElementSibling : document.querySelector('svg g.mintemp circle:first-of-type');
   
  // change the next cirecle to the active state
  gsap.to(nextCircle,{
    duration:1,
    delay:0,
    r:5,
    stroke:'red',
    onStart:function(){
      this._targets[0].classList.add('active');
    }
  })

  



}

// the function of changing the position of the colored circle on svg graph to the previous circle with animation
function previoustDayPoints(){

  var currentPointMax = document.querySelector('svg g.maxtemp circle.active');
    gsap.to(currentPointMax,{
      duration:0.4,
      delay:0,
      r:3,
      ease:'elastic',
      stroke:'#ffffffff',
      onStart:function(){
        this._targets[0].classList.remove('active');

      }
    })

   var previousCircle = currentPointMax.previousElementSibling != undefined ? currentPointMax.previousElementSibling : document.querySelector('svg g.maxtemp circle:last-of-type');

    gsap.to(previousCircle,{
      duration:0.4,
      delay:0,
      r:5,
      stroke:'red',
      onStart:function(){
        this._targets[0].classList.add('active');
      }
    })

  



  // min temp
  
  var currentPointMin = document.querySelector('svg g.mintemp circle.active');
    gsap.to(currentPointMin,{
      duration:0.4,
      delay:0,
      r:3,
      ease:'elastic',
      stroke:'#ffffffff',
      onStart:function(){
        this._targets[0].classList.remove('active');
      }
    })

   var previousCircle = currentPointMin.previousElementSibling != undefined ? currentPointMin.previousElementSibling : document.querySelector('svg g.mintemp circle:last-of-type');

    gsap.to(previousCircle,{
      duration:0.4,
      delay:0,
      r:5,
      stroke:'red',
      onStart:function(){
        this._targets[0].classList.add('active');
        console.log(this._targets,'this new point')

      }
    })


}
// ------------------------------------------------------end of drawing a graph



// creating the each hour div containing the weather data of that day
function createTimes(allHoursData,astro){

  var times = document.querySelector('.times')
  times.innerHTML = `
     <span class="position-absolute top-0 start-0 mt-1 ms-2 small-info "
              >day predictions</span
    `

  var sunrise = +astro.sunrise.match(/^\d{2}(?=:)/i)[0];
  var sunset = +astro.sunset.match(/^\d{2}(?=:)/i)[0]+12;

  console.log(sunrise,sunset)

  for(var i = 0 ; i< 24 ;i++){

    var time = document.createElement('div');
    time.setAttribute('time',i)
    time.classList.add('time');

  
    
    if(i< sunrise ){
       time.style.background = 'var(--bg-color-transparent)'
    }else if(i == sunrise){
      time.setAttribute('sun',`sunrise  ${astro.sunrise}`);
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

    

  times.append(time);

}

// animating the divs of the hour data
gsap.from('div.times div.time',{
  duration:0.5,
  opacity:0,
  scale:0,
  stagger:{
    each:0.05,
    from:'start'
  },

})

}





// nav menu  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

document.querySelector('nav i').addEventListener('click',function(eve){
  
  // console.log(this.closest('ul'))
  document.querySelector('nav ul').classList.toggle('active');

  this.classList.toggle('fa-close')
  this.classList.toggle('fa-bars')
})




// nav links handler

document.querySelector('nav ul').addEventListener('click',(eve)=>{
  document.querySelector('nav ul').classList.toggle('active');

  document.querySelector('nav i').classList.remove('fa-close')
  document.querySelector('nav i').classList.add('fa-bars')
})

document.querySelector('nav ul li a[href="#contact"]').addEventListener('click',(eve)=>{
 
  document.querySelector('header').classList.add('d-none');
  document.querySelector('header').classList.remove('d-block');

  document.querySelector('section.contact').classList.add('d-flex');
  document.querySelector('section.contact').classList.remove('d-none');

})

document.querySelector('a[href="#home"]').addEventListener('click',(eve)=>{

  document.querySelector('header').classList.add('d-block');
  document.querySelector('header').classList.remove('d-none');

  document.querySelector('section.contact').classList.add('d-none');
  document.querySelector('section.contact').classList.remove('d-flex');

  
})

// -----------------------------------------------------------------------------------------------------

