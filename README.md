# Как установить

1. Скачиваем из [nwjs.io](https://nwjs.io/downloads/) пакет с sdk для своей платформы и распаковываем в корень репозитория.
2. Переименовываем `package2.json` в `package.json`
3. Выполняем (для Windows убираем `sudo`):

```
sudo npm install gulp bower -g
npm install
bower install
gulp --release
```

4. Переименовываем обратно `package.json` в `package2.json`
5. В папке `/app` выполняем `npm install`
6. Всё, можно запускать.

# Как запустить

**На Windows:** перетащить мышью папку `/app` на `nw.exe`
**На Linux:** в терминале, в основной папке выполнить `./nw ./app`

Для разработки дополнительно в отдельном процессе выполняем `gulp` в основной папке.