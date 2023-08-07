# SPA-bank

## Описание приложения
Одностраничное веб-приложение для управления банковскими счетами.
Реализован функционал:
- Авторизация
- Управление счетами пользователя: создание нового счёта, отображение списка
счетов, отображение баланса, просмотр истории транзакций
- Переводы на счета или карты других ользователей
- Возможность производить валютные обмены
- Отображение банкоматов на карте
- Реализован эффект загрузки Skeleton
- На основные компоненты приложения написаны unit-тесты
- Основной функционал протестирован End-to-End тестами

## Стек
- Вся логика и взаимодействие с API сервера реализованы на чистом JS.
- Рендеринг DOM реализован на библиотеке REdom.
- Роутинг реализован с использованием Navigo.
- Сборка Webpack.

## Демонстрация

Backend уже готов к запуску, из папки project  выполните команду:
```JavaScript
    npm start
```
Запустится локальный сервер.

Для запуска приложения перейдите в папку front-end, для подтягивания необходимых библиотек и зависимостей, в консоли выполните команду:
```JavaScript
    npm i
```
После завершения установки, выполните команду:

```JavaScript
    npm run dev
```
 Для авторизации используйте логин и пароль:
```JavaScript
login: 'developer',
password: 'skillbox'
```
Тесты
Для запуска unit-тестов в папке front-end выполните команду:
```JavaScript
    npm test
```

