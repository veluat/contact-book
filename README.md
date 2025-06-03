# 🔧 Требуется архитектурный рефакторинг (Vite + Native TS)

## 🧩 Разделение модулей

- **`app.ts`** → разбить на отдельные модули для:
    - Соблюдения принципов **SOLID**
    - Повышения **модульности ES6**
    - Улучшения поддерживаемости кода

## 📱 Медиа-запросы

- Вынести все стилевые медиа-запросы в:
  ```bash
  styles/                               
     └── base/                           
          └── _media.scss                           
  ```

🌳 Структура проекта на данный момент (Native TS + Vite + SCSS):

  ```bash
├── public/                                 # Статические файлы (sprite.svg, favicon.ico)
│
├── src/
│ ├── assets/                               # Ресурсы
│ │     ├── fonts/                          # Шрифты (woff2)
│ │     └── icons/                          # SVG-иконки
│ │
│ ├── components/                           # Компоненты (Native TS Web Components)
│ │     └── ui/                             # UI-кит с кастомными элементами
│ │         ├── dropdown.ts                 # Class Dropdown (Группы/Выбор)
│ │         └── toaster.ts                  # Singleton Service Class Тостер-уведомления
│ │
│ ├── core/                                 # Бизнес-логика (чистый TS)
│ │     ├── app.ts                          # Инициализация приложения 
│ │     └── services/                       # Сервисы с DI
│ │           ├── contact.service.ts        # CRUD контактов
│ │           ├── group.service.ts          # Работа с группами
│ │           └── storage.service.ts        # # Обертка над localStorage
│ │
│ ├── styles/                               # SCSS-архитектура (по БЭМ)
│ │     ├── base/                           # _reset.scss, _variables.scss, _fonts.scss
│ │     ├── components/                     # Стили UI-компонентов
│ │     ├── layouts/                        # Глобальные макеты
│ │     ├── utils/                          # SCSS-миксины
│ │     └── main.scss                       # Главный файл (@use импорты)
│ │
│ ├── types/                                # Кастомные типы TS
│ │     └── index.ts                        # Экспорт типов
│ │
│ ├── utils/                                # Pure TS утилиты
│ │     └── phone-mask.ts                   # Маска ввода (+IMask типы)
│ │
│ ├── main.ts                               # Точка входа (импорт стилей)
│ └── index.html                            # HTML-шаблон
│
├── vite.config.ts                          # Конфиг Vite (SCSS+TS настройки)
├── tsconfig.json                           # Strict TS с decorators
└── package.json                            # Зависимости, скрипты "dev"/"build"
  ```
