import { AbstractComponent } from '../framework/view/abstract-component.js';

function createLoadingTemplate() {
  return `<p class="board_no-tasks">Подождите, идет загрузка..</p>`;
}

export default class LoadingView extends AbstractComponent {
  get template() {
    return createLoadingTemplate();
  }
}