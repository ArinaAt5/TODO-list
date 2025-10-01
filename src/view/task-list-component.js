import { createElement } from "../framework/render.js";

function createTaskListComponentTemplate(title) {
  return `<div class="task-list">
      <h2>${title}</h2>
    </div>`;
}

export default class TaskListComponent {
  constructor(title) {
    this.title = title;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.title);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  getTasksContainer() {
    // Контейнер для задач
    if (!this.tasksContainer) {
      this.tasksContainer = document.createElement("ul");
      this.element.appendChild(this.tasksContainer);
    }
    return this.tasksContainer;
  }

  removeElement() {
    this.element = null;
  }
}