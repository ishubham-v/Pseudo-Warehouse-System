// Global variables
let primaryData = [];
let pseudoData = [];
let orderData = [];
let activityLog = [];

// Constants
const PRIMARY_LOCATION = 'a1-01'; // Default primary location for steel rods

// Initialize sample data
function initializeSampleData() {
    // Primary system data - focusing on Steel Rods in primary location
    primaryData = [
        { id: 1, material: 'Steel Rods', location: PRIMARY_LOCATION, quantity: 100, status: 'In Stock', timestamp: new Date().toISOString() }
    ];
    
    // Pseudo system data (misplaced items)
    pseudoData = [
        { id: 1, material: 'Steel Rods', expectedLocation: PRIMARY_LOCATION, actualLocation: 'b2-05', quantity: 25, status: 'misplaced', timestamp: new Date().toISOString() }
    ];
    
    // Order data
    orderData = [
        { id: '57749991', material: 'Steel Rods', quantity: 85, status: 'pending', fulfilledFrom: '-', location: '-', timestamp: new Date().toISOString() }
    ];
    
    // Initialize activity log
    logActivity('System initialized with Steel Rods inventory');
    logActivity('Found 25 Steel Rods misplaced in b2-05 location');
    logActivity('Order #57749991 created for 85 Steel Rods');
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data
    initializeSampleData();
    
    // Initialize tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
    
    // Render initial tables
    renderPrimaryTable();
    renderPseudoTable();
    renderOrderTable();
    
    // Initialize material dropdowns
    populateMaterialDropdowns();
    
    // Add Primary Item Button
    document.getElementById('add-primary-item').addEventListener('click', function() {
        const material = document.getElementById('primary-material').value;
        const quantity = document.getElementById('primary-quantity').value;
        let location = document.getElementById('primary-location').value;
        
        // Default to PRIMARY_LOCATION for Steel Rods
        if (material === 'Steel Rods' && !location) {
            location = PRIMARY_LOCATION;
            document.getElementById('primary-location').value = PRIMARY_LOCATION;
        }
        
        if (material && quantity && location) {
            addPrimaryItem(location, material, quantity);
            
            // Clear form
            document.getElementById('primary-material').value = '';
            document.getElementById('primary-quantity').value = '0';
            document.getElementById('primary-location').value = '';
            
            // Log the activity
            logActivity(`Added ${quantity} ${material} to primary inventory at ${location}`);
        }
    });
    
    // Add Pseudo Item Button
    document.getElementById('add-pseudo-item').addEventListener('click', function() {
        const material = document.getElementById('pseudo-material').value;
        const expectedLocation = document.getElementById('pseudo-expected-location').value;
        const actualLocation = document.getElementById('pseudo-actual-location').value;
        const quantity = document.getElementById('pseudo-quantity').value;
        
        // Validate input for Steel Rods
        if (material === 'Steel Rods') {
            // Ensure expected location is PRIMARY_LOCATION for Steel Rods
            if (expectedLocation !== PRIMARY_LOCATION) {
                alert(`Steel Rods expected location must be ${PRIMARY_LOCATION}`);
                document.getElementById('pseudo-expected-location').value = PRIMARY_LOCATION;
                return;
            }
        }
        
        if (material && expectedLocation && actualLocation && quantity) {
            addPseudoItem(expectedLocation, actualLocation, material, quantity);
            
            // Clear form
            document.getElementById('pseudo-material').value = '';
            document.getElementById('pseudo-expected-location').value = '';
            document.getElementById('pseudo-actual-location').value = '';
            document.getElementById('pseudo-quantity').value = '0';
            
            // Log the activity
            logActivity(`Added ${quantity} ${material} to pseudo inventory at ${actualLocation} (expected: ${expectedLocation})`);
        }
    });
    
    // Create Order Button
    document.getElementById('create-order').addEventListener('click', function() {
        const material = document.getElementById('order-material').value;
        const quantity = document.getElementById('order-quantity').value;
        const location = document.getElementById('order-expected-location').value;
        
        if (material && quantity && location) {
            createOrder(material, quantity, location);
            
            // Clear form
            document.getElementById('order-material').value = '';
            document.getElementById('order-quantity').value = '0';
            document.getElementById('order-expected-location').value = '';
        }
    });
    
    // Material Selection Change (Pseudo System)
    document.getElementById('pseudo-material').addEventListener('change', function() {
        const selectedMaterial = this.value;
        
        // For Steel Rods, always set expected location to PRIMARY_LOCATION
        if (selectedMaterial === 'Steel Rods') {
            document.getElementById('pseudo-expected-location').value = PRIMARY_LOCATION;
            return;
        }
        
        const materialItem = primaryData.find(item => item.material === selectedMaterial);
        
        if (materialItem) {
            document.getElementById('pseudo-expected-location').value = materialItem.location;
        } else {
            document.getElementById('pseudo-expected-location').value = '';
        }
    });
    
    // Material Selection Change (Order System)
    document.getElementById('order-material').addEventListener('change', function() {
        const selectedMaterial = this.value;
        
        // For Steel Rods, always set expected location to PRIMARY_LOCATION
        if (selectedMaterial === 'Steel Rods') {
            document.getElementById('order-expected-location').value = PRIMARY_LOCATION;
            return;
        }
        
        const materialItem = primaryData.find(item => item.material === selectedMaterial);
        
        if (materialItem) {
            document.getElementById('order-expected-location').value = materialItem.location;
        } else {
            document.getElementById('order-expected-location').value = '';
        }
    });
});

