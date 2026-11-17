import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function loadEnv() {
  const envPath = path.resolve(".env.local");
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
    if (match) process.env[match[1]] = match[2];
  }
}

loadEnv();

const original = process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAILS || "").split(",")[0]?.trim().toLowerCase();
if (!original) throw new Error("DATABASE_URL missing");
if (!email) throw new Error("ADMIN_EMAILS missing");

const url = new URL(original);
const projectRef = url.hostname.match(/^db\.([^.]+)\.supabase\.co$/i)?.[1];
if (!projectRef) throw new Error("Could not parse project ref");

const client = new pg.Client({
  host: "aws-1-ap-northeast-2.pooler.supabase.com",
  port: 5432,
  user: `postgres.${projectRef}`,
  password: decodeURIComponent(url.password),
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const users = await client.query(
  "select id, email from auth.users where lower(email) = $1",
  [email]
);

console.log("Admin email:", email);
console.log("Auth users matched:", users.rows.length);

if (users.rows[0]) {
  const row = users.rows[0];
  await client.query(
    `insert into public.admin_users (user_id, email)
     values ($1, $2)
     on conflict (user_id) do update set email = excluded.email`,
    [row.id, row.email]
  );
  console.log("Seeded admin_users for", row.email);
} else {
  console.log(
    "No Auth user found yet. Create the user in Supabase Auth, then re-run: node scripts/seed-admin.mjs"
  );
}

const admins = await client.query("select email, user_id from public.admin_users");
console.log("admin_users rows:", admins.rows);

await client.end();
