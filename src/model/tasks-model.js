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
   * Очищает корзину (удаляет задачи со статусом basket)
   */
  clearBasket() {
    this.#boardtasks = this.#boardtasks.filter((t) => t.status !== Status.BASKET);
    this.#notify();
  }

  // --- Observer API ---
  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  #notify() {
    this.#observers.forEach((observer) => observer());
  }
}