// Helper Functions
function populateMaterialDropdowns() {
    // Get unique materials from primary data
    const materials = [...new Set(primaryData.map(item => item.material))];
    
    // Always ensure Steel Rods is in the materials list
    if (!materials.includes('Steel Rods')) {
        materials.push('Steel Rods');
    }
    
    // Populate pseudo system dropdown
    const pseudoSelect = document.getElementById('pseudo-material');
    pseudoSelect.innerHTML = '<option value="">Select...</option>';
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material;
        pseudoSelect.appendChild(option);
    });
    
    // Populate order system dropdown
    const orderSelect = document.getElementById('order-material');
    orderSelect.innerHTML = '<option value="">Select material</option>';
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material;
        orderSelect.appendChild(option);
    });
    
    // Update dashboard stats
    updateDashboardStats();
}

// Render Functions
function renderPrimaryTable() {
    const tbody = document.querySelector('#primary-table tbody');
    tbody.innerHTML = '';
    
    primaryData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.material}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td><span class="status-badge in-stock"><i class="fas fa-check-circle"></i> ${item.status}</span></td>
            <td>
                <button class="action-btn edit-btn">Clear Stock</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderPseudoTable() {
    const tbody = document.querySelector('#pseudo-table tbody');
    tbody.innerHTML = '';
    
    pseudoData.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.material}</td>
            <td>${item.expectedLocation}</td>
            <td><span style="color: #ea4335;">${item.actualLocation}</span></td>
            <td>${item.quantity}</td>
            <td><span class="status-badge misplaced">Misplaced</span></td>
            <td>
                <button class="action-btn delete-btn">Remove</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderOrderTable() {
    const tbody = document.querySelector('#order-table tbody');
    tbody.innerHTML = '';
    
    orderData.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.material}</td>
            <td>${order.quantity}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${order.fulfilledFrom || '-'}</td>
            <td>${order.location || '-'}</td>
            <td>
                <button class="action-button small" data-order-id="${order.id}">Process</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to the Process buttons
    document.querySelectorAll('#order-table .action-button').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            processOrder(orderId);
        });
    });
}

