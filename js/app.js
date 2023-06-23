// Variables
const inputMascota = document.querySelector('#mascota');
const inputPropietario = document.querySelector('#propietario');
const inputTelefono = document.querySelector('#telefono');
const inputFecha = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputSintomas = document.querySelector('#sintomas');

//Formulario
const form = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

// Clases
class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];

    console.log(this.citas);
  }

  eliminarCita(id) {
    this.citas = this.citas.filter(cita => cita.id !== id);
  }

  editarCita(actualizacion) {
    this.citas = this.citas.map(cita => cita.id === actualizacion.id ? actualizacion : cita)
  }

}

class Mascota {
  constructor(mascota, propietario, telefono, fecha, hora, sintomas) {
    this.mascota = mascota;
    this.propietario = propietario;
    this.telefono = telefono;
    this.fecha = fecha;
    this.hora = hora;
    this.sintomas = sintomas;
  }
}

class UI {

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

    // Validacion de tipo
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else if (tipo === 'blue') {
      divMensaje.classList.add('alert-primary');
    } else {
      divMensaje.classList.add('alert-success');
    }

    divMensaje.textContent = mensaje;

    // Agregar al DOM
    document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

    setTimeout(() => {
      divMensaje.remove();
    }, 5000)

  }

  imprimirCitas({ citas }) {

    this.limpiarHTML();

    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

      const divCitas = document.createElement('DIV');
      divCitas.classList.add('cita', 'p-3');
      divCitas.dataset.id = id;

      // Scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;
      // Propietario
      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario:</span> ${propietario}
      `
      // Telefono
      const propietarioTelefono = document.createElement('p');
      propietarioTelefono.innerHTML = `
        <span class="font-weight-bolder">Telefono:</span> ${telefono}
      `
      // Fecha
      const propietarioFecha = document.createElement('p');
      propietarioFecha.innerHTML = `
        <span class="font-weight-bolder">Fecha:</span> ${fecha}
      `
      // Hora
      const propietarioHora = document.createElement('p');
      propietarioHora.innerHTML = `
        <span class="font-weight-bolder">Hora:</span> ${hora}
      `
      // Sintomas
      const propietarioSintomas = document.createElement('p');
      propietarioSintomas.innerHTML = `
        <span class="font-weight-bolder">Sintomas:</span> ${sintomas}
      `

      // boton para eliminar esta cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
      btnEliminar.innerHTML = `Eliminar X`;
      btnEliminar.onclick = () => eliminarCita(id);

      // boton para editar esta cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-primary', 'mr-2');
      btnEditar.innerHTML = `Editar `;
      btnEditar.onclick = () => editarCita(cita);


      // Agregar parrafos al divCitas
      divCitas.appendChild(mascotaParrafo);
      divCitas.appendChild(propietarioParrafo);
      divCitas.appendChild(propietarioTelefono);
      divCitas.appendChild(propietarioFecha);
      divCitas.appendChild(propietarioSintomas);
      divCitas.appendChild(btnEliminar);
      divCitas.appendChild(btnEditar);

      // Agregar las citas al HTML
      contenedorCitas.appendChild(divCitas);
    })
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

// Eventos
cargarEventos();
function cargarEventos() {
  inputMascota.addEventListener('change', datosCita);
  inputPropietario.addEventListener('change', datosCita);
  inputTelefono.addEventListener('change', datosCita);
  inputFecha.addEventListener('change', datosCita);
  inputHora.addEventListener('change', datosCita);
  inputSintomas.addEventListener('change', datosCita);

  form.addEventListener('submit', nuevaCita)
}


// Instanciadores
const ui = new UI;
const administrarCitas = new Citas;
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: ""
};


// Funciones
function datosCita(e) {
  //Rellena el objeto citas
  citaObj[e.target.name] = e.target.value.trim();
}

function nuevaCita(e) {
  e.preventDefault();
  // A validar
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validaciones
  if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if (editando) {
    ui.imprimirAlerta('Modo edición', 'blue');

    //Pasar el objeto de la cita al editor
    administrarCitas.editarCita({ ...citaObj });

    //cambiar apariencia del boton
    form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
    form.querySelector('button[type="submit"]').classList.remove('btn-success');
    form.querySelector('button[type="submit"]').classList.add('btn-primary');

    //Quitar modo edición
    editando = false;

  } else {
    citaObj.id = Date.now();

    // Creando una nueva cita
    administrarCitas.agregarCita({ ...citaObj });

    ui.imprimirAlerta('Se agregó correctamente', 'success');
  }


  //Reinicia los objetos para la validacion
  reiniciarObjeto();

  //Mostrar citas en HTML
  ui.imprimirCitas(administrarCitas);

  // Reinicia formulario
  form.reset();
}

//Reinciar objeto
function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

function eliminarCita(id) {
  //Eliminar la cita
  administrarCitas.eliminarCita(id);

  // Alerta
  ui.imprimirAlerta('La cita se elimino correctamente', 'success');

  //Imprimir las citas
  ui.imprimirCitas(administrarCitas);
}

function editarCita(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //Llenar los inputs
  inputMascota.value = mascota;
  inputPropietario.value = propietario;
  inputTelefono.value = telefono;
  inputFecha.value = fecha;
  inputHora.value = hora;
  inputSintomas.value = sintomas;

  //Llenar objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;


  //cambiar apariencia del boton
  form.querySelector('button[type="submit"]').textContent = "Guardar cambios";
  form.querySelector('button[type="submit"]').classList.remove('btn-success');
  form.querySelector('button[type="submit"]').classList.add('btn-primary');


  editando = true;

}