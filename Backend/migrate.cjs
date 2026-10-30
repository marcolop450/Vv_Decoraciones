const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:[PASSWORD]@db.zetuihzjpnbfhvzclajx.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await client.connect();
    console.log('Conectado a PostgreSQL Supabase.');

    const files = [
      path.resolve(__dirname, 'migrations/001_initial_schema.sql'),
      path.resolve(__dirname, 'migrations/002_rls_policies.sql'),
      path.resolve(__dirname, 'migrations/003_storage_setup.sql'),
      path.resolve(__dirname, 'seeds/001_seed_data.sql')
    ];

    for (const f of files) {
      console.log('Ejecutando archivo:', path.basename(f));
      const sql = fs.readFileSync(f, 'utf8');
      await client.query(sql);
      console.log('Completado con exito:', path.basename(f));
    }

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('Tablas activas en schema public:');
    console.log(res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error durante la migracion:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
