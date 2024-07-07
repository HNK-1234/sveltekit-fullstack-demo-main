import { createPool } from '@vercel/postgres';

const POSTGRES_URL = import.meta.env.VITE_POSTGRES_URL;

export async function load() {
  if (!POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set.');
  }

  const db = createPool({ connectionString: POSTGRES_URL });

  try {
    const { rows: names } = await db.query('SELECT * FROM names');
    return {
      names,
    };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

async function seed() {
  const db = createPool({ connectionString: POSTGRES_URL });
  const client = await db.connect();
  await client.sql`
    CREATE TABLE IF NOT EXISTS names (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log(`Created "names" table`);

  const users = await Promise.all([
    client.sql`
      INSERT INTO names (name, email)
      VALUES ('Rohan', 'rohan@tcl.com')
      ON CONFLICT (email) DO NOTHING;
    `,
    client.sql`
      INSERT INTO names (name, email)
      VALUES ('Rebecca', 'rebecca@tcl.com')
      ON CONFLICT (email) DO NOTHING;
    `,
    client.sql`
      INSERT INTO names (name, email)
      VALUES ('Vivek', 'vivek@gmail.com')
      ON CONFLICT (email) DO NOTHING;
    `,
  ]);
  console.log(`Seeded ${users.length} users`);

  return {
    createTable: true,
    users,
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL });
    const client = await db.connect();

    const id = data.get('id');

    await client.sql`
      DELETE FROM names
      WHERE id = ${id};
    `;

    return { success: true };
  },

  create: async ({ request }) => {
    const data = await request.formData();
    const db = createPool({ connectionString: POSTGRES_URL });
    const client = await db.connect();

    const email = data.get('email');
    const name = data.get('name');

    await client.sql`
      INSERT INTO names (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO NOTHING;
    `;
    return { success: true };
  },
};
