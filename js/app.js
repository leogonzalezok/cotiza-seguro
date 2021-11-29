// Constructores
function Seguro(marca,year,tipo){
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}
// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){
  let cantidad;
  let base = 2000;
  /*
    1 = Americano > 1.15
    2 = Asiatico > 1.5
    3 = Europero > 1.35
  */
  switch (this.marca) {
    case '1':
      cantidad = base * 1.15;
      break;
    case '2':
      cantidad = base * 1.5;
      break;
    case '3':
      cantidad = base * 1.35;
      break;
    default:
      break;
  }
  const diferencia = new Date().getFullYear() - this.year;
  cantidad -= ((diferencia * 3 ) * cantidad) / 100;
  if(this.tipo === 'basico'){
    cantidad *= 1.30;
  }else{
    cantidad *= 1.50;
  }
  return cantidad;
}

function UI() {}
// llena los options con los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
      let option = document.createElement('option');
      option.textContent = i;
      option.value = i;
      selectYear.appendChild(option);
    }
}
// Muestra un mensaje informativo
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const formulario = document.querySelector('#cotizar-seguro');
  const div = document.createElement('div');
  if(tipo==='error'){
    div.classList.add('error');
  }else{
    div.classList.add('correcto')
  }
  div.classList.add('mensaje', 'mt-10');
  div.textContent = mensaje;
  // Insertar en el HTML
  formulario.insertBefore(div,document.querySelector('#resultado'));
  // Eliminar mensaje
  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};
// Mostrar resultado
UI.prototype.mostrarResultado = (seguro, total)=>{
  const {marca, year, tipo} = seguro;
  let textoMarca;
  switch (marca) {
    case '1':
      textoMarca = 'Americano';
      break;
    case '2':
      textoMarca = 'Asiatico';
      break;
    case '3':
      textoMarca = 'Europeo';
      break;
    default:
      break;
  }
  const div = document.createElement('div');
  div.classList.add('mt-10');
  div.innerHTML = `
    <p class="header"> Tu resumen </p>
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span> </p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span> </p>
    <p class="font-bold">Tipo: <span class="font-normal">${tipo}</span> </p>
    <p class="font-bold">Total: <span class="font-normal">$${total}</span> </p>
  `;
  const resultadoDiv = document.querySelector('#resultado');
  const spinner = document.querySelector('#cargando');
  spinner.style.display = 'block';
  setTimeout(() => {
    spinner.style.display = 'none';
    resultadoDiv.appendChild(div);
  }, 2000);
}
// Instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', ()=>{
  ui.llenarOpciones();
});

eventListeners();

function eventListeners(){
  const formulario = document.querySelector('#cotizar-seguro');
  formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
  e.preventDefault();
  
  // leer la marca seleccionada
  const marca = document.querySelector('#marca').value;

  // leer el año seleccionado
  const year = document.querySelector('#year').value;
  // leer el tipo de cobertura
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if(marca === '' || year === '' || tipo === ''){
    ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
    return;
  }
  ui.mostrarMensaje('Cargando la informacion', 'correcto'); 
  // Ocultar resultados previos
  const resultados = document.querySelector('#resultado div');
  if(resultados!= null){
    resultados.remove();
  }
  // Instanciar el seguro
  const seguro = new Seguro(marca,year,tipo);
  const total = seguro.cotizarSeguro();
  ui.mostrarResultado(seguro, total);
}