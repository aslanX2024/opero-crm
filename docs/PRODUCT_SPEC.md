# OPERO CRM - Product Specification Document

## Product Overview
OPERO is a comprehensive Real Estate CRM (Customer Relationship Management) system designed for real estate agencies in Turkey. It provides property management, customer tracking, appointment scheduling, and sales pipeline management.

**Target Users:**
- Real Estate Agents (Danışman)
- Brokers / Managers (Broker)  
- System Administrators (Admin)

**Tech Stack:** Next.js 15, React 19, Supabase, TailwindCSS

---

## User Roles & Permissions

### 1. Danışman (Agent)
- Manage personal property portfolio
- Track customers and leads
- Schedule appointments
- View personal dashboard with stats
- Access gamification features (XP, badges)

### 2. Broker (Manager)
- All Agent permissions
- View team performance dashboard
- Manage team members
- Access office-wide analytics
- Send announcements to team

### 3. Admin
- Full system access
- Manage blog posts
- Manage testimonials
- Manage FAQ content
- System configuration

---

## Core Features & User Flows

### Authentication Flow
1. **Login** (`/login`)
   - Email/password authentication
   - "Remember me" option
   - Password reset functionality
   
2. **Registration** (`/register`)
   - Full name, email, phone, password
   - Role selection (Agent/Broker)
   - Terms & KVKK acceptance
   - Email verification

### Dashboard (`/dashboard`)
- Statistics cards (Properties, Customers, Deals, Revenue)
- Quick action buttons
- Pipeline summary chart
- Recent activity feed
- Tasks list

### Property Management (`/dashboard/portfolio`)
- **List View**: Paginated property cards with filters
- **Map View**: Properties displayed on interactive Leaflet map
- **Add Property** (`/dashboard/portfolio/new`)
  - Property details (title, description, price)
  - Property type selection
  - Location picker with map
  - Image upload (multiple images)
  - Status selection (Active, Pending, Sold)

### Customer Management (`/dashboard/customers`)
- Customer list with search
- Add new customer form
- Customer detail view
- Contact history

### Appointments (`/dashboard/appointments`)
- Calendar view (Month, Week, Day)
- Appointment creation with:
  - Date/time selection
  - Customer selection
  - Property selection
  - Notes
  - Email notification option

### Sales Pipeline (`/dashboard/pipeline`)
- Kanban board with stages:
  - Lead
  - Contact Made
  - Showing Scheduled
  - Offer Made
  - Negotiation
  - Closed Won
  - Closed Lost
- Drag-and-drop deal movement
- Deal value tracking

### Broker Dashboard (`/dashboard/broker`)
- Team performance metrics
- Agent ranking table
- Monthly sales trend chart
- Alert system for inactive agents
- "Invite Agent" functionality

### Admin Panel (`/admin`)
- Dashboard overview
- Blog management (`/admin/blog`)
- Testimonial management (`/admin/testimonials`)
- FAQ management (`/admin/faq`)

---

## UI Components to Test

### Navigation
- Sidebar navigation with collapsible menu
- Header with search, notifications, user menu
- Command Palette (Cmd+K / Ctrl+K)
- Mobile responsive hamburger menu

### Forms
- Input validation (required fields, email format)
- Select dropdowns
- Date/time pickers
- File upload with preview
- Checkbox and toggle switches

### Interactive Elements
- Drag-and-drop (Pipeline Kanban)
- Map interactions (click, zoom, marker popups)
- Calendar navigation
- Tab switching
- Modal dialogs
- Toast notifications

### Theme
- Light/Dark mode toggle
- Theme persistence across sessions

---

## Test Scenarios

### Critical Paths
1. User Registration → Email Verification → Login → Dashboard Access
2. Add Property → View in List → View on Map → Edit Property
3. Create Appointment → Send Notification → View on Calendar
4. Create Deal → Move through Pipeline Stages → Close Deal

### Edge Cases
- Login with invalid credentials
- Submit form with missing required fields
- Upload oversized image
- Access admin panel as non-admin user
- Access broker dashboard as agent

### Responsive Testing
- Mobile viewport (320px - 480px)
- Tablet viewport (768px - 1024px)
- Desktop viewport (1280px+)

---

## API Endpoints (Supabase)

### Tables
- `profiles` - User profiles
- `properties` - Property listings
- `customers` - Customer records
- `deals` - Sales pipeline deals
- `appointments` - Scheduled appointments

### Storage Buckets
- `property-images` - Property photos
- `avatars` - User profile photos

---

## Environment

- **Frontend URL**: http://localhost:3000
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

---

## Notes for Testing

1. Demo mode available for development (no Supabase required)
2. Test accounts can be created via `/register`
3. Admin access requires manual role update in database
4. Map features require location coordinates in property data
