import {initPhoneMask} from '@/utils/phone-mask.ts'
import {App} from '@core/app.ts'

document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone-number') as HTMLInputElement;
  if (phoneInput) {
    initPhoneMask(phoneInput);
  }

  new App();
});