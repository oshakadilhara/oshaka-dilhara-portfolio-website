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
if (!original) {
  throw new Error("DATABASE_URL missing from .env.local");
}

async function connect() {
  const url = new URL(original);
  const password = decodeURIComponent(url.password);
  const projectRefMatch = url.hostname.match(/^db\.([^.]+)\.supabase\.co$/i);
  const projectRef = projectRefMatch?.[1];
  if (!projectRef) {
    throw new Error(`Could not parse project ref from ${url.hostname}`);
  }

  // Direct db.* hosts are IPv6-only on this network; use the IPv4 pooler.
  const client = new pg.Client({
    host: "aws-1-ap-northeast-2.pooler.supabase.com",
    port: 5432,
    user: `postgres.${projectRef}`,
    password,
    database: url.pathname.replace(/^\//, "") || "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });

  await client.connect();
  console.log("Connected via aws-1-ap-northeast-2.pooler.supabase.com:5432");
  return client;
}

const files = [
  "supabase/migrations/20261117120000_security_baseline.sql",
  "supabase/migrations/20261117150000_admin_cms.sql",
];

const client = await connect();
console.log("Connected to Postgres.");

try {
  for (const file of files) {
    console.log(`Applying ${file}`);
    const sql = fs.readFileSync(file, "utf8");
    await client.query(sql);
    console.log(`OK ${file}`);
  }

  const { rows } = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'admin_users','contact_messages','articles','projects',
        'content_entries','experience','education','certifications',
        'tool_meta','analytics_events','site_settings','feedback'
      )
    order by table_name
  `);

  console.log("Tables:", rows.map((row) => row.table_name).join(", "));
} finally {
  await client.end();
}
