import IMask from 'imask';

export function initPhoneMask(element: HTMLInputElement): void {

  IMask(element, {
    mask: '+{7} (000) 000-00-00',
    lazy: true,
    placeholderChar: ' ',
    overwrite: true,
    autofix: true,
  });
}