import { sql } from '@vercel/postgres';
import { awardsData } from '../../src/awardsData.js';

async function getVotingStatus() {
  try {
    const { rows } = await sql`SELECT value FROM settings WHERE key = 'voting_status';`;
    if (rows.length > 0) {
      return rows[0].value;
    }
    return 'closed'; // Default status if not found
  } catch (error) {
    console.error('Error fetching voting status:', error);
    return 'closed'; // Default to closed on error
  }
}

// Helper to map nominee index to name
const categoryMap = {};
Object.values(awardsData).flat().forEach(category => {
    categoryMap[category.id] = {
        title: category.title,
        nominees: category.nominees.map(n => n.name)
    };
});


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const votingStatus = await getVotingStatus();
  if (votingStatus !== 'open') {
    return res.status(403).json({ message: 'Voting is currently closed.' });
  }

  const { email, votes } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !votes) {
    return res.status(400).json({ message: 'Missing email or votes' });
  }

  try {
    for (const categoryId in votes) {
      const nomineeIndex = votes[categoryId];
      
      // Look up nominee name using categoryMap
      const categoryTitle = categoryMap[categoryId]?.title;
      const nomineeName = categoryMap[categoryId]?.nominees[nomineeIndex];

      if (!categoryTitle || !nomineeName) {
          console.warn(`Could not find categoryTitle or nomineeName for categoryId: ${categoryId}, nomineeIndex: ${nomineeIndex}`);
          continue; // Skip this vote if data is invalid
      }

      await sql`
        INSERT INTO votes (email, category, nominee, created_at)
        VALUES (${email}, ${categoryTitle}, ${nomineeName}, ${timestamp});
      `;
    }
    
    res.status(200).json({ message: 'Vote saved successfully' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ message: 'Error saving vote' });
  }
}