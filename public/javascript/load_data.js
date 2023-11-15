import {tiempoArr, precipitacionArr, uvArr, temperaturaArr} from './static_data.js';

let fechaActual = () => new Date().toISOString().slice(0,10);
let URLs = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,uv_index,cape&timezone=auto'; 

let cargarPrecipitacion = () => {

    //Obtenga la función fechaActual
    let actual = fechaActual();

    //Defina un arreglo temporal vacío
    let datospre = []

    //Itere en el arreglo tiempoArr para filtrar los valores de precipitacionArr que sean igual con la fecha actual
    for (let index = 0; index < tiempoArr.length; index++) {
        const tiempo = tiempoArr[index];
        const precipitacion = precipitacionArr[index]
        const temperatura = temperaturaArr[index]

        if(tiempo.includes(actual)) {
          datospre.push(precipitacion)
        }
    }

    //Con los valores filtrados, obtenga los valores máximo, promedio y mínimo
    let max = Math.max(...datospre)
    let min = Math.min(...datospre)
    let sum = datospre.reduce((a, b) => a + b, 0);
    let prom = (sum / datospre.length) || 0;

    //Obtenga la referencia a los elementos HTML con id precipitacionMinValue, precipitacionPromValue y precipitacionMaxValue
    let precipitacionMinValue = document.getElementById("precipitacionMinValue")
    let precipitacionPromValue = document.getElementById("precipitacionPromValue")
    let precipitacionMaxValue = document.getElementById("precipitacionMaxValue")

    //Actualice los elementos HTML con los valores correspondientes
    precipitacionMinValue.textContent = `Min ${min} [mm]`
    precipitacionPromValue.textContent = `Prom ${ Math.round(prom * 100) / 100 } [mm]`
    precipitacionMaxValue.textContent = `Max ${max} [mm]`
}

let cargarUv = () => {
  let actual = fechaActual();
  let datosuv = []
  for (let index = 0; index < tiempoArr.length; index++) {
    const tiempo = tiempoArr[index];
    const uv = uvArr[index]

    if(tiempo.includes(actual)) {
      datosuv.push(uv)
    }
  }

  let maxuv = Math.max(...datosuv)
  let minuv = Math.min(...datosuv)
  let sumuv = datosuv.reduce((a, b) => a + b, 0);
  let promuv = (sumuv / datosuv.length) || 0;

  let uvMinValue = document.getElementById("uvMinValue")
  let uvPromValue = document.getElementById("uvPromValue")
  let uvMaxValue = document.getElementById("uvMaxValue")

  uvMinValue.textContent = `Min ${minuv} [--]`
  uvPromValue.textContent = `Prom ${ Math.round(promuv * 100) / 100 } [--]`
  uvMaxValue.textContent = `Max ${maxuv} [--]`
}

let cargartemperatura = () => {
  let actual = fechaActual();
  let datostemp = []

  for (let index = 0; index < tiempoArr.length; index++) {
    const tiempo = tiempoArr[index];
    const temperatura = temperaturaArr[index]

    if(tiempo.includes(actual)) {
      datostemp.push(temperatura)
    }
  }

  let maxtemp = Math.max(...datostemp)
  let mintemp = Math.min(...datostemp)
  let sumtemp = datostemp.reduce((a, b) => a + b, 0);
  let promtemp = (sumtemp / datostemp.length) || 0;

  let temperaturaMinValue = document.getElementById("temperaturaMinValue")
  let temperaturaPromValue = document.getElementById("temperaturaPromValue")
  let temperaturaMaxValue = document.getElementById("temperaturaMaxValue")

  temperaturaMinValue.textContent = `Min ${mintemp} [°C]`
  temperaturaPromValue.textContent = `Prom ${ Math.round(promtemp * 100) / 100 } [°C]` 
  temperaturaMaxValue.textContent = `Max ${maxtemp} [°C]`
}
//cargarPrecipitacion()
//cargarUv()
//cargartemperatura()

