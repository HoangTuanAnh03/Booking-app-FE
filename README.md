# Booking Application Frontend

This is a frontend application for a booking system with three different interfaces: Admin, User, and Owner.

## Project Structure

The project consists of three main parts:
- Admin Panel (Port: 3002)
- User Interface (Port: 3000)
- Owner Dashboard (Port: 3001)

## Technologies Used

- React
- Tailwind CSS
- Framer Motion
- Axios
- Radix UI
- Other dependencies as listed in package.json

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HoangTuanAnh03/Booking-app-FE
cd booking-app-fe
```

2. Install dependencies for the main project:
```bash
npm install
```

3. Install dependencies for each sub-project:
```bash
cd admin && npm install
cd ../user && npm install
cd ../owner && npm install
```

### Running the Application

To run all three applications simultaneously:

```bash
npm run dev
```

This will start:
- Admin panel on http://localhost:3002
- User interface on http://localhost:3000
- Owner dashboard on http://localhost:3001