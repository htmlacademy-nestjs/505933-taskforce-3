### Оглавление:

- [Компонентная схема](#Компонентная-схема)
- [Переменные окружения](#Переменные-окружения)
- [Поддерживаемые переменные окружения](#Поддерживаемые-переменные-окружения)

### Компонентная схема

Архитектурная схема находится в корневой директории в файле `specification.drawio`. Файл можно просмотреть в [соответствующем приложении](https://app.diagrams.net/).

### Переменные окружения

Файлы `.env` предназначены для хранения переменных окружения. Для использования этой технологии достаточно создать в проекте файл с именем `.env` и внести в него переменные окружения, начиная каждую с новой строки:

```
DB_NAME=taskforce.account
DB_HOST=localhost
DB_PORT=27017
```

Для конфигурирования системы в зависимости от того, в какой она среде запускается, следует создавать файлы `.env` следующего формата:
`.env.$ENVIRONMENT_NAME`, где `$ENVIRONMENT_NAME` - это окружение, в котором запускается приложение (`production`, `development`, `stage` или `test`).
Например, для конфигурации системы под разработку файл конфигурации будет иметь следующее название: `.env.development`.

### Запуск docker-образа

Для поднятия и развертывания сервисов в docker-контейнере необходимо выполнить следующую команду:
`docker compose --file $PATH_TO_DOCKER_CONFIGURATION_FILE up -d`

> > `Для корректной работы сервисов не забудьте в .env добавить соответствующие переменные окружения`

### Поддерживаемые переменные окружения

`APPLICATION_PORT` - основной порт приложения
`URL_SERVICE_TASK` - url-адрес сервиса задач (`task`)
`URL_SERVICE_REVIEW` - url-адрес сервиса отзывов (`review`)
`URL_SERVICE_ACCOUNT` - url-адрес сервиса пользователей (`account`)
`URL_SERVICE_COMMENT` - url-адрес сервиса комментариев (`comment`)
`MONGO_INITDB_ROOT_USERNAME` -имя пользователя базы данных mongo. Используется в конфигурации docker. [Более подробная информация](https://hub.docker.com/_/mongo)
`MONGO_INITDB_ROOT_PASSWORD` - пароль пользователя базы данных mongo
`MONGO_INITDB_DATABASE` - имя базы данных
`DB_AUTH_BASE` - базовая аутентификация
`DB_HOST` - хост базы данных
`DB_PORT` -прослушиваемый порт базы данных
`ME_CONFIG_BASICAUTH_USERNAME` - логин пользователя mongo-express
`ME_CONFIG_BASICAUTH_PASSWORD` - пароль пользователя mongo-express
`ME_CONFIG_MONGODB_ADMINUSERNAME` - логин администратора mongo-express
`ME_CONFIG_MONGODB_ADMINPASSWORD` -пароль администратора mongo-express
`ME_CONFIG_MONGODB_URL` - строка подключения к БД
`JWT_SECRET` - jwt-секрет для access токена
`JWT_EXPIRES_IN` -время жизни access токена
`REFRESH_SECRET_JWT` - секрет refresh токена
`REFRESH_JWT_EXPIRES_IN` - время жизни refresh токена
`POSTGRES_USER` - имя пользователя базы данных postgres
`POSTGRES_PASSWORD` - пароль пользователя базы данных postgres
`POSTGRES_DB` - имя базы данных
`PGADMIN_DEFAULT_EMAIL` - имя пользователя СУБД
`PGADMIN_DEFAULT_PASSWORD` - пароль пользователя СУБД
`PGADMIN_CONFIG_SERVER_MODE`
`RABBITMQ_DEFAULT_USER` - пользователь брокера
`RABBITMQ_DEFAULT_PASS` - пользовательский пароль
`RABBITMQ_HOST` - адрес хоста, на котором развернут брокер сообщений RabbitMQ
`RABBITMQ_PORT` - прослушиваемый порт брокера сообщений
`RABBITMQ_QUEUE` - название используемой очереди
`RABBITMQ_EXCHANGE` - название обменника
`MAIL_SMTP_HOST` - хост, на котором развернут SMTP-сервер
`MAIL_SMTP_PORT` - прослушиваемый SMTP-сервером порт
`MAIL_USER_NAME` - логин пользователя
`MAIL_USER_PASSWORD` - пароль пользователя
`MAIL_FROM` - от кого сообщение
`UPLOAD_DIRECTORY` - директория хранения изображения
`SERVE_STATIC` - путь обработки статических файлов
