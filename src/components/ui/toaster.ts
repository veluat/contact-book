import type { ToastConfig } from '@/types';

export class Toaster {
  private readonly container: HTMLElement;
  private toastDuration = 3000;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toaster-container';
    document.body.appendChild(this.container);
  }

  public show(config: ToastConfig): void {
    const toast = document.createElement('div');
    toast.className = `toaster toaster--${config.type}`;

    toast.innerHTML = `
      <img class="toaster__icon" src="../assets/icons/${this.getIconName(config.type)}.svg" alt="${config.type}">
      <div class="toaster__message">${config.message}</div>
    `;

    toast.classList.add('toaster--show');

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('toaster--show');
      toast.classList.add('toaster--hide');

      toast.addEventListener('animationend', (e) => {
        if (e.animationName === 'fadeOut') {
          toast.remove();
        }
      });
    }, config.duration || this.toastDuration);
  }

  private getIconName(type: string): string {
    const icons = {
      success: 'done',
      error: 'error'
    };
    return icons[type as keyof typeof icons] || 'done';
  }
}