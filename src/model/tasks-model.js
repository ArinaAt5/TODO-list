import { tasks } from "../mock/task.js";
import { Status } from "../const.js";
import { generateID } from "../utils.js";

export default class TasksModel {
  #boardtasks = tasks;
  #observers = [];

  get tasks() {
    return this.#boardtasks;
  }

  /**
   * Возвращает задачи по статусу
   * @param {string} status
   * @returns {Array}
   */
  getTasksByStatus(status) {
    return this.#boardtasks.filter((task) => task.status === status);
  }

  /**
   * Добавляет новую задачу в бэклог
   * @param {string} title
   * @returns {object} созданная задача
   */
  addTask(title) {
    const newTask = {
      id: generateID(),
      title,
      status: Status.BACKLOG,
    };
    this.#boardtasks.push(newTask);
    this.#notify();
    return newTask;
  }

  /**
   * Обновляет статус задачи
   * @param {string} taskId
   * @param {string} newStatus
   */
  updateTaskStatus(taskId, newStatus) {
    const task = this.#boardtasks.find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.#notify();
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
        // если не нашли целевую задачу — добавляем в конец нужной колонки
        insertIndex = this.#lastIndexOfStatus(newStatus) + 1;
      }
    } else {
      // добавить в конец колонки newStatus
      insertIndex = this.#lastIndexOfStatus(newStatus) + 1;
    }

    // Гарантия валидного диапазона
    if (insertIndex < 0) insertIndex = 0;
    if (insertIndex > arr.length) insertIndex = arr.length;

    arr.splice(insertIndex, 0, task);
    this.#notify();
  }


  clearBasket() {
    this.#boardtasks = this.#boardtasks.filter(
      (t) => t.status !== Status.BASKET
    );
    this.#notify();
  }


  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  #notify() {
    this.#observers.forEach((observer) => observer());
  }


  #lastIndexOfStatus(status) {
    let last = -1;
    for (let i = 0; i < this.#boardtasks.length; i++) {
      if (this.#boardtasks[i].status === status) last = i;
    }
    return last;
  }
}