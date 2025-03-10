<script setup lang="ts">

import { useProjectStore, type Project } from '@/stores/ProjectStore';
import { useStore } from '@/stores/Store';
import { storeToRefs } from 'pinia';

import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import slugify from 'slugify';

    const projectStore = useProjectStore();
    const store = useStore();

    const {projectData} = storeToRefs(projectStore);
    const {togglerFilter} = storeToRefs(store)

    const searchByName = ref<string>('');
    const searchByStatus = ref<string>('')

    const searchInputData = ref<Project[]>([])

    onMounted(async () => {
        await projectStore.getProjectData();
    });

    const sortByType = (type: string): void => {
        let sortedData: Project[];

        switch(type) {
            case 'id':

                if (togglerFilter.value) {
                    sortedData = [...projectData.value].sort((a, b) => (b.id as number) - (a.id as number))
                    store.toggleFilter(true, 'project')
                } else {
                    sortedData = [...projectData.value].sort((a, b) => (a.id as number) - (b.id as number))
                    store.toggleFilter(false, 'project')
                }

                break;
            case 'name':

                if (togglerFilter.value) {
                    sortedData = [...projectData.value].sort((a, b) => a.name.localeCompare(b.name))
                    store.toggleFilter(true, 'project')
                } else {
                    sortedData = [...projectData.value].sort((a, b) => b.name.localeCompare(a.name))
                    store.toggleFilter(false, 'project')
                }

                break
            case 'taskCount':

                if (togglerFilter.value) {
                    sortedData = [...projectData.value].sort((a, b) => a.taskCount - b.taskCount)
                    store.toggleFilter(true, 'project')
                } else {
                    sortedData = [...projectData.value].sort((a, b) => b.taskCount - a.taskCount)
                    store.toggleFilter(false, 'project')
                }

                break
            case 'status':
                if (togglerFilter.value) {
                    sortedData = [...projectData.value].sort((a, b) => a.status.localeCompare(b.status))
                    store.toggleFilter(true, 'project')
                } else {
                    sortedData = [...projectData.value].sort((a, b) => b.status.localeCompare(a.status))
                    store.toggleFilter(false, 'project')
                }
                break

            case 'createdAt':
                if (togglerFilter.value) {
                    sortedData = [...projectData.value].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    store.toggleFilter(true, 'project')
                } else {
                    sortedData = [...projectData.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    store.toggleFilter(false, 'project')
                }
                break
            default: 
                sortedData = [...projectData.value]
        }

        togglerFilter.value = !togglerFilter.value;

        projectData.value = sortedData;
    }
    
    const openModal = (): void => {
        store.toggleModal(true);
        store.toggleFilter(true, 'project')
    }

    const search = (type: string): void => {

        console.log(projectData.value)

        switch(type) {
            case 'searchByName': 
                searchInputData.value = projectData.value.filter(item => item.name.toLowerCase().includes(searchByName.value.trim().toLowerCase()));
                break;
            case 'searchByStatus':
                searchInputData.value = projectData.value.filter(item => item.status.toLowerCase().includes(searchByStatus.value.trim().toLowerCase()));
                break;
            default:
                searchInputData.value = [];
        }
    }

</script>

<template>
    <section class="projects">
        <div class="projects-container">

            <button @click="openModal" class="projects-btn">
                Додати проект
            </button>
            
            <div class="table-container">
            <table class="projects-table">
                
                <thead>
                    <tr>
                        <th @click="sortByType('id')" class="table-head">ID проекту</th>
                        <th @click="sortByType('name')" class="table-head">Назва проекту</th>
                        <th @click="sortByType('taskCount')" class="table-head">Кількість завдань</th>
                        <th @click="sortByType('status')" class="table-head">Статус</th>
                        <th @click="sortByType('createdAt')" class="table-head">Дата створення</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th class="table-head"></th>
                        <th class="table-head__input">
                            <input placeholder="Введіть назву проекта" class="table-input" v-model="searchByName" @input="search('searchByName')" type="text">

                            <div class="table-head__search">
                                <div v-show="searchByName.length !== 0" v-for="project in searchInputData" class="table-head__wrap">
                                    <RouterLink class="table-head__link" :to="`/projects/${slugify(project.name, { lower: true, locale: 'ru'})}`">
                                        {{ project.name }}
                                    </RouterLink>
                                </div>
                            </div>
                            
                        </th>
                        <th class="table-head"></th>
                        <th class="table-head__input">
                            <input placeholder="Введіть статус проекта" class="table-input" v-model="searchByStatus" @input="search('searchByStatus')" type="text">

                            <div class="table-head__search">
                                <div v-show="searchByStatus.length !== 0" v-for="project in searchInputData" class="table-head__wrap">
                                    <div class="table-head__link">
                                        <p>{{ project.name }}</p>
                                        <p>{{ project.status }}</p>
                                    </div>
                                </div>
                            </div>
                            
                        </th>
                        <th class="table-head"></th>
                    </tr>
                </thead>
                <tbody>
                    <RouterLink :to="`/projects/${slugify(project.name, { lower: true, locale: 'ru'})}`" v-for="project in projectData" :key="project.id" custom v-slot="{navigate}">
                        <tr class="projects-table__tr" @click="navigate">
                            <td class="projects-table__col">{{ project.id }}</td>
                            <td class="projects-table__col">{{ project.name }}</td>
                            <td class="projects-table__col">{{ project.taskCount }}</td>
                            <td class="projects-table__col">{{ project.status }}</td>
                            <td class="projects-table__col">{{ project.createdAt }}</td>
                        </tr>
                    </RouterLink>
                </tbody>
            </table>
            </div>

        </div>
    </section>
</template>

<style lang="scss">
    .table {
        &-container {
            width: 100%;
            overflow: auto;
        }

        &-input {
            background-color: rgba(5, 6, 15, 0.04);
            border-radius: 0.5rem;
            padding: 0 1rem;
            border: 2px solid transparent;
            font-size: 1rem;
            transition: border-color 0.3s cubic-bezier(0.25, 0.01, 0.25, 1),
                        color 0.3s cubic-bezier(0.25, 0.01, 0.25, 1),
                        background 0.2s cubic-bezier(0.25, 0.01, 0.25, 1);
        }

        &-head {
            position: relative;
            text-align: center;
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
            cursor: pointer;
            padding: 20px;
            border: 2px solid rgb(0, 0, 0);
            border-collapse: collapse;

        &__link {
            text-transform: uppercase;
            text-decoration: none;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            font-family: "Raleway";
            width: 100%;
            display: block;

            &:hover {
                background: #000;
            }
        }

        &__search {
            position: absolute;
            width: 100%;
            background: #b8b8b8;
            display: flex;
            flex-direction: column;
            row-gap: 0.5rem;
            max-height: 200px;
            overflow-x: auto;
        }

        &__input {
            position: relative;
            text-align: center;
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
            cursor: pointer;
            padding: 20px 0;
            border: 2px solid rgb(0, 0, 0);
            border-collapse: collapse;
        }
    }
}

    .projects {
        &-container {
            width: 75%;
            margin: 30px auto;
        }
        &-table {
            width: 100%;
            margin-top: 30px;
            overflow: auto;
            border: 2px solid rgb(0, 0, 0);
            border-collapse: collapse;

            &__col {
                color: black;
                text-transform: uppercase;
                font-size: 0.7rem;
                font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
                padding: 15px !important;
                text-align: center;
                border-right: 2px solid rgb(0, 0, 0);
                border-top: 2px solid rgb(0, 0, 0);
                border-bottom: 2px solid rgb(0, 0, 0);
            }

            &__tr {
                &:hover {
                    background-color: #cecece;
                }
            }
        }

        &-btn {
            padding: 10px;
            cursor: pointer;
            border: 0;
            background-color: rgb(0, 204, 255);
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 12px;
            transition: all 0.5s ease;
            display: block;
            margin-left: auto;
            color: white;
        }
    }

    .p-datatable {
        &-column-title {
            color: black;
            text-transform: uppercase;
            font-size: 0.7rem;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        }

        &-column-header-content {
            column-gap: 15px !important;
        }
    }

    tr {
        cursor: pointer;
    }

    @media screen and (max-width: 992px) {
        .table-head {
            font-size: 15px;
            width: 100%;
            padding-left: 30px;
            padding-right: 30px;
            white-space: nowrap;
        }
    }

</style>


<!-- Как это работает?
Используем custom-режим RouterLink.

Он не рендерит <a>, а просто передаёт navigate — функцию для перехода.
v-slot="{ navigate }"

Позволяет получить метод navigate, который программно выполняет переход по маршруту.
Вешаем @click="navigate" на <tr>, чтобы при клике на строку переходить по ссылке.

Добавляем cursor: pointer;

Чтобы визуально показывать, что строка кликабельна.
Что будет в результате?
🔹 Вся строка <tr> становится кликабельной, и при нажатии на неё Vue Router отправляет пользователя на страницу проекта (/projects/${project.id}), но без нарушения HTML-структуры.

❗ Важно: Такой подход работает, потому что <RouterLink> в custom-режиме не вставляет лишний HTML, а просто передаёт функцию navigate. -->