function createOrder(material, quantity, location) {
    // Generate a random order ID
    const orderId = Math.floor(Math.random() * 10000000).toString().padStart(8, '0');
    
    // Create new order
    const newOrder = {
        id: orderId,
        material: material,
        quantity: quantity,
        status: 'pending',
        fulfilledFrom: '-',
        location: location,
        timestamp: new Date().toISOString()
    };
    
    // Add to order data
    orderData.push(newOrder);
    
    // Update table
    renderOrderTable();
    
    // Log the activity
    logActivity(`Created order #${orderId} for ${quantity} ${material}`);
    
    // Process the order automatically if it's for Steel Rods
    if (material === 'Steel Rods') {
        processOrder(orderId);
    }
}

function addPrimaryItem(location, material, quantity) {
    // For Steel Rods, enforce primary location (as per requirement 1)
    if (material === 'Steel Rods') {
        // If location is not specified, default to PRIMARY_LOCATION
        if (!location || location.trim() === '') {
            location = PRIMARY_LOCATION;
        }
        // If location is specified but not PRIMARY_LOCATION, create a pseudo item instead
        else if (location !== PRIMARY_LOCATION) {
            addPseudoItem(PRIMARY_LOCATION, location, material, quantity);
            return;
        }
    }
    
    // Check if item already exists at this location
    const existingItem = primaryData.find(item => 
        item.material === material && item.location === location
    );
    
    if (existingItem) {
        // Update existing item
        existingItem.quantity += parseInt(quantity);
        logActivity(`Updated ${material} quantity at ${location} to ${existingItem.quantity}`);
    } else {
        // Create new item
        const newItem = {
            id: primaryData.length + 1,
            location: location,
            material: material,
            quantity: parseInt(quantity),
            status: 'In Stock',
            timestamp: new Date().toISOString()
        };
        
        // Add to primary data
        primaryData.push(newItem);
    }
    
    // Update table
    renderPrimaryTable();
    
    // Update material dropdowns
    populateMaterialDropdowns();
}

function addPseudoItem(expectedLocation, actualLocation, material, quantity) {
    // Validate input
    if (!validatePseudoItem(expectedLocation, actualLocation, material, quantity)) {
        return false;
    }
    
    // Check if item already exists at this location
    const existingItem = pseudoData.find(item => 
        item.material === material && 
        item.actualLocation === actualLocation && 
        item.expectedLocation === expectedLocation
    );
    
    if (existingItem) {
        // Update existing item
        existingItem.quantity += parseInt(quantity);
        logActivity(`Updated ${material} quantity at ${actualLocation} to ${existingItem.quantity}`);
    } else {
        // Create new item
        const newItem = {
            id: pseudoData.length + 1,
            expectedLocation: expectedLocation,
            actualLocation: actualLocation,
            material: material,
            quantity: parseInt(quantity),
            status: 'misplaced',
            timestamp: new Date().toISOString()
        };
        
        // Add to pseudo data
        pseudoData.push(newItem);
    }
    
    // Update table
    renderPseudoTable();
    
    // Update misplaced badge count
    document.getElementById('misplaced-badge').textContent = `Misplaced Items: ${pseudoData.length}`;
    
    return true;
}

