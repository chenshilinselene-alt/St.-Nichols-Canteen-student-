# Overview

Auntie Jenny is a school food preorder application that allows students to browse a menu of food items and place orders for pickup. The application features a modern React frontend with a Node.js/Express backend, designed with a kawaii (cute) aesthetic for an engaging student experience. Students can browse menu items, add them to a persistent cart, and complete orders through a simulated PayLah! payment system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture with the following key decisions:

- **Routing**: Uses Wouter for lightweight client-side routing between home and checkout pages
- **State Management**: Combines React Query for server state management with a custom cart store using localStorage for persistence across sessions
- **UI Framework**: Implements shadcn/ui components built on Radix UI primitives for accessible, customizable components with a kawaii design system
- **Styling**: Uses Tailwind CSS with custom CSS variables for theming, including kawaii color palette (pink, mint, lavender, cream, peach) and custom border radius values
- **Build Tool**: Vite for fast development and optimized production builds with hot module replacement

The cart functionality is implemented as a reactive store pattern that persists data locally and provides real-time updates across components. The application includes modal-based user interactions for cart management, payment processing, and order confirmation.

## Backend Architecture
The server follows a RESTful API design using Express.js with TypeScript:

- **API Structure**: RESTful endpoints for menu items (`/api/menu`) and order management (`/api/orders`)
- **Data Layer**: Abstracted storage interface with in-memory implementation for development, designed for easy migration to persistent databases
- **Request Handling**: Express middleware for JSON parsing, request logging with performance metrics, and error handling
- **Development**: Integrated Vite development server with hot module replacement for seamless development experience

The backend implements a storage abstraction pattern through an `IStorage` interface, allowing for easy migration from in-memory storage to persistent databases. The API provides endpoints for menu retrieval and order creation with simulated PayLah! payment processing.

## Data Storage Solutions
Currently uses an in-memory storage implementation with predefined menu data:

- **Menu Items**: Rice bowls, dumplings, and stir fry dishes with base prices, descriptions, and kawaii emojis
- **Orders**: Student information, selected items, pickup times, and payment status tracking
- **Database Schema**: Designed with Drizzle ORM for future PostgreSQL integration using Neon Database
- **Cart Persistence**: localStorage-based persistence for cart items across browser sessions

The schema is structured to support menu items with pricing, order tracking with student details, and JSONB storage for flexible item configurations.

## Form Handling and Validation
- **Form Management**: React Hook Form for efficient form state management and validation
- **Schema Validation**: Zod schemas for runtime type checking and validation on both client and server
- **UI Feedback**: Toast notifications for user feedback, loading states, and error handling with kawaii styling

## Payment Integration
- **Simulated PayLah!**: Mock payment processing with realistic delays and transaction ID generation
- **Order Flow**: Complete order lifecycle from cart to payment confirmation with status tracking

# External Dependencies

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL with migration support
- **Neon Database**: Serverless PostgreSQL database service for production deployment
- **PostgreSQL**: Primary database choice for persistent data storage

## UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives for accessible, customizable components
- **Radix UI**: Comprehensive collection of low-level UI primitives for building design systems
- **Tailwind CSS**: Utility-first CSS framework with custom kawaii theme configuration
- **Lucide React**: Icon library for consistent iconography throughout the application

## Development Tools
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **TypeScript**: Type safety across the entire application stack
- **React Query (TanStack Query)**: Server state management with caching and synchronization
- **React Hook Form**: Performant form management with minimal re-renders
- **Wouter**: Lightweight client-side routing solution

## Fonts and Assets
- **Google Fonts**: Nunito for kawaii styling and Inter for clean readability
- **Unsplash**: Stock photography for food item images with consistent 150x150 sizing