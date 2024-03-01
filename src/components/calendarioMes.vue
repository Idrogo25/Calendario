<template>
  <div class="container mt-5">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th></th>
          <!--Recorremos las filas y columnas.-->
          <th v-for="c in cols" :key="c">{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in props.ROWS" :key="i">
          <th>{{ i - 1 }}</th>
          <td v-for="(c, j) in cols" :key="c">
            <div class="position-relative">
              <!--Celda calendario va a recibir el valor de la fecha-->
              <celdaCalendario :valor="tablaMes[i - 1][j]" class="p-3" />
              <!--Hacemos un condicional para no permitir la posibilidad de agregar una tarea a una celda sin fecha.-->
              <div v-if="tablaMes[i - 1][j] != '- '">
                <button @dragover="eventoOver" @drop="eventoDrop(tablaMes[i - 1][j])"
                  @click="abrirModal(tablaMes[i - 1][j])" class="botonAgregar">
                  +
                </button>
              </div>
              <modalVue :showModal="showModal" :valor="fechaModal" @cerrar-modal="cerrarModal" @abrir-modal="abrirModal"
                @actualizarTareas="acutalizarDatos" />
              <div v-for="tarea in tareas" :key="tarea.id" class="m-2">
                <div :draggable="true" @dragstart="eventodrag(tarea)" v-if="tablaMes[i - 1][j] === tarea.fecha"
                  class="tarea">{{ tarea.tarea }}
                  <button @click="borrarTarea(tarea.id)" class="botonBorrar">-</button>
                  <button @click="abrirModalMod(tablaMes[i - 1][j], tarea.tarea, tarea.id)" class="botonModificar">*</button>
                  <modalModificar :showModalMod="showModalMod" :fecha="fechaModalMod" :valor="valorMod" :id="idMod"
                    @cerrar-modal-mod="cerrarModalMod" @actualizarTareas="acutalizarDatos" />
                  <hr>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="modal">
      <div class="modal-content">

        <span @click="cerrarModal" class="close">&times;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, defineProps } from 'vue';
import celdaCalendario from '@/components/celdaCalendario.vue';
import modalVue from "@/components/modalVue.vue"
import modalModificar from './modalModificar.vue';
import axios from 'axios';
import { obtenerDatos, modificaDato } from "@/utils/crudAxios"


interface Tarea {
  id: number;
  tarea: string;
  fecha: string;
}
//Intento de que funcione




interface Props {
  mes?: number;
  anio?: number;
  cols?: string[];
  COLS?: number;
  ROWS?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cols: () => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  COLS: 7,
  ROWS: 6,
  anio: 2000,
  mes: 1
});

const tareas = ref<Tarea[]>([]);
const showModal = ref(false);
const showModalMod = ref(false);

const acutalizarDatos = async () => {
  try {
    tareas.value = await obtenerDatos("tareas")
  } catch (error) {
    console.error("Error" + error)
  }
}
const tareaDrag = ref<Tarea>({
  id: -1,
  tarea: "",
  fecha: ""
})

//Evento para poder hacer dragstart
const eventodrag = (tarea: Tarea) => {
  tareaDrag.value = tarea
  console.log(tareaDrag.value)
}

const eventoOver = (e: Event) => {
  e.preventDefault()
}
const eventoDrop = async (fechaDrop: string) => {
  tareaDrag.value.fecha = fechaDrop
  await modificaDato("tareas", tareaDrag.value.id, tareaDrag.value)

}
const fechaModalMod = ref<string>("")
const valorMod = ref<string>("")
const idMod = ref<number>(0)
const abrirModalMod = (fecha: string, valor: string, id: number) => {
  showModalMod.value = true;
  fechaModalMod.value = fecha
  valorMod.value = valor
  idMod.value = id
};

const cerrarModalMod = () => {
  showModalMod.value = false;
};



onMounted(async () => {
  acutalizarDatos()
});

const borrarTarea = async (idBorrar: number) => {
  try {
    const respuesta = await axios.delete(`http://localhost:3000/tareas/${idBorrar}`);
    if (respuesta) {
      alert("Se borró correctamente la tarea")
    } else {
      alert("No se borró correctamente")
    }
    acutalizarDatos()
  } catch (error) {
    console.error("Error al borrar la tarea", error)
  }
}


const anadevalorSecuencial = (numero: number, valor: string, celdas: string[][]) => {
  const fila = Math.floor(numero / props.COLS);
  const columna = numero % props.COLS;
  celdas[fila][columna] = valor;


};
const fechaModal = ref<string>("")
const abrirModal = (fecha: string) => {
  showModal.value = true;
  fechaModal.value = fecha
};

const cerrarModal = () => {
  showModal.value = false;
};

const tablaMes = computed(() => {
  const celdas = Array.from(Array(props.COLS).keys()).map(() =>
    Array.from(Array(props.ROWS + 1).keys()).map(() => '- '))
  const primerDia = new Date(`${props.anio}-${props.mes}-1`)
  const posicionPrimerDia = [6, 0, 1, 2, 3, 4, 5][primerDia.getDay()]
  const numDiasMes = new Date(props.anio, props.mes, 0).getDate()
  const rangoNumeros = [...Array(numDiasMes).keys()].map(i => i + posicionPrimerDia)
  //Recorremos el rango de números para añadir la fecha
  rangoNumeros.map((el, ind) => anadevalorSecuencial(el, `${ind + 1}/${props.mes}/${props.anio}`, celdas))
  return celdas
});


</script>

<style scoped>
.tarea {
  font-size: 14px;
}

.botonAgregar {
  font-family: monospace;
  background-color: #f3f7fe;
  color: #3b82f6;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 25px;
  transition: .3s;
}

.botonAgregar:hover {
  background-color: #3b82f6;
  box-shadow: 0 0 0 5px #3b83f65f;
  color: #fff;
}

.botonBorrar {
  font-family: monospace;
  background-color: #e38a8a;
  color: #ee0f0f;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 25px;
  transition: .3s;
}

.botonBorrar:hover {
  background-color: #ee0f0f;
  box-shadow: 0 0 0 5px #3b83f65f;
  color: #fff;
}

.botonModificar {
  font-family: monospace;
  background-color: #f0f6b2;
  color: #cfe600;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 25px;
  transition: .3s;
}

.botonModificar:hover {
  background-color: #e1ef5f;
  box-shadow: 0 0 0 5px #3b83f65f;
  color: #fff;
}

.modal {
  display: none;
  /* Cambia 'block' a 'none' para ocultar el modal por defecto */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: black;
}

body {
  margin: 0;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

th {
  background-color: #eee;
}

tr:first-of-type th {
  width: 100px;
}

tr:first-of-type th:first-of-type {
  width: 25px;
}

td {
  border: 1px solid #ccc;
  height: 2em;
  /* Ajusta la altura según tus preferencias */
  overflow: hidden;
}</style>