// Process an order with the specified ID
function processOrder(orderId) {
    const order = orderData.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') return;
    
    const material = order.material;
    let remainingQuantity = parseInt(order.quantity);
    let fulfilledLocations = [];
    
    // Step 1: First fulfill from discrepancy locations (as per requirement 3)
    const discrepancyItems = pseudoData.filter(item => 
        item.material === material && item.quantity > 0
    );
    
    for (const item of discrepancyItems) {
        if (remainingQuantity <= 0) break;
        
        const quantityToUse = Math.min(remainingQuantity, item.quantity);
        remainingQuantity -= quantityToUse;
        item.quantity -= quantityToUse;
        
        fulfilledLocations.push(`${quantityToUse} from ${item.actualLocation}`);
        
        logActivity(`Used ${quantityToUse} ${material} from discrepancy location ${item.actualLocation} for order ${orderId}`);
        
        // Remove location from pseudo-system when fully depleted (as per requirement 3c)
        if (item.quantity <= 0) {
            pseudoData = pseudoData.filter(p => p.id !== item.id);
            logActivity(`Removed empty discrepancy location ${item.actualLocation} from system`);
            // Update misplaced badge count
            document.getElementById('misplaced-badge').textContent = `Misplaced Items: ${pseudoData.length}`;
        }
    }
    
    // Step 2: Use primary location if discrepancy stock is insufficient
    if (remainingQuantity > 0) {
        const primaryItem = primaryData.find(item => 
            item.material === material && item.location === PRIMARY_LOCATION && item.quantity > 0
        );
        
        if (primaryItem) {
            const quantityToUse = Math.min(remainingQuantity, primaryItem.quantity);
            remainingQuantity -= quantityToUse;
            primaryItem.quantity -= quantityToUse;
            
            fulfilledLocations.push(`${quantityToUse} from ${PRIMARY_LOCATION}`);
            
            logActivity(`Used ${quantityToUse} ${material} from primary location ${PRIMARY_LOCATION} for order ${orderId}`);
            
            // Remove from primary if fully depleted
            if (primaryItem.quantity <= 0) {
                primaryData = primaryData.filter(p => p.id !== primaryItem.id);
                logActivity(`Removed empty primary location ${PRIMARY_LOCATION} from system`);
            }
        }
    }
    
    // Update order status
    if (remainingQuantity <= 0) {
        order.status = 'fulfilled';
        order.fulfilledFrom = fulfilledLocations.join(', ');
        logActivity(`Order ${orderId} fully fulfilled`);
    } else if (fulfilledLocations.length > 0) {
        order.status = 'partial';
        order.fulfilledFrom = fulfilledLocations.join(', ');
        logActivity(`Order ${orderId} partially fulfilled (${order.quantity - remainingQuantity}/${order.quantity})`);
    } else {
        order.status = 'unfulfilled';
        logActivity(`Order ${orderId} could not be fulfilled due to insufficient inventory`);
    }
    
    // Update tables
    renderPrimaryTable();
    renderPseudoTable();
    renderOrderTable();
    updateDashboardStats();
}

// Validate pseudo item (as per requirement 4 - schema validation)
function validatePseudoItem(expectedLocation, actualLocation, material, quantity) {
    // Basic validation
    if (!expectedLocation || !actualLocation || !material || !quantity) {
        alert('All fields are required');
        return false;
    }
    
    // For Steel Rods, expected location must be PRIMARY_LOCATION
    if (material === 'Steel Rods' && expectedLocation !== PRIMARY_LOCATION) {
        alert(`Steel Rods expected location must be ${PRIMARY_LOCATION}`);
        return false;
    }
    
    // Cannot have the same expected and actual location
    if (expectedLocation === actualLocation) {
        alert('Expected and actual locations cannot be the same');
        return false;
    }
    
    // Validate location format (e.g., a1-01, b2-05)
    const locationRegex = /^[a-z][0-9]-[0-9]{2}$/;
    if (!locationRegex.test(expectedLocation) || !locationRegex.test(actualLocation)) {
        alert('Locations must be in format: letter+number-number (e.g., a1-01)');
        return false;
    }
    
    // Validate quantity is a positive number
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
        alert('Quantity must be a positive number');
        return false;
    }
    
    return true;
}

// Log activity
function logActivity(message) {
    const timestamp = new Date().toISOString();
    activityLog.push({ timestamp, message });
    console.log(`[${timestamp}] ${message}`);
}

// Update dashboard statistics
function updateDashboardStats() {
    // Calculate total inventory
    const primaryTotal = primaryData.reduce((sum, item) => sum + item.quantity, 0);
    const pseudoTotal = pseudoData.reduce((sum, item) => sum + item.quantity, 0);
    const totalInventory = primaryTotal + pseudoTotal;
    
    // Update dashboard
    document.getElementById('total-inventory').textContent = totalInventory;
    document.getElementById('misplaced-items').textContent = pseudoData.length;
    document.getElementById('pending-orders').textContent = orderData.filter(order => order.status === 'pending').length;
    document.getElementById('material-types').textContent = [...new Set([...primaryData, ...pseudoData].map(item => item.material))].length;
}
