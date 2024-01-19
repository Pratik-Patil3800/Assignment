const usertb=document.querySelector("[data-user]");
const searchtb=document.querySelector("[data-search]");
const searchform=document.querySelector(".searchpage");
const locationpage=document.querySelector(".location");
const searchpage=document.querySelector(".searchpage");
const loadingpage=document.querySelector(".loading");
const content=document.querySelector(".disc");
const access=document.querySelector("[allow]");
const APIkey="eab38b4e09ace67c119d1246e9f14d34";
let currenttab=usertb;
currenttab.classList.add("current-tab");
locationpage.classList.add("active");
function switchtab(clickedtab){
    content.classList.remove("active");
    if(currenttab!=clickedtab){
        clickedtab.classList.add("current-tab");
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
         if(!searchform.classList.contains("active")){
            searchform.classList.add("active");
            usertb.classList.remove("active");
            locationpage.classList.remove("active");
         }
         else{
            usertb.classList.remove("active");
            searchform.classList.remove("active");
            getdata();
         } 

    }
}

usertb.addEventListener("click",() =>{
    switchtab(usertb);
})
searchtb.addEventListener("click",() =>{
    switchtab(searchtb);
})
function getdata(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        locationpage.classList.add("active");
    }
    else{
        locationpage.classList.remove("active");
        const coordinates=JSON.parse(localcoordinates );
        userweather(coordinates);
    }
}

async function userweather(coordinates){
    const {lat, lon}=coordinates;
    locationpage.classList.remove("active");
    loadingpage.classList.add("active");

    try{
        const responce=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`);
        const data=await responce.json();
        console.log(data);
        usertb.classList.add("active");
        loadingpage.classList.remove("active"); 
        displayweather(data);
    }
    catch(err){

    }
}



function displayweather(weatherinfo){
    content.classList.add("active");
    const city=document.querySelector("[cityname]");
    const country=document.querySelector("[countryflag]");
    const weatherinf=document.querySelector("[weather]");
    const weathericoninfo=document.querySelector("[weathericon]");
    const windspeed=document.querySelector("[wind]");
    const humi=document.querySelector("[humidity]");
    const clo=document.querySelector("[cloud]");
    const temprature=document.querySelector("[temp]");
    
    city.innerText =weatherinfo?.name;
    country.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    weatherinf.innerText=weatherinfo?.weather?.[0]?.description;
    weathericoninfo.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temprature.innerText=`${weatherinfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
    humi.innerText=`${weatherinfo?.main?.humidity} %`;
    clo.innerText=`${weatherinfo?.clouds?.all} %`; 

}
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geolocation Support");
    }
}

function showPosition(position){
    const usercoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    userweather(usercoordinates)
}

access.addEventListener("click",getlocation);  
let input=document.querySelector("[searchinput]");
searchpage.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=input.value;
    if(cityname==""){
        return ;
    }
    else{
        callbycityname(cityname);
    }
})

async function callbycityname(cityname){
    locationpage.classList.remove("active");
    loadingpage.classList.add("active");
    usertb.classList.remove("active");
    try{
        const responce=await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`);
        const data=await responce.json();
        loadingpage.classList.remove("active");
        displayweather(data);
        console.log(data);
    }
    catch(err){

    }
    
}