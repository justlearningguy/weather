const inputField = document.getElementById('inputField');
const tempShow = document.querySelector('.temp');
const todayConditionImg = document.getElementById('todayConditionImg');
const conditionText = document.querySelector('.conditionText');
const locationNameShow = document.getElementById('currentLocation');
const humidityShow = document.getElementById('humidity');
const windSpeedShow = document.getElementById('windSpeed');
const pressureShow = document.getElementById('pressure');
const sunriseShow = document.getElementById('sunrise');
const sunsetShow = document.getElementById('sunset');
const feelsLike = document.getElementById('feelslike');
const forecastBlock = document.querySelector('.forecastBlock');
const hoursBlock = document.querySelector('.hoursFlex');
const months = ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDays = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayDate = document.getElementById('todayDate');
inputField.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
      if(inputField.value.trim().length === 0) {}
      else {
        current(inputField.value);
        
      }
      inputField.value = '';
    }
  })

async function current(location) {
    let res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=f83add6bc2b747a4a9d74744241106&q=${location}&days=4`);
    res = await res.json();
    console.log(res);
    //current weather
    let date = new Date(res.location.localtime);
    date = date;
    tempShow.innerText = `${Math.round(res.current.temp_c)}°C`;
    locationNameShow.innerText = `${res.location.name}, ${res.location.country}`;
    humidityShow.innerText = `${res.current.humidity}%`;
    windSpeedShow.innerText = `${(res.current.wind_kph/3.6).toFixed(0)} m/s`;
    todayConditionImg.src = res.current.condition.icon;
    conditionText.innerText = res.current.condition.text;
    pressureShow.innerText = `${(res.current.pressure_mb*0.750062).toFixed(0)} mmHg`;
    feelsLike.innerText = `${Math.round(res.current.feelslike_c)}°C`
    window.localStorage.setItem('city', `${res.location.name}, ${res.location.country}`);
    todayDate.innerText = `${months[date.getMonth()]} ${date.getDate()}, ${weekDays[date.getDay()]}`;
    sunriseShow.innerText = res.forecast.forecastday[0].astro.sunrise;
    sunsetShow.innerText = res.forecast.forecastday[0].astro.sunset;

    //today at block
    hoursBlock.innerHTML = '';
    for(let i= date.getHours()+1; i<=23; i++) {
      
      let timeDateObj = new Date(res.forecast.forecastday[0].hour[i].time);
      timeDateObj = timeDateObj.getHours();
      if (timeDateObj > 12) {
        timeDateObj = `${timeDateObj-12} PM`;
      } 
      else if (timeDateObj === 0) {
       timeDateObj = `12 PM`;
      }
      else {
        timeDateObj = `${timeDateObj} AM`;
      }
      let hourItem = window.document.createElement('div');
      hourItem.classList = 'hourItem';
      let hourItemTime = window.document.createElement('span');
      hourItemTime.classList = 'hourItemTime';
      hourItemTime.innerText = timeDateObj;
      let hourItemTemp = window.document.createElement('span');
      hourItemTemp.classList = 'hourItemTemp';
      hourItemTemp.innerText = `${Math.round(res.forecast.forecastday[0].hour[i].temp_c)}°C`;
      let conditionImg = window.document.createElement('img');
      conditionImg.src = res.forecast.forecastday[0].hour[i].condition.icon;
      conditionImg.classList = 'hoursConditionImg';
      hourItem.appendChild(hourItemTime);
      hourItem.appendChild(conditionImg);
      hourItem.appendChild(hourItemTemp);
      hoursBlock.appendChild(hourItem);
    }
    
    

    //forecast
    forecastBlock.innerHTML = '';
    for(let i=0;i<4;i++) {
        let newDay = window.document.createElement('div');
        newDay.classList = 'forecastDayBlock'
        let dateBlock = window.document.createElement('div');
        dateBlock.classList = 'forecastDayDateBlock';
        let dateNumber = window.document.createElement('span');
        dateNumber.classList = 'forecastDayDateNumber';
        dateNumber.innerText = `${months[Number(res.forecast.forecastday[i].date.slice(5,7))-1]} ${Number(res.forecast.forecastday[i].date.slice(8,10))}`;
        let dateWeekday = window.document.createElement('span');
        dateWeekday.classList = 'forecastDayDateWeekday';
        if(i===0) {
          dateWeekday.innerText = 'Today'
        }
        else if(i===1) {
          dateWeekday.innerText = 'Tommorow'
        }
        else {
          dateWeekday.innerText = `${weekDays[date.getDay()+i]}`
        }
        let DayImg = window.document.createElement('img');
        DayImg.classList = 'forecastDayImg';
        DayImg.src = res.forecast.forecastday[i].day.condition.icon;
        let DayTemp = window.document.createElement('span');
        DayTemp.classList = 'forecastDayTemp';
        DayTemp.innerText = `${Math.round(res.forecast.forecastday[i].day.maxtemp_c)}°C`;
        let NightTemp = window.document.createElement('span');
        NightTemp.classList = 'forecastNightTemp';
        NightTemp.innerText = `${Math.round(res.forecast.forecastday[i].day.mintemp_c)}°C`;
        dateBlock.appendChild(dateNumber);
        dateBlock.appendChild(dateWeekday);
        newDay.appendChild(dateBlock);
        newDay.appendChild(DayImg);
        newDay.appendChild(DayTemp);
        newDay.appendChild(NightTemp);
        forecastBlock.appendChild(newDay);
    }
}
if(window.localStorage.getItem('city') === null) {
    current('Moscow');
}
else {
    current(window.localStorage.getItem('city'));
}
