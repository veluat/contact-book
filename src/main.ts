import './assets/scss/main.scss';

import Button from './components/button/button';

const app = document.getElementById('app')!;
const header = new Header(app);
header.render();
const submitButton = new Button('Сохранить', 'primary');
submitButton.render(app);
