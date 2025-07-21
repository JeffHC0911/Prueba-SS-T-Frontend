<template>
  <div class="card-survey">
    <h3 class="card-title">{{ props.survey.title }}</h3>
    <p class="card-description">{{ props.survey.description || 'Sin descripción' }}</p>
    <div class="card-footer">
      <small>Creada: {{ formatDate(props.survey.created_at) }}</small>
      <small>ID: {{ props.survey.survey_id }}</small>
    </div>
    <div class="card-actions">
      <button @click="$emit('edit', props.survey)" class="btn btn-edit">Editar</button>
      <button @click="$emit('delete', props.survey)" class="btn btn-delete">Eliminar</button>
      <button @click="$emit('view', props.survey)" class="btn btn-view">Ver</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { defineProps } from 'vue'

interface Survey {
  title: string
  description: string
  created_at: string
  survey_id: string
}

const props = defineProps<{ survey: Survey }>()

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>

<style scoped>
.card-survey {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: box-shadow 0.25s ease;
}
.card-survey:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
.card-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #333;
}
.card-description {
  flex-grow: 1;
  color: #666;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #999;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.btn {
  padding: 0.5em 1em;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.btn-edit {
  background-color: #4CAF50;
  color: white;
}
.btn-edit:hover {
  background-color: #45a049;
}
.btn-delete {
  background-color: #f44336;
  color: white;
}
.btn-delete:hover {
  background-color: #da190b;
}
.btn-view {
  background-color: #2196F3;
  color: white;
}
.btn-view:hover {
  background-color: #0b7dda;
}
</style>
