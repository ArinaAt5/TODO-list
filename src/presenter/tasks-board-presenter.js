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
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      const tasksListComponent = new TaskListComponent({
        status,
        label: StatusLabel[status],
      });

      render(tasksListComponent, this.#tasksBoardComponent.element);
      this.#renderTasksList(tasksListComponent, status);
    });
  }

  #renderTasksList(tasksListComponent, status) {
    const tasksForStatus = getTasksByStatus(this.#boardTasks, status);

    if (tasksForStatus.length === 0) {
      this.#renderEmptyState(tasksListComponent.tasksContainer);
      return;
    }

    tasksForStatus.forEach((task) => {
      this.#renderTask(task, tasksListComponent.tasksContainer);
    });

    if (status === Status.BASKET) {
      this.#renderClearButton(tasksListComponent.element);
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderClearButton(container) {
    const clearButton = new ClearBasketButtonComponent();
    render(clearButton, container);
  }

  #renderEmptyState(container) {
    const emptyComponent = new EmptyTaskListComponent();
    render(emptyComponent, container);
  }
}