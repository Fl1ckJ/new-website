# Публикация вакансий через Notion

Вакансии на странице **Careers** работают так же, как блог. Роли живут в базе
Notion **Job offers**. Скрипт `sync-notion-jobs.mjs` забирает их через Notion
API, скачивает картинки в `uploads/jobs/` и пересобирает
`steeltrace/jobs.generated.js` — файл, который читает `careers.html`. Руками в
коде ничего трогать не нужно.

> Локальный вариант без Notion: положи папку с `index.md` в `/jobs` и запусти
> `node build-jobs.mjs`. Это тот же формат, что и у блога (`/posts`).

---

## Разовая настройка (делается один раз)

### 1. Колонки базы Notion

Создай в Notion базу **Job offers** со следующими свойствами (названия — на
английском):

| Column | Type | Назначение |
|---|---|---|
| **Name** | Title | Название роли (например «Product Owner») |
| **Team** | Select / Text | Команда (Product, Engineering, Operations…) |
| **Location** | Text | Локация (например «Heerlen, NL · On-site») |
| **Type** | Select | Тип занятости (Full-time, Part-time…) |
| **Apply link** | URL | Внешняя ссылка на отклик (напр. LinkedIn). Пусто → кнопка ведёт на форму на странице |
| **Cover** | Number | Градиент обложки 0–5 (если нет картинки) |
| **Cover image** | Files & media | Картинка роли — на карточке и в шапке модалки (необязательно) |
| **Date** | Date | Дата публикации (определяет порядок — новые сверху) |
| **Excerpt** | Text | Короткое описание на карточке |
| **Status** | Select | Значения: `Draft`, `Published` |

Описание вакансии — это содержимое самой страницы Notion (открой строку и
пиши: заголовки `###`, списки, ссылки — всё как в блоге). Синхронизируются
только строки со статусом **Published**.

### 2. Integration token — тот же, что у блога

Отдельная integration **не нужна**. Используем ту же, что и для блога
(`NOTION_TOKEN`). Нужно только подключить её к новой базе:

1. Открой базу **Job offers**.
2. **•••** (справа вверху) → **Connections** → выбери свою integration
   (ту же, что подключена к **Blog Posts**).

### 3. Database ID

Открой базу **Job offers** как отдельную страницу. В URL:

```
https://www.notion.so/<workspace>/<DATABASE_ID>?v=<view_id>
```

`DATABASE_ID` — это 32 символа перед `?v=`.

### 4. Добавь секрет в GitHub

Репозиторий на GitHub → **Settings** → **Secrets and variables** → **Actions**
→ **New repository secret**:

- `NOTION_JOBS_DATABASE_ID` — id из шага 3

`NOTION_TOKEN` уже добавлен для блога — второй раз создавать не нужно.

---

## Как опубликовать вакансию (каждый раз)

1. В Notion добавь строку в базу **Job offers**.
2. Заполни **Name**, **Team**, **Location**, **Type**, **Date**, **Excerpt**.
3. Открой строку и напиши описание роли (What you'll do, Must-haves и т.д.).
4. Поставь **Status = Published**.
5. Дальше — автоматически: GitHub Action **Notion → site sync** запускается
   сам каждые 15 минут, забирает вакансию и публикует. Хочешь сразу — открой
   на GitHub вкладку **Actions** → **Notion → site sync** → **Run workflow**.

Чтобы снять вакансию с публикации — поменяй **Status** обратно на `Draft`
(при следующей синхронизации она исчезнет со страницы Careers). Если открытых
ролей не осталось, на странице покажется блок «No open roles right now».

---

## Локальный запуск (без GitHub, для проверки)

```bash
npm install
NOTION_TOKEN=ntn_xxx NOTION_JOBS_DATABASE_ID=abc123 node sync-notion-jobs.mjs
```

Или полностью без Notion, из markdown-файлов в `/jobs`:

```bash
node build-jobs.mjs
```

Оба варианта пишут один и тот же файл `steeltrace/jobs.generated.js`.
