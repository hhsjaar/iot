# Irrigation Monitoring System

This is a web-based dashboard for monitoring and controlling an IoT irrigation system based on the specifications in `app_summary.md`. The system includes real-time sensor monitoring, pump control, and alert management.

## Features

- Real-time sensor monitoring (soil moisture, water level, turbidity)
- Pump control with automatic and manual modes
- Historical data visualization
- System status monitoring
- Alert and emergency management
- Responsive design for desktop and mobile

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Fully compatible with Vercel deployment

## Deployment to Vercel

This application is ready for deployment to Vercel. Follow these steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign up/log in
3. Click "New Project" and import your repository
4. Vercel will automatically detect this is a Next.js project and configure the build settings
5. Click "Deploy" and your application will be live in seconds

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app/irrigation` - Main dashboard and related components
- `/app/irrigation/components` - Reusable dashboard components
- `/app/irrigation/page.tsx` - Main dashboard page
- `/app/irrigation/layout.tsx` - Dashboard layout

The application follows the irrigation monitoring system specifications from `app_summary.md`, providing a comprehensive interface for monitoring soil moisture, water levels, turbidity, and controlling pump operations.