# ct.js supabase

This is a ct.js module/catmod for games using [supabase](https://supabase.com).

Supabase is an open source platform with database, authentication, and other APIs. This is useful for games that save progress to the cloud, have user accounts, or have multiplayer functionality.

## How this catmod works

This catmod doesn't add any extra functionality to supabase's javascript library, so you can read [supabase's docs](https://supabase.com/docs) and use all of their examples.

This catmod already "installs" and initalizes supabase, so in [supabase's javascript reference](https://supabase.com/docs/reference/javascript), you can skip the `Installing` and `Initalizing` sections.

That means you do NOT add `import { createClient } from...` or `const { createClient } =...`.

If Supabase's documentation asks you to do `supabase.something()` or `_supabase.something()`, it's just `supabase.something()` in ct.js!

## Setup

In ct.js, go to Project > Catmod's settings > supabase

![screenshot0](./screenshot0.png)

You need to enter your Supabase URL and Public anon key to be able to use supabase in ct.js.

These can be found in supabase, under Project Settings > API

![screenshot1](./screenshot1.png)

Copy the URL and Public anon key and paste it into ct.js. Both of these are public, so it is NOT "dangerous" to have them in your game's code.

After this, you can use all of supabase's javascript library, as described in their documentation.
