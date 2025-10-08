import { AbstractComponent } from "../framework/view/abstract-component.js";

function createTaskBoardTemplate() {
  return `<div class="desk"></div>`;
}

export default class TaskBoardComponent extends AbstractComponent {
  get template() {
    return createTaskBoardTemplate();
  }
}