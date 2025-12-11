import { awardsData } from '../../src/awardsData.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // TODO: Implement voting state check from a database
  // if (getVotingState() !== 'open') {
  //   return res.status(403).send('Voting is currently closed.');
  // }

  const { email, votes } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !votes) {
    return res.status(400).json({ message: 'Missing email or votes' });
  }

  const voteData = [];
  for (const category in votes) {
    voteData.push({
      email,
      category,
      nominee: votes[category],
      timestamp,
    });
  }

  try {
    // TODO: Insert voteData into the database
    console.log('Votes to be saved:', voteData);
    
    res.status(200).json({ message: 'Vote saved successfully' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ message: 'Error saving vote' });
  }
}
