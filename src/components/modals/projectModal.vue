<script setup lang="ts">
import { useProjectStore } from '@/stores/ProjectStore';
import { useStore } from '@/stores/Store';
import { storeToRefs } from 'pinia';

import { useForm } from 'vee-validate';
import * as yup from "yup";

const store = useStore();
const projectStore = useProjectStore();

const { togglerModal, togglerType } = storeToRefs(store);
const { projectData } = storeToRefs(projectStore)

  const { handleSubmit, values, errors, defineField } = useForm({
      validationSchema: yup.object({
        title: yup.string().required("Назва проекту обов'язкова")
    }),
  });

  const addProject = handleSubmit(async () => {

    const newProject = {
      id: projectData.value.length + 1,
      name: title.value,
      taskCount: 0,
      status: '-',
      createdAt: new Date().toISOString().split('T')[0],
      descr: descr.value
    }
    
    projectData.value.push(newProject)

    if (title.value.length !== 0) {
      store.toggleModal(false)
    }
  });

  // Если создавать стейт специально для таких валидаций, то это не имеет смысл, создаём нужные нам стейты для валидации с помощью defineField, и только в таком случае всё работает корректно, так мы связываем 
  const [title, titleAttrs] = defineField("title");
  const [descr, descrAttrs] = defineField("descr");
</script>

<template>
  <transition name="fade">
    <div v-if="togglerModal && togglerType == 'project'" class="modal-overlay" @click.self="store.toggleModal(false)">
      <form @submit.prevent="addProject" class="modal">
        <div class="modal-header">
          <h2 class="modal-h2">Створити проект</h2>
          <button @click="store.toggleModal(false)" class="exit-button">&times;</button>
        </div>
        <div class="modal-content">

          <div class="modal-block">
            <label class="modal-label">Назва проекту</label>
            <input v-model="title" type="text" class="modal-input" placeholder="Введіть назву" />
            <div class="modal-error">{{ errors.title }}</div>
          </div>

          <div class="modal-label">Опис проекту</div>
          <textarea v-model="descr" class="modal-textarea" placeholder="Введіть опис"></textarea>
          <div class="modal-error">{{ errors.descr }}</div>
        </div>

        <div class="modal-footer">
          <button @click="store.toggleModal(false)" class="modal-button secondary">Отменить</button>
          <button type="submit" class="modal-button primary">Добавить</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<!-- Вместо v-bind:value="projectDescr" @input="projectDescr = $event.target.value" привязки value к projectDescr и создании обработчика input,
проще так <input v-model="projectName" type="text" class="modal-input" placeholder="Введите название" /> -->

<style lang="scss">
  .modal-block {
    display: flex;
    flex-direction: column;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: #fff;
    width: 100%;
    width: 400px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: scaleIn 0.3s ease-in-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  .exit-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #888;
  }

  .modal-label {
    font-size: 14px;
    font-weight: bold;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin-top: 20px;
  }

  .modal-input, .modal-textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 0.5rem;
  }

  .modal-textarea {
    min-height: 100px;
    resize: vertical;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
  }

  .modal-button {
    width: 40%;
    padding: 10px;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  .primary {
    background-color: #4CAF50;
    color: white;
    &:disabled {
      background-color: #535353;
    }
  }

  .secondary {
    background-color: #ddd;
    color: #333;
  }

  .modal-h2 {
      font-weight: bold;
      font-family:Verdana, Geneva, Tahoma, sans-serif;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 480px) {
    .modal {
      max-width: 250px;
    }
  }
</style>