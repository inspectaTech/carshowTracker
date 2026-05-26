# CarShow Tracker

A modern car show management application built with TanStack Start (React), MongoDB, and Vite.

## Features

- **Landing Page**: Beautiful, responsive landing page with database connection status indicator
- **Authentication**: Login/Registration pages with OAuth support (Google, GitHub placeholders)
- **Dashboard**: Protected dashboard with event statistics, recent events, and quick actions
- **Database Integration**: MongoDB connection with health check API endpoint
- **Responsive Design**: Built with Tailwind CSS for all screen sizes
- **Modern Stack**: Uses TanStack Router for routing and TanStack Start for server-side rendering

## Tech Stack

- **Framework**: TanStack Start (React)
- **Routing**: TanStack Router
- **Database**: MongoDB
- **Styling**: Tailwind CSS v4
- **Bundler**: Vite
- **Icons**: Lucide React
- **Authentication**: Auth.js (placeholder - ready for implementation)

## Project Structure

```
carshowTracker/
├── src/
│   ├── components/
│   │   ├── Header.jsx     # Navigation header
│   │   └── Footer.jsx     # Footer with DB status
│   ├── routes/
│   │   ├── __root.jsx     # Root layout with header/footer
│   │   ├── index.jsx      # Landing page
│   │   ├── login.jsx      # Login/registration page
│   │   ├── dashboard.jsx  # Protected dashboard
│   │   └── api.health.jsx # Database health check API
│   ├── lib/
│   │   ├── db.js          # MongoDB connection utility
│   │   └── auth.js        # Authentication placeholder
│   ├── styles/
│   │   └── global.css     # Global styles & Tailwind config
│   ├── router.jsx         # TanStack Router configuration
│   ├── routeTree.gen.js   # Generated route tree
│   └── main.jsx           # Application entry point
├── public/
│   └── favicon.svg        # Application favicon
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── jsconfig.json          # JavaScript configuration
└── index.html             # HTML template
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- MongoDB (local or remote connection)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd carshowTracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):

   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

4. Generate route tree:
   ```bash
   npm run generate-routes
   ```

### Running the Application

1. Start MongoDB (if using local):

   ```bash
   # Make sure MongoDB is running locally on port 27017
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run generate-routes` - Generate route tree (run after adding new routes)

## Features in Detail

### Landing Page

- Responsive hero section with call-to-action buttons
- Database connection status indicator
- Feature showcase with icons
- Gradient backgrounds with dark mode support

### Authentication Pages

- Login and registration in a single page with toggle
- OAuth button placeholders for Google and GitHub
- Form validation
- Remember me and forgot password functionality

### Dashboard

- Protected route requiring authentication
- Statistics cards with icons and trends
- Recent events table with status badges
- Quick action buttons for common tasks
- User profile card and upcoming deadlines

### Database Integration

- MongoDB connection with connection pooling
- Health check API endpoint at `/api/health`
- Connection status displayed in footer
- Error handling for connection issues

## Next Steps for Production

1. **Add Auth.js Configuration**:
   - Install `@auth/tanstack-start-adapter` and `@auth/mongodb-adapter`
   - Configure OAuth providers (Google, GitHub, etc.)
   - Implement proper session management

2. **Expand Database Models**:
   - Add collections for events, participants, venues
   - Implement CRUD operations
   - Add data validation

3. **Add More Features**:
   - Event creation and management
   - Participant registration
   - Email notifications
   - File uploads (for car photos)

4. **Testing**:
   - Add unit tests with Vitest
   - Add integration tests
   - Add E2E tests

5. **Deployment**:
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Deploy to hosting platform (Vercel, Netlify, etc.)

## Development Notes

- The application uses JavaScript (not TypeScript) as requested
- All authentication is currently mocked with placeholder functions
- Database health check shows connection status but doesn't require MongoDB to run for basic functionality
- Dark mode is supported via CSS custom properties
- TanStack Devtools are included for development

## License

MIT
