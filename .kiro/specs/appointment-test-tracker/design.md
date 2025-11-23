# Design Document

## Overview

The Appointment & Test Tracker is a browser-based web application for managing medical appointments and tests. The system provides a modern, visually appealing interface using Neomorphism 2.0 and Skeuomorphism design principles. Users can add, view, manage, and print appointments with preparation notes, with optional Google Calendar integration for reminders. All data is persisted locally in the browser's localStorage, ensuring privacy and offline functionality.

The application is built as a single-page application (SPA) with responsive design to support desktop, tablet, and mobile devices. The architecture emphasizes simplicity, maintainability, and a clean separation between data management, business logic, and presentation layers.

## Architecture

### Technology Stack

**Frontend Framework**: React with TypeScript
- Rationale: React provides component-based architecture for maintainable UI, TypeScript adds type safety to prevent runtime errors, and both have excellent ecosystem support

**Styling**: CSS Modules with CSS-in-JS option (styled-components or emotion)
- Rationale: CSS Modules provide scoped styling to prevent conflicts, while CSS-in-JS enables dynamic theming for Neomorphism effects and dark mode

**State Management**: React Context API with useReducer
- Rationale: For this application's scope, Context API is sufficient and avoids the complexity of external state management libraries

**Storage**: Browser localStorage API
- Rationale: Meets the requirement for local persistence, works offline, and requires no backend infrastructure

**Calendar Integration**: Google Calendar API (optional feature)
- Rationale: Industry-standard calendar integration with comprehensive documentation

**Build Tool**: Vite
- Rationale: Fast development server, optimized production builds, excellent TypeScript support

### Application Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + UI Logic)          │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │  Forms   │  │  Lists   │  ...      │
│  └──────────┘  └──────────┘           │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Application Layer               │
│  (Business Logic + State Management)    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   AppointmentContext (State)     │  │
│  └──────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│          Service Layer                  │
│  (Data Operations + External APIs)      │
│                                         │
│  ┌──────────┐  ┌──────────────────┐   │
│  │ Storage  │  │ Google Calendar  │   │
│  │ Service  │  │    Service       │   │
│  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
```

**Layer Responsibilities**:

1. **Presentation Layer**: React components that render UI and handle user interactions
2. **Application Layer**: Business logic, validation, state management via Context API
3. **Service Layer**: Abstracted data persistence (localStorage) and external API integration (Google Calendar)

This layered architecture ensures:
- Clear separation of concerns
- Testability of business logic independent of UI
- Easy substitution of storage mechanisms or external services
- Maintainability as features are added

## Components and Interfaces

### Core Data Types

```typescript
interface Appointment {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Appointment name (required, non-empty)
  datetime: Date;                // Scheduled date and time (required, must be future)
  location?: string;             // Optional location
  preparationNotes?: string;     // Optional preparation instructions
  createdAt: Date;               // Timestamp of creation
  googleCalendarEventId?: string; // Optional Google Calendar event ID
}

interface AppointmentFormData {
  name: string;
  datetime: string;              // ISO 8601 string for form input
  location: string;
  preparationNotes: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface AppState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  googleCalendarConnected: boolean;
}
```

### Service Interfaces

```typescript
interface StorageService {
  saveAppointments(appointments: Appointment[]): void;
  loadAppointments(): Appointment[];
  clear(): void;
  saveThemePreference(theme: 'light' | 'dark'): void;
  loadThemePreference(): 'light' | 'dark' | null;
}

interface GoogleCalendarService {
  authenticate(): Promise<void>;
  isAuthenticated(): boolean;
  createEvent(appointment: Appointment, reminderMinutes: number): Promise<string>;
  disconnect(): void;
}

