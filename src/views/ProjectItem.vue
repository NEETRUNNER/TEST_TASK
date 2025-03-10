<script setup lang="ts">
import { useStore } from '@/stores/Store';
import { useTaskStore } from '@/stores/TaskStore';
import {type Task} from '@/stores/TaskStore';

import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import Draggable from 'vuedraggable';

    const store = useStore();
    const taskStore = useTaskStore();

    const {togglerFilter} = storeToRefs(store)
    const {taskData} = storeToRefs(taskStore);
    
    const searchByName = ref<string>('');
    const searchByStatus = ref<string>('');

    const searchInputData = ref<Task[]>([])

    onMounted(async () => {
        await taskStore.getTaskData();
    });

    const sortByType = (type: string): void => {
        let sortedData;

        switch(type) {

            case 'status':
                if (togglerFilter.value) {
                    sortedData = [...taskData.value].sort((a, b) => a.status.localeCompare(b.status))
                    store.toggleFilter(true, 'task')
                } else {
                    sortedData = [...taskData.value].sort((a, b) => b.status.localeCompare(a.status))
                    store.toggleFilter(false, 'task')
                }
                break

            case 'deadline':
                if (togglerFilter.value) {
                    sortedData = [...taskData.value].sort((a, b) => a.deadline.localeCompare(b.deadline))
                    store.toggleFilter(true, 'task')
                } else {
                    sortedData = [...taskData.value].sort((a, b) => b.deadline.localeCompare(a.deadline))
                    store.toggleFilter(false, 'task')
                }
                break

            default: 
                sortedData = [...taskData.value]
        }

        togglerFilter.value = !togglerFilter.value;

        taskData.value = sortedData;
    }

    const openModal = (): void => {
        store.toggleModal(true);
        store.toggleFilter(true, 'task')
    }

    const search = (type: string): void => {

        console.log(taskData.value)

        switch(type) {
            case 'searchByName': 
                searchInputData.value = taskData.value.filter(item => item.title.toLowerCase().includes(searchByName.value.trim().toLowerCase()));
                break;
            case 'searchByStatus':
                searchInputData.value = taskData.value.filter(item => item.status.toLowerCase().includes(searchByStatus.value.trim().toLowerCase()));
                break;
            default:
                searchInputData.value = [];
        }
    }

</script>

<template>
        <section class="project-item">
            <div class="project-item__container">

                <button @click="openModal" class="project-item-btn">
                    Додати завдання
                </button>

                <div class="table-container">
                    <table class="project-item__table">
                        
                        <thead>
                            <tr>
                                <th class="project-item__head"></th>
                                <th class="project-item__head">ID завдання</th>
                                <th class="project-item__head">Назва завдання</th>
                                <th class="project-item__head">Виконавець</th>
                                <th @click="sortByType('status')" class="project-item__head">Статус</th>
                                <th @click="sortByType('deadline')" class="project-item__head">Термін виконання</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th class="table-head"></th>
                                <th class="table-head"></th>
                                <th class="table-head__input">
                                    <input placeholder="Введіть назву завдання" class="table-input" v-model="searchByName" @input="search('searchByName')" type="text">

                                    <div class="table-head__search">
                                        <div v-show="searchByName.length !== 0" v-for="task in searchInputData" class="table-head__wrap">
                                            <div class="table-head__link">
                                                {{ task.title }}
                                            </div>
                                        </div>
                                    </div>
                                    
                                </th>
                                <th class="table-head"></th>
                                <th class="table-head__input">
                                    <input placeholder="Введіть статус завдання" class="table-input" v-model="searchByStatus" @input="search('searchByStatus')" type="text">
                                    <div class="table-head__search">
                                        <div v-show="searchByStatus.length !== 0" v-for="task in searchInputData" class="table-head__wrap">
                                            <div class="table-head__link">
                                                <p>{{ task.title }}</p>
                                                <p>{{ task.status }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th class="table-head"></th>
                            </tr>
                        </thead>
                        
                        <Draggable v-model="taskData" tag="tbody" item-key="id" handle=".drag-handle">
                            <template #item="{ element: task }">
                                <tr>
                                    <td class="project-item__col drag-handle" style="cursor: grab;">☰</td>
                                    <td class="project-item__col">{{ task.id }}</td>
                                    <td class="project-item__col">{{ task.title }}</td>
                                    <td class="project-item__col">{{ task.executor }}</td>
                                    <td class="project-item__col">{{ task.status }}</td>
                                    <td class="project-item__col">{{ task.deadline }}</td>
                                </tr>
                            </template>
                        </Draggable>

                    </table>
                    </div>
                </div>
        </section>
</template>

<style lang="scss">
    .project-item {
        &__container {
            margin: 30px auto;
            width: 75%;
        }

        &__table {
            width: 100%;
            margin-top: 30px;
            overflow: auto;
            border: 2px solid #000;
            border-collapse: collapse;
        }

        &__head {
            text-align: center;
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
            cursor: pointer;
            padding: 20px;
            border: 2px solid #000;
            border-collapse: collapse;
        }

        &__col {
            color: black;
            text-transform: uppercase;
            font-size: 0.7rem;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
            padding: 15px !important;
            text-align: center;
            cursor: auto;
            border-right: 2px solid #000;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
        }

        &-btn {
            padding: 10px;
            cursor: pointer;
            border: none;
            background-color: rgb(0, 204, 255);
            box-shadow: rgba(0, 0, 0, 0.05) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 12px;
            transition: all 0.5s ease;
            display: block;
            margin-left: auto;
            color: white;
        }
    }
</style>