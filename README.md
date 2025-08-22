# Warehouse Management System

A simple web-based application that simulates a warehouse management system with primary and pseudo inventory tracking. This system helps manage material locations and handle discrepancies between the expected (primary) and actual (pseudo) inventory locations.

## Features

### Primary Warehouse System
- Tracks the official inventory data (location, material, quantity)
- Serves as the source of truth for where materials should be located
- Manages order fulfillment based on available inventory

### Pseudo Warehouse System
- Tracks the actual inventory data including discrepancies
- Identifies materials that are in incorrect locations
- Supports order fulfillment when primary system inventory is insufficient

### Order Processing
- Creates orders for specific materials and quantities
- Attempts to fulfill orders from the primary system first
- Falls back to the pseudo system when necessary
- Updates both systems to maintain data integrity
- Prevents new discrepancies by tracking material movements

### Location Verification
- Compares pseudo system data with primary system
- Identifies materials that are in incorrect locations
- Provides detailed reports of discrepancies

## How It Works

1. **Primary System**: Contains the official record of where materials should be located.
2. **Pseudo System**: Tracks where materials are actually located, including any discrepancies.
3. **Order Processing**:
   - When an order is created, the system first tries to fulfill it from the primary system.
   - If the primary system has insufficient inventory, the system checks the pseudo system.
   - When materials are taken from incorrect locations (in the pseudo system), the primary system is updated to prevent new discrepancies.
4. **Verification**: The system can verify locations by comparing the pseudo system data with the primary system data.

## Usage

1. Open `index.html` in a web browser.
2. Use the tabs to switch between the Primary and Pseudo systems.
3. Add items to either system using the "Add New Item" buttons.
4. Create orders using the "Create Order" button in the Primary system tab.
5. Verify locations using the "Verify Locations" button in the Pseudo system tab.

## Implementation Details

This application is built using vanilla HTML, CSS, and JavaScript without any external dependencies. Data is stored in memory and will be reset when the page is refreshed.

- **HTML**: Provides the structure and UI elements
- **CSS**: Handles styling and layout
- **JavaScript**: Implements the business logic and data management

## Future Enhancements

- Persistent data storage using localStorage or a backend database
- User authentication and role-based access control
- Barcode/QR code scanning for inventory management
- Reporting and analytics features
- Mobile-responsive design for warehouse floor use
