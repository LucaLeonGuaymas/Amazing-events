let URI = "https://amazing-events.herokuapp.com/api/events"
const divCards = document.getElementById("cards-container")
const inputSerch = document.getElementById("search")
const checkContainer = document.getElementById("checks")
let cadenaParametrosUrl = location.search
let parametros = new URLSearchParams(cadenaParametrosUrl)
let id = parametros.get('id')
let contenedor = document.getElementById('contenedor')
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
let eventoEncontrado
let eventos = []
let categorias = []
let tabla1 = document.getElementById("tabla1")
let tabla2 = document.getElementById("tabla2")
let tabla3 = document.getElementById("tabla3")
// variables de primera tabla

let tabla1MayAsis;
let tabla1MenAsis;
let tabla1Cap;

// variables de segunda tabla

let arraycategoriasPas = []
let arrayCategoriasUp = []
let eventosPast = []
let eventosUp = []

if(document.title != "Details" && document.title != "Contact" && document.title != "Stats"){
inputSerch.addEventListener('input',superFiltro)

checkContainer.addEventListener('change',superFiltro)
}
traerDatos(URI)

if(document.title == "Details") {
function pintarDitails(evento){
  contenedor.innerHTML = ""   
    let div = document.createElement("div")
    div.className="card mb-3" 
    div.style.marginTop = "1rem" 
    div.style.maxWidth = "540px"
    div.innerHTML = `<div class="row g-0" >
      <div class="col-md-4">
        <img src="${evento.image}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${evento.name}</h5>
          <p class="card-text">${evento.description}</p>
          <p class="card-text"><small class="text-muted">${evento.date}</small></p>
        </div>
      </div>
    </div>`
  contenedor.appendChild(div)    
 }
}

function pintarCards(arrayEventos){
  divCards.innerHTML = ""
  if(arrayEventos.length == 0){
    divCards.innerHTML = `<p class="display-1 bolder text-danger">NO SE ENCONTRARON RESULTADOS</P>`
  }
  arrayEventos.forEach(evento => {
    let card = document.createElement("div")
    card.className="col"
    card.innerHTML = `<div class="card h-100">
    <img src=${evento.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${evento.name}</h5>
      <h6 class="card-title">${evento.category}</h6>
      <p class="card-text">${evento.description}</p>
    </div>
    <div class="card-footer">
      <small class="text-muted">
        <div class="d-flex mb-3">
          <div class="me-auto p-2">More info</div>
          <div class="p-2"><button type="button" class="btn btn-outline-warning"><a class="text-black"
                href="details.html?id=${evento._id}">More Info</a></button> </div>
                        </div>
      </small>
    </div>
  </div>`
  divCards.appendChild(card)    
  });
}

function traerDatos(url){
  fetch(url)
  .then(response=> response.json())
  .then(data=> {
    eventos = data.events
    fecha = data.currenDate
    if(document.title=="Home"){
      eventos = data.events
    }else if(document.title=="Upcoming Events"){
      eventos = eventos.filter(
        (evento) => evento.date >= data.currentDate
      )
    }else if(document.title=="Past Events"){
      eventos = eventos.filter(
        (evento) => evento.date < data.currentDate
      )
    } else if(document.title=="Details"){
       eventoEncontrado = eventos.find(evento => evento._id == id)
       pintarDitails(eventoEncontrado)
      
    } else if (document.title=="Stats"){
      // primera tabla    
      eventosPast = eventos.filter(evento => evento.assistance) 
      eventosUp = eventos.filter(evento => evento.estimate)
      console.log(eventosUp)
      console.log(eventosPast)
      tabla1MayAsis = porcMayAsis(eventosPast)
      tabla1MenAsis = porcMenAsis(eventosPast)

      tabla1Cap = mayCap(eventos)
      
      pintarTabla1()
      // segunda tabla

      eventos.forEach(evento => {
        categorias.push(evento)
if(!categorias.includes(evento.category)){
            categorias.push(evento.category)
        }
        

        if(evento.date < data.currentDate) {
          if(!arraycategoriasPas.includes(evento.category)) {
            arraycategoriasPas.push(evento.category)
          }

      }
    
      if (evento.date >= data.currentDate) {
          if(!arrayCategoriasUp.includes(evento.category)) {
              arrayCategoriasUp.push(evento.category)
          }
      }
      
    })
  
    
  let objetoDeCategoriasPas = filtroCategoria(eventosPast, arraycategoriasPas)
  let objetoDeCategoriasUp = filtroCategoria(eventosUp, arrayCategoriasUp)
  pintarTabla (objetoDeCategoriasUp, tabla2)
  pintarTabla (objetoDeCategoriasPas, tabla3)
    } else if (document.title=="Contact") {
     

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const alertTrigger = document.getElementById('liveAlertBtn')
if (alertTrigger) {
  alertTrigger.addEventListener('click', () => {
    alert('Message sent succesfully!', 'success')
  })
}
    }
    
    pintarCards(eventos)
    inputSerch.value = ''
      eventos.forEach(evento =>{
      if(!categorias.includes(evento.category)){
        categorias.push(evento.category)
      }
    })
    crearChecks(categorias)
    
  })
.catch(error => console.log(error.message))
}


