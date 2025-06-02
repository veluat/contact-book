import type {Group} from '@/types'

export class Dropdown {
  private readonly element: HTMLElement;
  private items: Group[] = [];
  private onSelectCallback?: (groupId: string) => void;
  private selectedItem: Group | null = null;
  private dropdownMenu: HTMLElement;
  private isOpen = false;

  constructor(selector: string) {
    this.element = document.querySelector(selector) as HTMLElement;
    if (!this.element) throw new Error(`Element with selector ${selector} not found`);

    this.element.innerHTML = `
      <div class="dropdown__selected"></div>
      <div class="dropdown__menu"></div>
      <svg class="dropdown__chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.885 8.29498L12.295 12.875L7.70498 8.29498L6.29498 9.70498L12.295 15.705L18.295 9.70498L16.885 8.29498Z" fill="black"/>
      </svg>
    `;

    this.dropdownMenu = this.element.querySelector('.dropdown__menu')!;

    this.init();
  }

  private init(): void {
    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', () => this.close());
  }

  public bind(event: 'change', callback: (groupId: string) => void): void {
    if (event === 'change') {
      this.onSelectCallback = callback;
    }
  }

  public dataItems(items: Group[]): void {
    this.items = items;
    this.render();

    if (items.length > 0 && !this.selectedItem) {
      this.selectItem(items[0].id);
    }
  }

  private render(): void {
    this.dropdownMenu.innerHTML = '';

    if (this.items.length === 0) {
      const emptyOption = document.createElement('div');
      emptyOption.className = 'dropdown__item dropdown__item--empty';
      emptyOption.textContent = 'Нет доступных групп';
      this.dropdownMenu.appendChild(emptyOption);
      return;
    }

    this.items.forEach(item => {
      const option = document.createElement('div');
      option.className = 'dropdown__item';
      option.textContent = item.name;
      option.dataset.value = item.id;
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectItem(item.id);
      });
      this.dropdownMenu.appendChild(option);
    });
  }

  public selectItem(groupId: string): void {
    const selectedGroup = this.items.find(item => item.id === groupId);
    if (!selectedGroup) return;

    this.selectedItem = selectedGroup;
    const selectedElement = this.element.querySelector('.dropdown__selected')!;
    selectedElement.textContent = selectedGroup.name;

    if (this.onSelectCallback) {
      this.onSelectCallback(groupId);
    }
    this.close();
  }

  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.element.classList.add('dropdown--open');
    this.dropdownMenu.style.maxHeight = `${this.items.length * 40}px`;
  }

  private close(): void {
    this.isOpen = false;
    this.element.classList.remove('dropdown--open');
    this.dropdownMenu.style.maxHeight = '0';
  }

}