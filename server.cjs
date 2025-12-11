require('dotenv').config();
console.log('Server.cjs script started');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const VOTING_STATE_FILE = 'votingState.json';
const VOTES_FILE = 'votes.csv';
const ARCHIVE_DIR = 'archives';

// --- Voting State Management ---
const getVotingState = () => {
    try {
        const data = fs.readFileSync(VOTING_STATE_FILE, 'utf8');
        return JSON.parse(data).status;
    } catch (err) {
        // If file doesn't exist or is invalid, assume closed
        return 'closed';
    }
};

const setVotingState = (status) => {
    fs.writeFileSync(VOTING_STATE_FILE, JSON.stringify({ status }));
};


// --- Voting API ---
app.post('/api/vote', (req, res) => {
  if (getVotingState() !== 'open') {
    return res.status(403).send('Voting is currently closed.');
  }
  const { email, votes } = req.body;
  const timestamp = new Date().toISOString();

  if (!email || !votes) {
    return res.status(400).send('Missing email or votes');
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

  const csvHeader = 'Email,Category,Nominee,Timestamp\n';
  const fileExists = fs.existsSync(VOTES_FILE);
  const csvData = voteData.map(v => `${v.email},${v.category},${v.nominee},${v.timestamp}`).join('\n') + '\n';
  
  const dataToAppend = !fileExists ? csvHeader + csvData : csvData;

  fs.appendFile(VOTES_FILE, dataToAppend, (err) => {
    if (err) {
      console.error('Error writing to CSV file:', err);
      return res.status(500).send('Error saving vote');
    }
    res.status(200).send('Vote saved successfully');
  });
});

// Redirect root to admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// --- Admin Section ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

// Admin Login Page
app.get('/admin', (req, res) => {
    res.send(`
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; }
            form { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            input { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; }
            button { width: 100%; padding: 10px; border: none; border-radius: 4px; background-color: #007bff; color: white; cursor: pointer; }
        </style>
        <form action="/admin/login" method="post">
            <h2>Admin Login</h2>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `);
});

// Admin Login Handler
app.post('/admin/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        res.redirect('/admin/dashboard?auth=true');
    } else {
        res.send('Incorrect password. <a href="/admin">Try again</a>');
    }
});


// --- Admin Control Endpoints ---
app.post('/admin/start', (req, res) => {
    setVotingState('open');
    res.redirect('/admin/dashboard?auth=true');
});

app.post('/admin/stop', (req, res) => {
    setVotingState('closed');
    res.redirect('/admin/dashboard?auth=true');
});

app.post('/admin/reset', (req, res) => {
    if (!fs.existsSync(ARCHIVE_DIR)){
        fs.mkdirSync(ARCHIVE_DIR);
    }
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const archiveFile = path.join(ARCHIVE_DIR, `votes_${timestamp}.csv`);
    
    if (fs.existsSync(VOTES_FILE)) {
        fs.renameSync(VOTES_FILE, archiveFile);
    }
    
    fs.writeFileSync(VOTES_FILE, 'Email,Category,Nominee,Timestamp\n');
    res.redirect('/admin/dashboard?auth=true');
});


const startServer = async () => {
    const { awardsData } = await import('./src/awardsData.js');

    // --- Helper Data Structure for Name Lookups ---
    const categoryMap = {};
    Object.values(awardsData).flat().forEach(category => {
        categoryMap[category.id] = {
            title: category.title,
            nominees: category.nominees.map(n => n.name)
        };
    });

    const renderDashboard = (req, res, file = VOTES_FILE, isArchive = false) => {
        const currentView = req.query.view || 'leaderboard';
        const votingStatus = getVotingState();

        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send(`<h1>Error</h1><p>Could not read vote data from ${file}.</p>`);
            }

            const lines = data.trim().split('\n');
            lines.shift();

            const counts = {};
            const votesByEmail = {};
            for (const categoryId in categoryMap) {
                counts[categoryId] = {};
                categoryMap[categoryId].nominees.forEach(nomineeName => {
                    counts[categoryId][nomineeName] = 0;
                });
            }

            lines.forEach(line => {
                const [email, categoryId, nomineeIndex, timestamp] = line.split(',');
                if (email && categoryId && nomineeIndex && categoryMap[categoryId] && categoryMap[categoryId].nominees[nomineeIndex]) {
                    const nomineeName = categoryMap[categoryId].nominees[nomineeIndex];
                    const categoryTitle = categoryMap[categoryId].title;

                    counts[categoryId][nomineeName]++;

                    if (!votesByEmail[email]) {
                        votesByEmail[email] = { email, votes: [], lastTimestamp: timestamp };
                    }
                    votesByEmail[email].votes.push({ category: categoryTitle, nominee: nomineeName });
                    if (timestamp > votesByEmail[email].lastTimestamp) {
                        votesByEmail[email].lastTimestamp = timestamp;
                    }
                }
            });
            
            const sortedVoters = Object.values(votesByEmail);

            const archiveFiles = fs.existsSync(ARCHIVE_DIR) ? fs.readdirSync(ARCHIVE_DIR).sort().reverse() : [];
            
            let resultsHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Admin Dashboard ${isArchive ? `(Archive: ${path.basename(file)})` : ''}</title>
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
                            <h1>Admin Dashboard ${isArchive ? `(Archive: ${path.basename(file)})` : ''}</h1>
                            <div class="controls">
                                ${!isArchive ? `
                                    <span class="status status-${votingStatus}">${votingStatus.toUpperCase()}</span>
                                    <form action="/admin/start?auth=true" method="post"><button type="submit" class="btn-start" ${votingStatus === 'open' ? 'disabled' : ''}>Start</button></form>
                                    <form action="/admin/stop?auth=true" method="post"><button type="submit" class="btn-stop" ${votingStatus === 'closed' ? 'disabled' : ''}>Stop</button></form>
                                    <form action="/admin/reset?auth=true" method="post" onsubmit="return confirm('Are you sure you want to reset? This will archive current votes and start a new session.');"><button type="submit" class="btn-reset">Reset</button></form>
                                ` : ''}
                            </div>
                        </div>
                        <nav class="tabs">
                            <a href="?auth=true&view=leaderboard" class="${currentView === 'leaderboard' ? 'active' : ''}">Leaderboard</a>
                            <a href="?auth=true&view=log" class="${currentView === 'log' ? 'active' : ''}">Detailed Log</a>
                            ${!isArchive ? `<a href="?auth=true&view=history" class="${currentView === 'history' ? 'active' : ''}">History</a>` : ''}
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
                                ${archiveFiles.map(f => `<li><a href="/admin/dashboard/${f}?auth=true">${f}</a></li>`).join('')}
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
                                    const aVal = a.querySelector(\`td:nth-child(\${getColumnIndex(column)}) \`).textContent.trim();
                                    const bVal = b.querySelector(\`td:nth-child(\${getColumnIndex(column)}) \`).textContent.trim();
                                    
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
                                    const sortKey = header.dataset..sort;
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
        });
    };

    app.get('/admin/dashboard', (req, res) => {
        if (req.query.auth !== 'true') return res.status(403).send('Not authorized. <a href="/admin">Login</a>');
        renderDashboard(req, res);
    });

    app.get('/admin/dashboard/:filename', (req, res) => {
        if (req.query.auth !== 'true') return res.status(403).send('Not authorized. <a href="/admin">Login</a>');
        const filePath = path.join(ARCHIVE_DIR, req.params.filename);
        if (!fs.existsSync(filePath)) return res.status(404).send('Archive file not found.');
        renderDashboard(req, res, filePath, true);
    });

    console.log('Attempting to start server...');
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
};

startServer();



