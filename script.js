// DOM Elements
const playerForm = document.getElementById('player-form');
const playerList = document.getElementById('player-list');
const submitBtn = document.getElementById('submit-btn');

// Event Listeners
playerForm.addEventListener('submit', handleFormSubmit);
playerList.addEventListener('click', handlePlayerAction);

// Functions
async function fetchPlayers() {
    const response = await fetch('http://localhost:3000/players');
    return await response.json();
}

async function displayPlayers() {
    const players = await fetchPlayers();
    playerList.innerHTML = players.map(player => `
        <div class="player-item" data-id="${player.id}">
            <div class="player-info">
                <h3>${player.name}</h3>
                <p>Position: ${player.position}</p>
                <p>Team: ${player.team}</p>
                <p>Points: ${player.points}</p>
            </div>
            <div class="player-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('player-id').value;
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const team = document.getElementById('team').value;
    const points = document.getElementById('points').value;

    const player = { name, position, team, points: parseInt(points) };
    
    if (id) {
        await updatePlayer(id, player);
    } else {
        await createPlayer(player);
    }

    playerForm.reset();
    document.getElementById('player-id').value = '';
    submitBtn.textContent = 'Add Player';
    displayPlayers();
}

async function createPlayer(player) {
    await fetch('http://localhost:3000/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
}

async function updatePlayer(id, player) {
    await fetch(`http://localhost:3000/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player)
    });
}

async function deletePlayer(id) {
    await fetch(`http://localhost:3000/players/${id}`, {
        method: 'DELETE'
    });
}

function handlePlayerAction(e) {
    const playerItem = e.target.closest('.player-item');
    if (!playerItem) return;

    const id = playerItem.dataset.id;

    if (e.target.classList.contains('edit-btn')) {
        const name = playerItem.querySelector('h3').textContent;
        const position = playerItem.querySelector('p:nth-of-type(1)').textContent.replace('Position: ', '');
        const team = playerItem.querySelector('p:nth-of-type(2)').textContent.replace('Team: ', '');
        const points = playerItem.querySelector('p:nth-of-type(3)').textContent.replace('Points: ', '');

        document.getElementById('player-id').value = id;
        document.getElementById('name').value = name;
        document.getElementById('position').value = position;
        document.getElementById('team').value = team;
        document.getElementById('points').value = points;
        submitBtn.textContent = 'Update Player';
    } else if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this player?')) {
            deletePlayer(id).then(displayPlayers);
        }
    }
}

// Initial load
displayPlayers();