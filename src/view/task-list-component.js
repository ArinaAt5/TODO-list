import { AbstractComponent } from "../framework/view/abstract-component.js";

function createTaskListTemplate(label) {
  return `
    <div class="task-list">
      <h2>${label}</h2>
      <ul class="task-container"></ul>
    </div>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  #label = null;
  #status = null;

  constructor({ status, label, onTaskDrop }) {
    super();
    this.#label = label;
    this.#status = status;
    this.#setDropHandler(onTaskDrop);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;
    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('application/x-task-id');
      const li = event.target.closest('.task-item');
      const beforeTaskId = li ? li.getAttribute('data-id') : null;
      onTaskDrop(taskId, this.#status, beforeTaskId);
    });
  }

  get template() {
    return createTaskListTemplate(this.#label);
  }

  get tasksContainer() {
    return this.element.querySelector(".task-container");
  }
}