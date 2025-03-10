<script setup lang="ts">
import { useStore } from '@/stores/Store';
import { useTaskStore } from '@/stores/TaskStore';
import { storeToRefs } from 'pinia';

import { useForm } from "vee-validate";
import * as yup from "yup";

const store = useStore();
const taskStore = useTaskStore();

const { togglerModal, togglerType } = storeToRefs(store);
const { taskData } = storeToRefs(taskStore)

  const { handleSubmit, values, errors, defineField } = useForm({
    validationSchema: yup.object({
      title: yup.string().required("Назва завдання обов'язкова"),
      executor: yup.string().required("Виконавець обов'язковий"),
      status: yup.string().required("Статус обов'язковий"),
      deadline: yup.string().required("Термін виконання обов'язковий"),
    }),
  });

  const addTask = handleSubmit(async () => {

      const newTask = {
        id: taskData.value.length + 1,
        title: title.value,
        executor: executor.value,
        status: status.value,
        deadline: deadline.value
      }
      
      taskData.value.push(newTask)

      if (title.value.length !== 0) {
        store.toggleModal(false)
      }
  });

  // Если создавать стейт специально для таких валидаций, то это не имеет смысл, создаём нужные нам стейты для валидации с помощью defineField, и только в таком случае всё работает корректно, так мы связываем 
  const [title, emailAttrs] = defineField("title");
  const [executor, executorAttrs] = defineField("executor");
  const [status, statusAttrs] = defineField("status");
  const [deadline, deadlineAttrs] = defineField("deadline");

</script>

<template>
  <transition name="fade">
    <div v-if="togglerModal && togglerType === 'task'" class="modal-overlay" @click.self="store.toggleModal(false)">
      <form @submit.prevent="addTask" class="modal">
        <div class="modal-header">
          <h2 class="modal-h2">Створити завдання</h2>
          <button @click="store.toggleModal(false)" class="exit-button">&times;</button>
        </div>
        
        <div class="modal-content">
        <div class="modal-block">

          <div class="modal-label">Назва завдання</div>
          <input v-model="title" type="text" class="modal-input" placeholder="Введіть назву завдання" />
          <div class="modal-error">{{ errors.title }}</div>


        <div class="modal-label">Виконавець</div>
          <input v-model="executor" type="text" class="modal-input" placeholder="Введіть виконавця" />
          <div class="modal-error">{{ errors.executor }}</div>


        <div class="modal-label">Статус</div>
          <input v-model="status" type="text" class="modal-input" placeholder="Введіть статус" />
          <div class="modal-error">{{ errors.status }}</div>


        <div class="modal-label">Термін виконання</div>
          <input v-model="deadline" type="text" class="modal-input" placeholder="Введіть термін виконання" />
          <div class="modal-error">{{ errors.deadline }}</div>

        </div>
        </div>

        <div class="modal-footer">
          <button @click="store.toggleModal(false)" class="modal-button secondary">Отменить</button>
          <button class="modal-button primary">Добавить</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<!-- Вместо v-bind:value="projectDescr" @input="projectDescr = $event.target.value" привязки value к projectDescr и создании обработчика input,
проще так <input v-model="projectName" type="text" class="modal-input" placeholder="Введите название" /> -->

<style lang="scss">
  .modal-error {
    color: red;
    font-family: Raleway;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin-top: 5px;
  }
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