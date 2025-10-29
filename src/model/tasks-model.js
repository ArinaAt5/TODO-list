import Observable from '../framework/observable.js';

import { Status, UpdateType, UserAction } from "../const.js"; 
import { generateID } from "../utils.js";


export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  /**
   * Инициализирует модель, загружая задачи с сервера.
   */
  async init() {
    try {

      const tasks = await this.#tasksApiService.tasks;
      this.#boardtasks = tasks;
    } catch (err) {
      this.#boardtasks = [];
      console.error("Ошибка при загрузке задач:", err); 
    }

    this._notify(UpdateType.INIT); 
  }



  get tasks() {
    return this.#boardtasks;
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter((task) => task.status === status);
  }

  /**
   * Асинхронно добавляет новую задачу, отправляя её на сервер
   * @param {string} title
   * @returns {object} созданная задача
   */
  async addTask(title) { 
    const newTask = {
      title,
      status: Status.BACKLOG, 
    };

    try {
      // Отправляем задачу на сервер
      const createdTask = await this.#tasksApiService.addTask(newTask); 
      
      // Обновляем локальные данные, добавляя ответ сервера (включая id)
      this.#boardtasks.push(createdTask); 
      
      // Уведомляем об успешном добавлении
      this._notify(UserAction.ADD_TASK, UpdateType.MINOR, createdTask);
      
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);

      throw err;
    }
  }


async updateTaskStatus(taskId, newStatus) {
  const task = this.#boardtasks.find(task => task.id === taskId);
  if (!task) return;

  const previousStatus = task.status;
  task.status = newStatus;

  try {
    const updatedTask = await this.#tasksApiService.updateTask(task);
    Object.assign(task, updatedTask);
    this._notify(UserAction.UPDATE_TASK, task);
  } catch (err) {
    console.error('Ошибка при обновлении статуса задачи на сервер:', err);
    task.status = previousStatus; // откат, если ошибка
    throw err;
  }
}


  moveTask(taskId, newStatus, beforeTaskId = null) {
    const arr = this.#boardtasks;
    const fromIndex = arr.findIndex((t) => t.id === taskId);
    if (fromIndex === -1) return;

    const [task] = arr.splice(fromIndex, 1);
    task.status = newStatus;

    let insertIndex;
    if (beforeTaskId) {
      insertIndex = arr.findIndex((t) => t.id === beforeTaskId);
      if (insertIndex === -1) {
        insertIndex = this.#lastIndexOfStatus(newStatus) + 1;
      }
    } else {
      insertIndex = this.#lastIndexOfStatus(newStatus) + 1;
    }

    if (insertIndex < 0) insertIndex = 0;
    if (insertIndex > arr.length) insertIndex = arr.length;

    arr.splice(insertIndex, 0, task);
    this._notify(UpdateType.MINOR);
  }

  clearBasket() {
    this.#boardtasks = this.#boardtasks.filter(
      (t) => t.status !== Status.BASKET
    );
    this._notify(UpdateType.MAJOR); 
  }

  #lastIndexOfStatus(status) {
    let last = -1;
    for (let i = 0; i < this.#boardtasks.length; i++) {
      if (this.#boardtasks[i].status === status) last = i;
    }
    return last;
  }

  async clearBasketTasks() {
  const basketTasks = this.#boardtasks.filter(task => task.status === 'basket');

  try {
    await Promise.all(basketTasks.map(task => this.#tasksApiService.deleteTask(task.id)));
    this.#boardtasks = this.#boardtasks.filter(task => task.status !== 'basket');
    this._notify(UserAction.DELETE_TASK, { status: 'basket' });
  } catch (err) {
    console.error('Ошибка при удалении задач из корзины на сервере:', err);
    throw err;
  }
}

hasBasketTasks() {
  return this.#boardtasks.some(task => task.status === 'basket');
}

}