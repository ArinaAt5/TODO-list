import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import TaskBoardComponent from "../view/task-board-component.js";
import ClearBasketButtonComponent from "../view/clear-basket-button-component.js";
import EmptyTaskListComponent from "../view/empty-task-list-component.js";
import { render } from "../framework/render.js";
import { Status, StatusLabel } from "../const.js";
import LoadingView from "../view/loading-view.js";

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    // Подписка на изменения модели
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  // === Инициализация ===
  async init() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    const loadingView = new LoadingView();
    render(loadingView, this.#tasksBoardComponent.element);

    await this.#tasksModel.init();

    // Убираем компонент загрузки
    loadingView.element.remove();
    loadingView.removeElement();

    this.#clearBoard();
    this.#renderBoard();
  }

  // === Создание новой задачи ===
  async createTask() {
    const input = document.querySelector("#add-task");
    const taskTitle = input?.value.trim();
    if (!taskTitle) return;

    try {
      await this.#tasksModel.addTask(taskTitle);
      input.value = "";
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
    }
  }

  // === Отрисовка всей доски ===
  #renderBoard() {
    const STATUSES = [Status.BACKLOG, Status.PROCESSING, Status.DONE, Status.BASKET];

    STATUSES.forEach((status) => {
      const listComponent = new TaskListComponent({
        status,
        label: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this),
      });

      render(listComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = this.#tasksModel.getTasksByStatus(status);

      if (tasksForStatus.length === 0) {
        this.#renderEmptyState(listComponent.tasksContainer);
      } else {
        tasksForStatus.forEach((task) =>
          this.#renderTask(listComponent.tasksContainer, task)
        );
      }

      // Добавляем кнопку очистки корзины
      if (status === Status.BASKET) {
        this.#renderClearButton(listComponent.element, tasksForStatus.length === 0);
      }
    });
  }

  #renderTask(container, task) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderEmptyState(container) {
    const emptyComponent = new EmptyTaskListComponent();
    render(emptyComponent, container);
  }

  // === Кнопка "Очистить корзину" ===
  #renderClearButton(container, isDisabled) {
    const clearButton = new ClearBasketButtonComponent();
    render(clearButton, container);

    clearButton.element.disabled = Boolean(isDisabled);

    clearButton.element.addEventListener("click", async () => {
      if (clearButton.element.disabled) return;

      try {
        await this.#tasksModel.clearBasketTasks(); // исправлено
      } catch (err) {
        console.error("Ошибка при очистке корзины:", err);
      }
    });
  }

  // === Очистка и перерисовка ===
  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = "";
  }

  #handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }

  // === Обновление статуса при DnD ===
  #handleTaskDrop = async (taskId, newStatus, beforeTaskId) => {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Ошибка при обновлении статуса задачи:", err);
    }
  };
}