let cargarDatosGuayaquil = async () =>{

  let actual = fechaActual();
  let APIkey = '56ee2c0628fa32e2142831cdfcfdabf8'
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${APIkey}`
  
  let response = await fetch(url)
  let responseText = await response.text()
  
  // Parsing XML
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");
  let timeArr = xml.querySelectorAll("time")

  let datosprecipitation = []
  let datoshumedad= []
  let datostemperaturamax = []

  let precipitacionGyq = document.getElementById("precipitacionGyq")
  let humedadGyq = document.getElementById("humedadGyq")
  let temperaturaGyq = document.getElementById("temperaturaGyq")
  timeArr.forEach((time,index) => {
      let precipitation = time.querySelector("precipitation").getAttribute("probability")
      let humedad = time.querySelector("humidity").getAttribute("value")
      let temperaturamax = time.querySelector("temperature").getAttribute("max")

      datosprecipitation.push(precipitation)
      datoshumedad.push(humedad)
      datostemperaturamax.push(temperaturamax)

  })

  let max = Math.max(...datosprecipitation)
  precipitacionGyq.textContent = `Probability Max ${max}`

  let humedadmax = Math.max(...datoshumedad)
  humedadGyq.textContent = `Humedad ${humedadmax} [%]`

  let temperaturamax = Math.max(...datostemperaturamax)
  temperaturaGyq.textContent = `Temperatura Max ${temperaturamax} [°K]`
}


let cargarFechaActual = () => {
  
    //Obtenga la referencia al elemento h6
    let coleccionHTML = document.getElementsByTagName("h6")

    let tituloH6 = coleccionHTML[0]

    //Actualice la referencia al elemento h6 con el valor de la función fechaActual()
    tituloH6.textContent = fechaActual()
}



let cargarOpenMeteo = () => {

  //URL que responde con la respuesta a cargar
  let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,uv_index,cape&timezone=auto'; 

  fetch( URL )
    .then(responseText => responseText.json())
    .then(responseJSON => {
      
      console.log(responseJSON);     
      //Respuesta en formato JSON
      //Referencia al elemento con el identificador plot
      let plotRef = document.getElementById('plot1');

      //Etiquetas del gráfico
      let labels = responseJSON.hourly.time;

      //Etiquetas de los datospre
      let data = responseJSON.hourly.temperature_2m;
      let data1 = responseJSON.hourly.uv_index;
      //Objeto de configuración del gráfico
      let config = {
        type: 'line',  
        data: {
          labels: labels, 
          datasets: [
            {
              label: 'Temperature [2m]',
              data: data, 
              borderColor: '#FF6382',
              backgroundColor: '#FFE4C4',
            },
            {
              label: 'UV Index',
              data: data1, 
              borderColor: '#0000FF',
              backgroundColor: '#87CEFA',
            }
          ]
        }
      };

      //Objeto con la instanciación del gráfico
      let chart1  = new Chart(plotRef, config);
  
      //plot2
      let plotRef2 = document.getElementById('plot2');
      let data2 = responseJSON.hourly.cape;
      let config2 = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cape',
              data: data2,
              borderColor: '#32CD32',
              backgroundColor: '#98FB98',
            }
          ]
        }
      };
      let chart2  = new Chart(plotRef2, config2);

    })
    .catch(console.error);

}

cargarDatosGuayaquil()
//cargarPrecipitacion()
cargarFechaActual()
cargarOpenMeteo()

let parseXML = (responseText) => {
  
  // Parsing XML
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");

  // Referencia al elemento `#forecastbody` del documento HTML

  let forecastElement = document.querySelector("#forecastbody")
  forecastElement.innerHTML = ''

  // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
  let timeArr = xml.querySelectorAll("time")

  timeArr.forEach(time => {
       
      let from = time.getAttribute("from").replace("T", " ")

      let humidity = time.querySelector("humidity").getAttribute("value")
      let windSpeed = time.querySelector("windSpeed").getAttribute("mps")
      let precipitation = time.querySelector("precipitation").getAttribute("probability")
      let pressure = time.querySelector("pressure").getAttribute("value")
      let cloud = time.querySelector("clouds").getAttribute("all")

      let template = `
          <tr>
              <td>${from}</td>
              <td>${humidity}</td>
              <td>${windSpeed}</td>
              <td>${precipitation}</td>
              <td>${pressure}</td>
              <td>${cloud}</td>
          </tr>
      `

      //Renderizando la plantilla en el elemento HTML
      forecastElement.innerHTML += template;
  })

}

//Callback async
let selectListener = async (event) => {

  let selectedCity = event.target.value

  // Lea la entrada de almacenamiento local
  let cityStorage = localStorage.getItem(selectedCity);
  
  if(cityStorage == null){
    try {

      //API key
      let APIkey = '56ee2c0628fa32e2142831cdfcfdabf8'
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`
  
      let response = await fetch(url)
      let responseText = await response.text()
      
      await parseXML(responseText)
       // Guarde la entrada de almacenamiento local
      await localStorage.setItem(selectedCity, responseText)
    } catch (error) {
        console.log(error)
    }

  } else {
    // Procese un valor previo
    parseXML(cityStorage)
  }
}

let loadForecastByCity = () => {

  //Handling event
  let selectElement = document.querySelector("select")
  selectElement.addEventListener("change", selectListener)

}

loadForecastByCity()


//seccion gestion de riesgos
let loadExternalTable = async ()=> {
  //Requerimiento asíncrono
  console.log("Gestión de riesgo")

  let proxy = 'https://cors-anywhere.herokuapp.com/'
  let url = proxy + 'https://www.gestionderiesgos.gob.ec/monitoreo-de-inundaciones/'

  let response = await fetch(url)
  let responseText = await response.text()

  const parser = await new DOMParser();
  const xml = await parser.parseFromString(responseText, "text/html");

  let table = await xml.querySelector("#postcontent table")
  document.getElementById("monitoreo").innerHTML = table.outerHTML
}

loadExternalTable()