<script setup lang="ts">
import calendarioMes from './components/calendarioMes.vue';
import { ref } from 'vue'
//Variables para guardar mes y año del calendario 
const mes = ref(3)
const anio = ref(2024)
</script>
<template>
    <div class="container mt-5">
      <div>Pantalla principal</div>
      <div class="mb-3">
        <input type="number" v-model="mes" min="1" max="12" class="form-control"/>
        <input type="number" v-model="anio" min="2000" max="2050" class="form-control"/>
      </div>
      <calendarioMes :mes="mes" :anio="anio" />
    </div>
  </template>

<style>

</style>