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

  constructor({ status, label }) {
    super();
    this.#label = label;
  }

  get template() {
    return createTaskListTemplate(this.#label);
  }

  get tasksContainer() {
    return this.element.querySelector(".task-container");
  }
}