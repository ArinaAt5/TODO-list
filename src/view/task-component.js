import { AbstractComponent } from "../framework/view/abstract-component.js";

function createTaskTemplate(task) {
  const { title, status } = task;
  return `
    <li class="task-item task--${status}">
      <div class="task-body">
        <p class="task-title">${title}</p>
      </div>
    </li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #task = null;

  constructor({ task }) {
    super();
    this.#task = task;
  }

  get template() {
    return createTaskTemplate(this.#task);
  }
}