interface ValidationService {
  validateAppointment(data: AppointmentFormData): ValidationError[];
  isDatetimeInFuture(datetime: Date): boolean;
  isNonEmptyString(value: string): boolean;
}
```

### Component Structure

**AppointmentForm**: Form component for creating new appointments
- Props: `onSubmit: (appointment: AppointmentFormData) => void`
- Handles form state, validation, and user input
- Displays validation errors inline

**AppointmentList**: Displays sorted list of appointments
- Props: `appointments: Appointment[], onMarkDone: (id: string) => void, onDelete: (id: string) => void`
- Renders AppointmentItem components
- Shows empty state when no appointments exist

**AppointmentItem**: Individual appointment display
- Props: `appointment: Appointment, onMarkDone: () => void, onDelete: () => void, isPast: boolean`
- Applies visual styling based on past/future status
- Handles confirmation dialogs for actions

**PrintableChecklist**: Printer-friendly view of upcoming appointments
- Props: `appointments: Appointment[]`
- Filters out past appointments
- Applies print-optimized styling

**GoogleCalendarIntegration**: Optional calendar connection UI
- Props: `onConnect: () => void, isConnected: boolean`
- Manages authentication flow
- Provides reminder settings for new appointments

**ThemeToggle**: Optional dark/light mode switcher
- Props: `currentTheme: 'light' | 'dark', onToggle: () => void`
- Persists theme preference

**FilterPanel**: Optional filtering UI
- Props: `onFilterChange: (filters: FilterCriteria) => void`
- Supports keyword and date range filtering

## Data Models

### Appointment Data Model

The `Appointment` is the core entity in the system:

```typescript
interface Appointment {
  id: string;                    // UUID v4 for uniqueness
  name: string;                  // 1-200 characters
  datetime: Date;                // Must be future datetime at creation
  location?: string;             // 0-500 characters
  preparationNotes?: string;     // 0-2000 characters
  createdAt: Date;               // Auto-generated timestamp
  googleCalendarEventId?: string; // Set when synced to Google Calendar
}
```

**Validation Rules**:
- `name`: Required, non-empty after trimming, max 200 characters
- `datetime`: Required, must be valid Date object, must be in future at creation time
- `location`: Optional, max 500 characters
- `preparationNotes`: Optional, max 2000 characters
- `id`: Auto-generated UUID v4
- `createdAt`: Auto-generated current timestamp

### Storage Format

Appointments are serialized to JSON and stored in localStorage under the key `appointments`:

```json
{
  "appointments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Annual Physical",
      "datetime": "2025-12-01T10:00:00.000Z",
      "location": "Main Street Clinic",
      "preparationNotes": "Fasting required - no food 8 hours before",
      "createdAt": "2025-11-23T15:30:00.000Z",
      "googleCalendarEventId": "abc123xyz"
    }
  ]
}
```

**Date Handling**: Dates are stored as ISO 8601 strings in localStorage and deserialized to Date objects when loaded.

**Error Handling**: If localStorage data is corrupted, the application initializes with an empty array and logs the error.

### State Management Model

Application state is managed through React Context with the following structure:

```typescript
interface AppState {
  appointments: Appointment[];           // All appointments
  isLoading: boolean;                   // Loading indicator
  error: string | null;                 // Error message
  theme: 'light' | 'dark';             // Current theme
  googleCalendarConnected: boolean;     // Calendar connection status
}

