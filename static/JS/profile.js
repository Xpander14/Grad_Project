// Service prices in EGP
const servicePrices = {
    'Cooking': 500,
    'Gardening': 1000,
    'Maintenance': 600,
    'Dry-Clean': 250,
    'Babysitting': 900,
    'Cleaning': 400
};

// Function to calculate total price for services
function calculateTotalPrice(services) {
    return services.reduce((total, service) => total + (servicePrices[service] || 0), 0);
}

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please login first.');
        window.location.href = './login.html';
        return;
    }

    const log = document.getElementById("log");
    const logout = document.getElementById("logout");
    const reg = document.getElementById("reg");

    log.style.display = "none";
    reg.style.display = "none";
    logout.style.display = "block";

    // Check if user is admin to show admin dashboard link
    const adminResponse = await fetch('/api/check-admin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());

    if (adminResponse.isAdmin) {
        document.querySelector('.admin-only').style.display = 'block';
    }

    // Fetch profile info
    const profileRes = await fetch('/api/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());

    if (profileRes.status === 'ok') {
        document.getElementById('fullname').textContent = profileRes.data.fullname;
        document.getElementById('email').textContent = profileRes.data.email;
        loadReservations(token);
    } else {
        alert(profileRes.error);
    }
});

async function loadReservations(token) {
    try {
        console.log('Fetching reservations with token:', token);
        const response = await fetch('/api/user-reservations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Received reservations data:', data);

        if (data.status !== 'ok') {
            throw new Error(data.message || 'Failed to load reservations');
        }

        const tbody = document.getElementById('reservations');
        tbody.innerHTML = '';

        if (!data.data.reservations.length) {
            console.log('No reservations found in data');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No reservations found.</td></tr>';
            return;
        }

        console.log('Processing reservations:', data.data.reservations);
        data.data.reservations.forEach(reservation => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reservation.services.join(', ')}</td>
                <td>${new Date(reservation.date).toLocaleDateString()}</td>
                <td>${reservation.time}</td>
                <td>${reservation.address}</td>
                <td>${calculateTotalPrice(reservation.services).toLocaleString()} EGP</td>
                <td><span class="badge bg-${getStatusColor(reservation.status)}">${reservation.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        document.getElementById('reservations').innerHTML = '<tr><td colspan="6" class="text-center">Error loading reservations.</td></tr>';
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        default:
            return 'warning';
    }
}

function logout1() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
