
# Одностраничная игра на Phaser 3

В ходе выполнения задания необходимо было создать крутящееся колесо фортуны на Phaser 3 и TypeScript с 8 ячейками, многочисленными анимациями и адаптивом под разные разрешения экрана. 

## Структура проекта

Так как это одностраничное приложение, было принято решение использовать максимально простую структуру, описанную ниже. Очень хотелось использовать FSD, но в таком случае была бы использована только половина слоёв, поэтому большого смысла в этом не было.
```
- public/                     // Папка для статических файлов (изображения, шрифты и главный HTML-файл)
- src/                        // Главная папка с исходным кодом приложения
  - data/                       // Данные, используемые в приложении
    - rewards.ts                  // Конфигурация ячеек с наградами
  - scenes/                     // Сцены приложения
    - GameScene/                  // Папка с главной сценой
      - elements/                   // Компоненты для главной сцены
        - Header.ts                   // Шапка
        - RewardAndAttentionModal.ts  // Модальное окно для наград или иных уведомлений (пустая ячейка и закончившиеся попытки)
        - SpinButton.ts               // Кнопка для начала прокрутки
        - Wheel.ts                    // Колесо фортуны
      - GameScene.ts                // Главная сцена
  - types/                      // Типы
    - reward.ts                   // Тип ячейки с наградой
  - utils/                      // Общие функции
    - findScale.ts                // Функция для нахождения оптимального коэффициента масштабирования при текущих размерах окна
  - index.ts                    // Входная точка приложения
- package.json                // Список зависимостей и скриптов проекта
- tsconfig.json               // Конфигурация TypeScript для приложения
- vercel.json                 // Конфигурация для vercel
- webpack.config.js           // Webpack-конфигурация
```

## Развёртывание проекта

Ссылка на деплой: https://phaser-wheel-of-fortune.vercel.app/

Для локального запуска веб-приложение нужно выполнить следующие инструкции:

### 1. Клонирование репозитория

```bash
git clone https://github.com/Krit2124/phaser-wheel-of-fortune
```

---

### 2. Перейдите в директорию проекта 

```bash 
cd phaser-wheel-of-fortune
```

---


### 3. Убедитесь, что у вас установлены необходимые зависимости

-   [Node.js](https://nodejs.org/)  (рекомендуется версия  **16.x**  или выше)
-   [npm](https://www.npmjs.com/)  или  [bun](https://bun.sh/)  для управления пакетами

Проверьте версии Node.js и npm, выполнив:
```bash
node -v
npm -v
# Или, если используете bun:
bun -v
```

---

### 4. Установка зависимостей

Для установки всех необходимых пакетов выполните:

```bash
npm install
```

Или, если вы используете Bun:

```bash
bun install
```

---

### 5. Запуск приложения в режиме разработки

После установки зависимостей запустите проект локально:

```bash
npm run dev
```

Или с использованием Bun:

```bash
bun run dev
```

После запуска вы увидите в консоли URL-адрес:

```
http://localhost:8080/
```

Перейдите по указанному адресу в вашем браузере.

---

### 6. Сборка приложения для продакшена

Для сборки оптимизированной версии приложения выполните:

```bash
npm run build
```

Или с использованием Bun:

```bash
bun run build
```

Это создаст папку `dist`, содержащую готовую к развертыванию версию приложения.

---

### 7. Предпросмотр продакшн-сборки (опционально)

Чтобы запустить предварительный просмотр продакшн-версии достаточно открыть файл `dist/index.html` в браузере