type AppAction =
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'MARK_DONE'; payload: string }
  | { type: 'LOAD_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_GOOGLE_CALENDAR_STATUS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Valid appointment creation increases list size
*For any* valid appointment data (non-empty name, future datetime, optional location and preparation notes), creating an appointment should increase the appointments list length by one and the new appointment should be present in the list.
**Validates: Requirements 1.1, 1.4**

### Property 2: Invalid appointments are rejected with validation errors
*For any* appointment data with missing required fields (empty name or missing datetime), the validation should fail and return appropriate error messages for each missing field.
**Validates: Requirements 1.2**

### Property 3: Past datetime appointments are rejected
*For any* datetime value that is in the past, attempting to create an appointment should fail validation and return an error message indicating the datetime must be in the future.
**Validates: Requirements 1.3**

### Property 4: Appointments are always sorted by datetime ascending
*For any* list of appointments, when displayed, they should be ordered by datetime in ascending order (earliest first).
**Validates: Requirements 2.1, 10.4**

### Property 5: Appointment display contains all required information
*For any* appointment, the rendered display should contain the appointment name, formatted datetime, location (if present), and preparation notes (truncated if needed).
**Validates: Requirements 2.2**

### Property 6: Past appointments are visually distinguished
*For any* appointment whose datetime has passed, the rendering function should apply different styling (grayed out or strikethrough) compared to future appointments.
**Validates: Requirements 2.3**

### Property 7: Removal operations delete appointments
*For any* appointment in the list, performing a mark-as-done or delete operation should remove that appointment from the list and from storage.
**Validates: Requirements 3.1, 3.2**

### Property 8: Destructive actions require confirmation
*For any* mark-as-done or delete operation, the confirmation function should be invoked before the operation executes.
**Validates: Requirements 3.4**

### Property 9: Printable checklist contains only future appointments
*For any* list of appointments containing both past and future appointments, the printable checklist should include only appointments with future datetimes.
**Validates: Requirements 4.1**

### Property 10: Printable checklist includes complete appointment details
*For any* appointment in the printable checklist, the rendered output should include the appointment name, datetime, location, and full preparation notes (not truncated).
**Validates: Requirements 4.2**

### Property 11: Appointment persistence round trip
*For any* valid appointment, saving it to storage and then loading from storage should produce an equivalent appointment with the same data.
**Validates: Requirements 5.1, 5.2**

### Property 12: Theme preference persistence round trip
*For any* theme setting ('light' or 'dark'), saving the preference and then loading it should return the same theme value.
**Validates: Requirements 9.1, 9.3**

### Property 13: Keyword filter matches relevant fields
*For any* keyword and list of appointments, the filtered results should include only appointments where the keyword appears in the name, location, or preparation notes (case-insensitive).
**Validates: Requirements 10.1**

### Property 14: Date range filter includes only appointments within range
*For any* date range (start and end dates) and list of appointments, the filtered results should include only appointments whose datetime falls within the specified range (inclusive).
**Validates: Requirements 10.2**

### Property 15: Clearing filters restores full appointment list
*For any* filtered appointment list, clearing all filters should return the complete unfiltered list of appointments.
**Validates: Requirements 10.3**

## Error Handling

### Validation Errors

**Form Validation**:
- All form inputs are validated before submission
- Validation errors are displayed inline next to the relevant field
- Multiple validation errors can be shown simultaneously
- Form submission is prevented until all validation errors are resolved

**Validation Rules**:
- Name: Required, non-empty after trimming, max 200 characters
- Datetime: Required, must be valid date, must be in future
- Location: Optional, max 500 characters
- Preparation Notes: Optional, max 2000 characters

**Error Messages**:
- "Name is required"
- "Please enter a valid date and time"
- "Date and time must be in the future"
- "Location cannot exceed 500 characters"
- "Preparation notes cannot exceed 2000 characters"

### Storage Errors

**localStorage Failures**:
- If localStorage is unavailable (private browsing, quota exceeded), display a warning message
- Application continues to function with in-memory state only
- User is notified that data will not persist across sessions

**Data Corruption**:
- If stored data cannot be parsed as valid JSON, log error to console
- Initialize with empty appointments array
- Display notification: "Unable to load saved appointments. Starting fresh."

**Data Migration**:
- If stored data format changes in future versions, implement migration logic
- Gracefully handle missing or renamed fields
- Preserve as much user data as possible

### Google Calendar Integration Errors

**Authentication Failures**:
- Display error message: "Unable to connect to Google Calendar. Please try again."
- Allow user to retry authentication
- Application remains fully functional without calendar integration

**API Request Failures**:
- If calendar event creation fails, display error message
- Appointment is still saved locally
- User can retry calendar sync later
- Error message: "Appointment saved locally, but could not sync to Google Calendar"

**Network Errors**:
- Detect offline status before attempting API calls
- Display appropriate message: "You appear to be offline. Calendar sync will be attempted when connection is restored."
- Queue failed requests for retry when online (optional enhancement)

### User Confirmation Dialogs

**Destructive Actions**:
- Mark as done: "Mark this appointment as done? This will remove it from your list."
- Delete: "Permanently delete this appointment? This action cannot be undone."
- Both actions require explicit confirmation (OK/Cancel)

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples, edge cases, and component behavior:

**Validation Logic**:
- Test validation with empty name
- Test validation with past datetime
- Test validation with future datetime
- Test validation with boundary values (max length strings)
- Test validation with whitespace-only strings

**Date Handling**:
- Test date parsing from ISO strings
- Test date formatting for display
- Test timezone handling
- Test "is past" logic at boundary (current moment)

**Storage Service**:
- Test saving and loading empty array
- Test saving and loading single appointment
- Test saving and loading multiple appointments
- Test handling of corrupted JSON
- Test handling of missing localStorage

**Component Rendering**:
- Test empty state display
- Test single appointment display
- Test past appointment styling
- Test form validation error display

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs. We will use **fast-check** as the property-based testing library for JavaScript/TypeScript.

**Configuration**:
- Each property test should run a minimum of 100 iterations
- Each test must be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: appointment-test-tracker, Property {number}: {property_text}`

**Test Generators**:

Custom generators will be created for:
- Valid appointment data (random names, future dates, optional fields)
- Invalid appointment data (missing fields, past dates)
- Date ranges (random start/end dates)
- Keywords for filtering
- Lists of appointments with mixed past/future dates

**Property Test Coverage**:

Each correctness property listed above will be implemented as a single property-based test:
- Property 1: Test with random valid appointment data
- Property 2: Test with random invalid appointment data
- Property 3: Test with random past datetimes
- Property 4: Test with random unsorted appointment lists
- Property 5: Test with random appointments, verify rendered output
- Property 6: Test with random past/future appointments, verify styling
- Property 7: Test with random appointments and removal operations
- Property 8: Test that confirmation is called before operations
- Property 9: Test with random mixed past/future appointment lists
- Property 10: Test with random appointments, verify printable output
- Property 11: Test with random appointments, verify save/load round trip
- Property 12: Test with random theme values, verify save/load round trip
- Property 13: Test with random keywords and appointment data
- Property 14: Test with random date ranges and appointment data
- Property 15: Test that clearing filters restores original list

### Integration Testing

Integration tests will verify end-to-end workflows:
- Complete appointment creation flow (form → validation → storage → display)
- Complete appointment deletion flow (confirmation → removal → storage update)
- Filter application and clearing flow
- Theme switching and persistence flow
- Print view generation flow

### Accessibility Testing

- Automated accessibility testing with axe-core or similar tool
- Keyboard navigation testing (tab order, enter/escape handling)
- Screen reader testing with NVDA or JAWS
- Color contrast validation for WCAG AA compliance

### Browser Compatibility Testing

- Test in Chrome, Firefox, Safari, Edge
- Test localStorage behavior across browsers
- Test responsive design at various viewport sizes
- Test print functionality across browsers

## Visual Design Specifications

### Neomorphism 2.0 Design

**Core Principles**:
- Soft, subtle shadows to create depth
- Elements appear to extrude from or indent into the background
- Minimal color palette with emphasis on light and shadow
- Smooth, rounded corners (border-radius: 12-20px)

**Shadow Specifications**:
```css
/* Extruded element (button, card) */
box-shadow: 
  8px 8px 16px rgba(0, 0, 0, 0.15),
  -8px -8px 16px rgba(255, 255, 255, 0.7);

/* Indented element (input field) */
box-shadow: 
  inset 4px 4px 8px rgba(0, 0, 0, 0.1),
  inset -4px -4px 8px rgba(255, 255, 255, 0.5);

/* Hover state */
box-shadow: 
  4px 4px 8px rgba(0, 0, 0, 0.15),
  -4px -4px 8px rgba(255, 255, 255, 0.7);
```

### Skeuomorphism Elements

**Checklist Metaphor**:
- Printable checklist styled to resemble physical paper
- Checkbox elements that look like real checkboxes
- Subtle paper texture or grain

**Calendar/Date Picker**:
- Date input styled to resemble a calendar page
- Torn edge effect or page curl (subtle)

**Form Elements**:
- Input fields with subtle depth to appear recessed
- Buttons with tactile appearance (raised, pressable)

### Color Palette

**Light Mode**:
- Background: #E0E5EC (soft gray-blue)
- Surface: #FFFFFF
- Primary: #6C63FF (purple-blue)
- Text Primary: #2D3748
- Text Secondary: #718096
- Success: #48BB78
- Error: #F56565
- Past Appointment: #A0AEC0 (muted gray)

**Dark Mode**:
- Background: #1A202C
- Surface: #2D3748
- Primary: #9F7AEA (lighter purple)
- Text Primary: #F7FAFC
- Text Secondary: #CBD5E0
- Success: #68D391
- Error: #FC8181
- Past Appointment: #4A5568

### Typography

- Font Family: 'Inter' or 'SF Pro' for clean, modern appearance
- Headings: 600 weight, 1.5-2rem size
- Body: 400 weight, 1rem size
- Small text: 0.875rem size
- Line height: 1.5 for readability

### Responsive Breakpoints

- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (two column where appropriate)
- Desktop: > 1024px (full layout with sidebar if needed)

### Accessibility Considerations

- Minimum touch target size: 44x44px
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Focus indicators: 2px solid outline with high contrast color
- Skip to main content link for keyboard users
- ARIA labels for icon-only buttons
- Semantic HTML elements (button, nav, main, etc.)

## Implementation Notes

### Technology Choices Rationale

**React + TypeScript**:
- Component-based architecture promotes reusability
- TypeScript prevents common runtime errors through static typing
- Large ecosystem and community support
- Excellent developer experience with hot reloading

**Context API vs Redux**:
- Context API is sufficient for this application's state complexity
- Avoids boilerplate and additional dependencies
- Easier to understand and maintain for smaller teams
- Can migrate to Redux later if state management becomes complex

**localStorage vs Backend**:
- Meets requirement for local storage
- No server infrastructure needed (lower cost, simpler deployment)
- Works offline by default
- Privacy-friendly (data never leaves user's device)
- Limitation: Data not synced across devices (acceptable for MVP)

**Vite vs Create React App**:
- Vite offers significantly faster development server startup
- Better build performance
- Native ESM support
- More modern tooling

### Performance Considerations

**Rendering Optimization**:
- Use React.memo for appointment list items to prevent unnecessary re-renders
- Implement virtual scrolling if appointment list exceeds 100 items
- Debounce filter input to avoid excessive re-filtering

**Storage Optimization**:
- Limit appointments array to reasonable size (e.g., 1000 items)
- Implement data cleanup for very old appointments (optional feature)
- Compress data before storing if approaching localStorage limits (5-10MB)

**Bundle Size**:
- Code splitting for optional features (Google Calendar integration)
- Lazy load print view component
- Tree-shaking to eliminate unused code
- Target bundle size: < 200KB gzipped for main bundle

### Security Considerations

**Input Sanitization**:
- Sanitize all user input before rendering to prevent XSS
- Use React's built-in escaping for text content
- Validate and sanitize before storing to localStorage

**Google Calendar Integration**:
- Use OAuth 2.0 for authentication (industry standard)
- Store access tokens securely (not in localStorage)
- Implement token refresh logic
- Request minimal necessary scopes
- Handle token expiration gracefully

**Content Security Policy**:
- Implement CSP headers to prevent XSS attacks
- Restrict script sources to trusted domains
- Disable inline scripts where possible

### Future Enhancements

**Potential Features** (not in current scope):
- Recurring appointments
- Appointment categories/tags
- Export to PDF or ICS format
- Email reminders
- Multi-user support with backend sync
- Appointment history/archive
- Search functionality beyond basic filtering
- Appointment templates for common appointment types
- Integration with other calendar services (Outlook, Apple Calendar)

**Technical Improvements**:
- Progressive Web App (PWA) support for offline functionality
- Service worker for background sync
- Push notifications for appointment reminders
- IndexedDB for larger data storage capacity
- End-to-end encryption for sensitive medical information
