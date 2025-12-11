import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // Basic authorization check
  if (req.query.auth !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Not authorized.' });
  }

  try {
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('voting_status', 'open')
      ON CONFLICT (key) DO UPDATE SET value = 'open';
    `;
    res.status(200).json({ message: 'Voting started successfully.' });
  } catch (error) {
    console.error('Error starting voting:', error);
    res.status(500).json({ message: 'Error starting voting.' });
  }
}