function filtrarPorNombre(arrayEventos){
  let texto = inputSerch.value
  let arrayFiltrado = arrayEventos.filter(evento => evento.name.toLowerCase().includes(texto.toLowerCase()))
  return arrayFiltrado
}

function filtrarPorCategoria(eventos){
 
  let inputCheck = document.querySelectorAll("input[type='checkbox']")
  let arrayChecks = Array.from(inputCheck)
  let checkPut = arrayChecks.filter(inputCheck => inputCheck.checked)
  let arrayValues = checkPut.map(check => check.value)
  let filtro =[]
  eventos.filter(evento => {
    arrayValues.forEach(value =>{
      if(evento.category.includes(value)){
         filtro.push(evento)
        
      }
    })
  })
  if(filtro.length == 0){
    return eventos
  }

  return filtro
}

function superFiltro(){
  let primerFiltro = filtrarPorCategoria(eventos)
  let segundoFiltro = filtrarPorNombre(primerFiltro)
  
  
  pintarCards(segundoFiltro)
}

function crearChecks(array){
  checkContainer.innerHTML = ""
  array.forEach(elemento => {
  let div = document.createElement("div")
    div.className="form-check form-check-inline"
    div.innerHTML = `<input class="form-check-input" type="checkbox" id="${elemento}" value="${elemento}">
    <label class="form-check-label" for="${elemento}">${elemento}</label>`
   checkContainer.appendChild(div)
  })
}






function porcMayAsis(eventos) {
  let mayAsis = eventos.sort((a, b) => { 
     
   return (
       (parseInt(b.assistance)*100)/parseInt(b.capacity)-(parseInt(a.assistance)*100)/parseInt(a.capacity)
  )})
     
     return mayAsis[0].name
    
 }

 function porcMenAsis(eventos) {
  mayAsis = eventos.sort((a, b) => { 
     return (
       (parseInt(b.assistance)*100)/parseInt(b.capacity)-(parseInt(a.assistance)*100)/parseInt(a.capacity)
     )
   })
  
     return mayAsis[mayAsis.length-1].name
 }

 function mayCap(eventos) {
  let mayCapacidad = eventos.sort((a, b) => b.capacity-a.capacity)
  
   return mayCapacidad[0].name
 }

 // PINTAR PRIMERA TABLA

 function pintarTabla1() {
   let tabla11 = document.createElement("tr")
   
   tabla11.innerHTML = `<td>${tabla1MayAsis}</td>
   <td>${tabla1MenAsis}</td>
   <td>${tabla1Cap}</td>`
   tabla1.appendChild(tabla11)
 }

// DATOS PARA TABLA

function filtroCategoria(arrayEventos, arrayCategorias) {
 let revenues = []
let percentages = []
 arrayCategorias.forEach(categoria => {
 let eventosPorCategoria = arrayEventos.filter(evento => evento.category == categoria)
 revenues.push(eventosPorCategoria.map(evento => evento.price *(evento.assistance? evento.assistance : evento.estimate)).reduce((sumaPrecios, precio) => sumaPrecios+precio))

 percentages.push(eventosPorCategoria.map(evento => (evento.assistance? evento.assistance / evento.capacity : evento.estimate / evento.capacity)*100).reduce((sumaPorcentajes, porcentage) => sumaPorcentajes+porcentage)/eventosPorCategoria.length)
 }) 
return {
   arrayCategorias: arrayCategorias,
   revenues: revenues,
   percentages: percentages
}
}



 // PINTAR TABLA

 function pintarTabla(objeto, contenedorTabla) {
   objeto.arrayCategorias.forEach((categoria, i) => {
     let tabla = document.createElement("tr")
     tabla.innerHTML = `<td>${categoria}</td>
     <td>$${objeto.revenues[i].toLocaleString()}</td>
     <td>${objeto.percentages[i].toFixed(2)}%</td>
     `
contenedorTabla.appendChild(tabla)

   }      
     )
   
   
   
 }


