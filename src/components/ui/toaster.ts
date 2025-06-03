import type { ToastConfig } from '@/types';

export class Toaster {
  private readonly container: HTMLElement;
  private toastDuration = 3000;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toaster-container';
    document.body.appendChild(this.container);
  }

  private getIconSvg(type: string): string {
    const icons = {
      success: 'icon-success',
      error: 'icon-error'
    };
    const iconId = icons[type as keyof typeof icons] || 'icon-success';

    return `
      <svg class="toaster__icon">
        <use href="/sprite.svg#${iconId}"></use>
      </svg>
    `;
  }

  public show(config: ToastConfig): void {
    const toast = document.createElement('div');
    toast.className = `toaster toaster--${config.type}`;

    toast.innerHTML = `
      ${this.getIconSvg(config.type)}
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
}