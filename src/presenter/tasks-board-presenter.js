import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import EmptyTaskListComponent from "../view/empty-task-list-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel } from "../const.js";

function getTasksByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status);
}

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }


  get tasks() {
    return this.#tasksModel.tasks;
  }

  init() {

    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderBoard();
  }

  createTask() {
    const input = document.querySelector("#add-task");
    const taskTitle = input ? input.value.trim() : "";
    if (!taskTitle) {
      return;
    }
    this.#tasksModel.addTask(taskTitle);
    input.value = "";
  }


  #renderBoard() {
    // Перечисляем все колонки
    const STATUSES = [Status.BACKLOG, Status.PROCESSING, Status.DONE, Status.BASKET];

    STATUSES.forEach((status) => {
      const listComponent = new TaskListComponent({
        status,
        label: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this)
      });

      render(listComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = getTasksByStatus(this.tasks, status);

      if (tasksForStatus.length === 0) {
        this.#renderEmptyState(listComponent.tasksContainer);
      } else {
        tasksForStatus.forEach((task) => this.#renderTask(listComponent.tasksContainer, task));
      }

      // Для корзины добавляем кнопку очистки
      if (status === Status.BASKET) {
        this.#renderClearButton(listComponent.element, tasksForStatus.length === 0);
      }
    });
  }

  #renderTask(container, task) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderClearButton(container, isDisabled) {
    const clearButton = new ClearBasketButtonComponent();
    render(clearButton, container);

    // Делаем кнопку неактивной, если корзина пуста
    clearButton.element.disabled = Boolean(isDisabled);

    // Обработчик клика по кнопке "Очистить корзину"
    clearButton.element.addEventListener("click", () => {
      if (!clearButton.element.disabled) {
        this.#tasksModel.clearBasket();
      }
    });
  }

  #renderEmptyState(container) {
    const emptyComponent = new EmptyTaskListComponent();
    render(emptyComponent, container);
  }

  // Очистка содержимого доски (перерисовка)
  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = "";
  }

  // Обработчик подписки на изменения модели
  #handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }

  #handleTaskDrop(taskId, newStatus, beforeTaskId) {
  this.#tasksModel.moveTask(taskId, newStatus, beforeTaskId);
  }
}