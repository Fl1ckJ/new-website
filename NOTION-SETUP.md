# Публикация блога через Notion

Посты пишутся в базе Notion **Blog Posts**. Скрипт `sync-notion.mjs` забирает
их через Notion API, скачивает картинки в `uploads/` и пересобирает
`steeltrace/posts.generated.js` — файл, который читает сайт. Ничего в коде
руками трогать не нужно.

---

## Разовая настройка (делается один раз)

### 1. Колонки базы Notion

В базе **Blog Posts** должны быть такие свойства (названия — на английском):

| Column | Type | Назначение |
|---|---|---|
| **Name** | Title | Заголовок статьи (уже есть) |
| **Category** | Select | Категория (chip в списке) |
| **Author** | Text | Автор |
| **Subtitle** | Text | Подзаголовок под автором |
| **Date** | Date | Дата публикации (определяет порядок) |
| **Excerpt** | Text | Короткое описание на карточке |
| **Cover** | Number | Градиент 0–6 (если нет картинки) |
| **Glyph** | Text | Короткая метка на обложке |
| **Hero image** | Files & media | Большая обложка статьи |
| **Preview image** | Files & media | Картинка на карточке (необязательно) |
| **Status** | Select | Значения: `Draft`, `Published` |

Тело статьи — это содержимое самой страницы Notion (открой строку и пиши).
Синхронизируются только строки со статусом **Published**.

### 2. Integration token

1. Открой **notion.so/my-integrations** → **New integration**.
2. Назови (например `SteelTrace Blog Sync`), выбери workspace → **Submit**.
3. Скопируй **Internal Integration Secret** (начинается с `ntn_`).
4. В базе **Blog Posts**: **•••** → **Connections** → подключи эту integration.

### 3. Database ID

Открой базу как отдельную страницу. В URL:

```
https://www.notion.so/<workspace>/<DATABASE_ID>?v=<view_id>
```

`DATABASE_ID` — это 32 символа перед `?v=`.

### 4. Добавь секреты в GitHub

Репозиторий на GitHub → **Settings** → **Secrets and variables** → **Actions**
→ **New repository secret**. Создай два:

- `NOTION_TOKEN` — integration secret из шага 2
- `NOTION_DATABASE_ID` — id из шага 3

---

## Как опубликовать пост (каждый раз)

1. В Notion добавь строку в базу **Blog Posts**.
2. Заполни **Name**, **Category**, **Author**, **Date**, **Excerpt**.
3. Открой строку и напиши текст. Картинки внутри — командой `/image` или
   перетаскиванием. Обложку положи в **Hero image**.
4. Поставь **Status = Published**.
5. Дальше — автоматически: GitHub Action `Notion → Blog sync` запускается сам
   каждые 15 минут, забирает пост и публикует. Хочешь сразу — открой на GitHub
   вкладку **Actions** → **Notion → Blog sync** → **Run workflow**.

Чтобы снять пост с публикации — поменяй **Status** обратно на `Draft`
(при следующей синхронизации он исчезнет с сайта).

---

## Локальный запуск (без GitHub, для проверки)

```bash
npm install
NOTION_TOKEN=ntn_xxx NOTION_DATABASE_ID=abc123 node sync-notion.mjs
```

Файл `steeltrace/posts.generated.js` обновится, картинки появятся в `uploads/`.
Открой `blog.html` — посты на месте.

> Примечание: авто-деплой сайта (чтобы изменения появились в интернете сразу
> после синхронизации) настраивается отдельно, когда подключишь хостинг
> (Netlify / GitHub Pages). Тогда каждый push от бота будет публиковать сайт.
