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

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Check if user is admin
    fetch('/api/check-admin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.isAdmin) {
            window.location.href = '/profile.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = '/login.html';
    });

    // Load dashboard data by default
    loadDashboardData();
});

// Function to switch between sections
function showSection(sectionName) {
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Load section data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'users') {
        loadUsersData();
    }
}

async function loadDashboardData() {
    const token = localStorage.getItem('token');
    try {
        // Load total bookings
        const bookingsResponse = await fetch('/api/admin/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const bookingsData = await bookingsResponse.json();
        document.getElementById('totalBookings').textContent = bookingsData.total;

        // Load total users
        const usersResponse = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const usersData = await usersResponse.json();
        document.getElementById('totalUsers').textContent = usersData.total;

        // Load recent bookings
        const recentBookingsResponse = await fetch('/api/admin/recent-bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const recentBookings = await recentBookingsResponse.json();
        displayRecentBookings(recentBookings.bookings);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadUsersData() {
    const token = localStorage.getItem('token');
    try {
        console.log('Fetching users with token:', token); // Debug log
        const response = await fetch('/api/admin/users/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Received users data:', data); // Debug log
        displayUsers(data.users);
    } catch (error) {
        console.error('Error loading users data:', error);
    }
}

function displayUsers(users) {
    console.log('Displaying users:', users); // Debug log
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No users found</td></tr>';
        return;
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function displayRecentBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    tbody.innerHTML = '';

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No bookings found</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.services.join(', ')}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>${booking.time}</td>
            <td>${calculateTotalPrice(booking.services).toLocaleString()} EGP</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="updateBookingStatus('${booking._id}', 'approved')">
                    <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="updateBookingStatus('${booking._id}', 'rejected')">
                    <i class="bi bi-x"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        default:
            return 'secondary';
    }
}

async function updateBookingStatus(bookingId, status) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/admin/booking-status/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            loadDashboardData(); // Refresh the data
        } else {
            alert('Failed to update booking status');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Error updating booking status');
    }
}

function logout1() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
} 