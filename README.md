# Harbu Darbu Gang V13

## What this version adds

- Access Code before entering the group.
- Access code is SHA-256 hashed in the browser.
- Old Nights stored in Supabase.
- Old Nights visible from every device with the same group access code.
- Delete saved nights.
- Controller on phone.
- Projector Display on another Android/browser device.
- Projector refreshes live state every second.
- Rebuys and Cash Out in ₪25 steps.
- WhatsApp JPG summary.
- Current live night stored in Supabase.

## Setup

### 1. Create Supabase project
Create a free Supabase project.

### 2. Run SQL
Open Supabase -> SQL Editor and run:
`supabase-setup.sql`

### 3. Choose access code
Use a long access code, ideally 10+ random characters.

Open:
`make-access-code-hash.html`

Type your code and copy the SHA-256 result.

Then in Supabase SQL Editor run:

```sql
insert into public.hdg_groups(group_key, group_name)
values ('YOUR_SHA256_HASH', 'Harbu Darbu Gang');
```

### 4. Configure the site

In Supabase:
Project Settings -> API

Copy:
- Project URL
- Publishable/anon key

Edit `config.js`:

```js
window.HDG_SUPABASE_URL = "https://YOURPROJECT.supabase.co";
window.HDG_SUPABASE_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";
```

### 5. Upload to GitHub

Create repository, e.g.:
`HarbuDarbuGang-PWA`

Upload all files.

GitHub -> Settings -> Pages -> Source = GitHub Actions

The site will get an address similar to:

`https://matan7779.github.io/HarbuDarbuGang-PWA/`

## Projector

Phone:
- log in with group Access Code
- Start / Control Night
- note room code

Projector:
- open same site
- enter same Access Code
- Projector Display
- enter room code

The projector polls Supabase once per second and updates automatically.

## Security note

The access code is not stored as plain text in the database. The SHA-256 hash acts as the group's secret key.

Choose a strong code. A short code like `1234` can be brute-forced and is not appropriate even for this hobby app.
