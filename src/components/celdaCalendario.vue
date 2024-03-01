<!-- celdaCalendario.vue -->
<template>
  <div class="celda-calendario">
    <!--Fecha recogida-->
    <p class="fecha">{{ props.valor }}</p>
  </div>
</template>

<style scoped>
.celda-calendario {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

  .fecha {
  font-size: 12px;
  margin: 0;
}
</style>


<script setup lang="ts">
import { defineProps } from 'vue';

//Creamos la propiedad props que tiene el valor fecha 
interface Props {
  valor?: string;
}

//Creamos la variable que recoge este props creado anteriormente.
const props = defineProps<Props>();

</script>