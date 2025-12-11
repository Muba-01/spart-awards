import { sql } from '@vercel/postgres';
import { awardsData } from '../../../src/awardsData.js';
import path from 'path'; // Needed for path.basename in renderDashboard

// Helper to map nominee index to name
const categoryMap = {};
Object.values(awardsData).flat().forEach(category => {
    categoryMap[category.id] = {
        title: category.title,
        nominees: category.nominees.map(n => n.name)
    };
});

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

export default async function handler(req, res) {
    if (req.query.auth !== process.env.ADMIN_PASSWORD) { // Using ADMIN_PASSWORD from Vercel ENV
        return res.status(403).send('Not authorized. <a href="/admin">Login</a>'); // Redirect to a login page later
    }

    const currentView = req.query.view || 'leaderboard'; // Default view
    const sortBy = req.query.sort || 'lastTimestamp';
    const sortOrder = req.query.order || 'desc';

    let file = 'current'; // Placeholder for current votes
    let isArchive = false;
    let archiveFileName = '';

    if (req.query.filename) { // This part needs reconsideration for actual archives in DB
        // For now, let's assume archives are a list of past voting rounds in the DB
        // This serverless function would query historical data
        file = req.query.filename;
        isArchive = true;
        archiveFileName = path.basename(file); // This path logic is for file system, need to adapt
    }

    try {
        // Fetch all votes from the database
        const { rows: allDbVotes } = await sql`SELECT email, category, nominee, created_at FROM votes ORDER BY created_at DESC;`;

        const counts = {};
        const votesByEmail = {};

        // Initialize counts for all categories and nominees
        for (const categoryId in categoryMap) {
            counts[categoryId] = {};
            categoryMap[categoryId].nominees.forEach(nomineeName => {
                counts[categoryId][nomineeName] = 0;
            });
        }

        allDbVotes.forEach(vote => {
            const categoryId = Object.keys(categoryMap).find(key => categoryMap[key].title === vote.category);
            if (categoryId) {
                counts[categoryId][vote.nominee]++;

                if (!votesByEmail[vote.email]) {
                    votesByEmail[vote.email] = { email: vote.email, votes: [], lastTimestamp: vote.created_at };
                }
                votesByEmail[vote.email].votes.push({ category: vote.category, nominee: vote.nominee });
                if (vote.created_at > votesByEmail[vote.email].lastTimestamp) {
                    votesByEmail[vote.email].lastTimestamp = vote.created_at;
                }
            }
        });
        
        const sortedVoters = Object.values(votesByEmail).sort((a, b) => {
            if (sortBy === 'email') {
                return sortOrder === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
            }
            // Default to timestamp
            return sortOrder === 'asc' ? new Date(a.lastTimestamp) - new Date(b.lastTimestamp) : new Date(b.lastTimestamp) - new Date(a.lastTimestamp);
        });

        const votingStatus = await getVotingStatus();

        // For now, archive files will be displayed as links, but their content needs DB queries
        // This part needs more thought on how to handle "archives" from a DB perspective
        const archiveFiles = []; // Placeholder for actual archive retrieval logic

        let resultsHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin Dashboard ${isArchive ? `(Archive: ${archiveFileName})` : ''}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; background-color: #f4f7f9; color: #333; }
                    .header { background-color: #fff; padding: 20px 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
                    .header h1 { margin: 0; font-size: 1.8em; }
                    .header .controls { display: flex; gap: 10px; margin-top: 10px; }
                    .header .controls form { margin: 0; }
                    .header .controls button { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
                    .btn-start { background-color: #28a745; color: white; }
                    .btn-stop { background-color: #dc3545; color: white; }
                    .btn-reset { background-color: #ffc107; color: black; }
                    .status { font-weight: bold; padding: 8px 12px; border-radius: 4px; }
                    .status-open { background-color: #28a745; color: white; }
                    .status-closed { background-color: #dc3545; color: white; }
                    .tabs { margin: 20px 0 0; padding: 0; width: 100%; display: flex; gap: 10px; border-bottom: 2px solid #dee2e6; }
                    .tabs a { text-decoration: none; padding: 10px 20px; font-weight: bold; color: #007bff; border: 2px solid transparent; border-bottom: none; border-radius: 5px 5px 0 0; }
                    .tabs a.active { color: #495057; background-color: #f4f7f9; border-color: #dee2e6 #dee2e6 #f4f7f9; }
                    .container { padding: 40px; }
                    .content { display: none; }
                    .content.active { display: block; }
                    .category-card, .table-container { background: #fff; margin-bottom: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
                    .category-title { font-size: 1.75em; padding: 20px 25px; margin: 0; background-color: #343a40; color: white; }
                    .winner { padding: 15px 25px; background-color: #d4edda; border-bottom: 1px solid #c3e6cb; }
                    .nominee-list { list-style-type: none; padding: 0; margin: 0; }
                    .nominee-list li { display: flex; justify-content: space-between; padding: 15px 25px; border-bottom: 1px solid #f0f0f0; }
                    #vote-log table { width: 100%; border-collapse: collapse; }
                    #vote-log th, #vote-log td { text-align: left; padding: 15px; border-bottom: 1px solid #eee; vertical-align: top; }
                    #vote-log th { background-color: #f8f9fa; cursor: pointer; user-select: none; }
                    #vote-log th:hover { background-color: #e9ecef; }
                    #vote-log .votes-list { list-style-type: none; padding-left: 0; margin: 0; }
                    #filter-input { padding: 10px; width: 100%; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>Admin Dashboard ${isArchive ? `(Archive: ${archiveFileName})` : ''}</h1>
                        <div class="controls">
                            ${!isArchive ? `
                                <span class="status status-${votingStatus}">${votingStatus.toUpperCase()}</span>
                                <form action="/api/admin/start?auth=${process.env.ADMIN_PASSWORD}" method="post"><button type="submit" class="btn-start" ${votingStatus === 'open' ? 'disabled' : ''}>Start</button></form>
                                <form action="/api/admin/stop?auth=${process.env.ADMIN_PASSWORD}" method="post"><button type="submit" class="btn-stop" ${votingStatus === 'closed' ? 'disabled' : ''}>Stop</button></form>
                                <form action="/api/admin/reset?auth=${process.env.ADMIN_PASSWORD}" method="post" onsubmit="return confirm('Are you sure you want to reset? This will archive current votes and start a new session.');"><button type="submit" class="btn-reset">Reset</button></form>
                            ` : ''}
                        </div>
                    </div>
                    <nav class="tabs">
                        <a href="?auth=${process.env.ADMIN_PASSWORD}&view=leaderboard" class="${currentView === 'leaderboard' ? 'active' : ''}">Leaderboard</a>
                        <a href="?auth=${process.env.ADMIN_PASSWORD}&view=log" class="${currentView === 'log' ? 'active' : ''}">Detailed Log</a>
                        ${!isArchive ? `<a href="?auth=${process.env.ADMIN_PASSWORD}&view=history" class="${currentView === 'history' ? 'active' : ''}">History</a>` : ''}
                    </nav>
                </div>
                <div class="container">
                    <div id="leaderboard" class="content ${currentView === 'leaderboard' ? 'active' : ''}">
                        ${Object.keys(counts).sort((a, b) => categoryMap[a].title.localeCompare(categoryMap[b].title)).map(categoryId => {
                            const categoryTitle = categoryMap[categoryId].title;
                            const nominees = Object.entries(counts[categoryId]).sort(([, a], [, b]) => b - a);
                            const winner = nominees[0];
                            return `
                                <div class="category-card">
                                    <h2 class="category-title">${categoryTitle}</h2>
                                    <div class="winner">WINNER: ${winner && winner[1] > 0 ? `${winner[0]} (${winner[1]} votes)` : 'N/A'}</div>
                                    <ul class="nominee-list">
                                        ${nominees.map(([name, count]) => `<li><span>${name}</span> <span>${count} votes</span></li>`).join('')}
                                    </ul>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div id="log" class="content ${currentView === 'log' ? 'active' : ''}">
                        <div class="table-container">
                            <input type="text" id="filter-input" placeholder="Filter by email, category, or nominee...">
                            <table id="vote-log">
                                <thead>
                                    <tr>
                                        <th data-sort="email">Email</th>
                                        <th data-sort="votes">Votes Cast</th>
                                        <th data-sort="lastTimestamp">Last Voted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sortedVoters.map(voter => `
                                        <tr>
                                            <td>${voter.email}</td>
                                            <td>
                                                <ul class="votes-list">
                                                    ${voter.votes.map(v => `<li><strong>${v.category}:</strong> ${v.nominee}</li>`).join('')}
                                                </ul>
                                            </td>
                                            <td>${new Date(voter.lastTimestamp).toLocaleString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     <div id="history" class="content ${currentView === 'history' ? 'active' : ''}">
                        <h2>Archived Vote Logs</h2>
                        <ul class="nominee-list">
                            ${archiveFiles.map(f => `<li><a href="/admin/dashboard/${f}?auth=${process.env.ADMIN_PASSWORD}">${f}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const table = document.getElementById('vote-log');
                        const headers = table.querySelectorAll('th[data-sort]');
                        const tbody = table.querySelector('tbody');
                        const rows = Array.from(tbody.querySelectorAll('tr'));
                        let currentSort = { column: 'lastTimestamp', order: 'desc' };

                        const sortRows = () => {
                            const { column, order } = currentSort;
                            rows.sort((a, b) => {
                                const aVal = a.querySelector(\
                                    `td:nth-child(\
                                        ${getColumnIndex(column)}\
                                    )\
                                `).textContent.trim();
                                const bVal = b.querySelector(\
                                    `td:nth-child(\
                                        ${getColumnIndex(column)}\
                                    )\
                                `).textContent.trim();
                                
                                let compare;
                                if (column === 'lastTimestamp') {
                                    compare = new Date(bVal) - new Date(aVal); // newest first
                                } else {
                                    compare = aVal.localeCompare(bVal);
                                }
                                
                                return order === 'asc' ? compare : -compare;
                            });
                            rows.forEach(row => tbody.appendChild(row));
                        };

                        headers.forEach(header => {
                            header.addEventListener('click', () => {
                                const sortKey = header.dataset.sort;
                                const order = (currentSort.column === sortKey && currentSort.order === 'asc') ? 'desc' : 'asc';
                                currentSort = { column: sortKey, order };
                                sortRows();
                            });
                        });
                        
                        const getColumnIndex = (key) => {
                            if (key === 'email') return 1;
                            if (key === 'votes') return 2;
                            if (key === 'lastTimestamp') return 3;
                            return 1;
                        };

                        const filterInput = document.getElementById('filter-input');
                        filterInput.addEventListener('keyup', () => {
                            const filterText = filterInput.value.toLowerCase();
                            rows.forEach(row => {
                                const rowText = row.textContent.toLowerCase();
                                row.style.display = rowText.includes(filterText) ? '' : 'none';
                            });
                        });

                        // Initial sort
                        sortRows();
                    });
                </script>
            </body>
            </html>
        `;
        res.send(resultsHtml);
    } catch (error) {
        console.error('Error in dashboard handler:', error);
        res.status(500).send('Error loading dashboard.');
    }
}
