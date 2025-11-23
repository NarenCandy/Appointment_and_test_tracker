# Implementation Plan

- [x] 1. Set up project structure and development environment





  - Initialize React + TypeScript project with Vite
  - Configure TypeScript with strict mode
  - Set up CSS Modules or styled-components for styling
  - Install fast-check for property-based testing
  - Install testing libraries (Jest/Vitest, React Testing Library)
  - Create directory structure: components/, services/, types/, utils/, tests/
  - _Requirements: All_

- [x] 2. Implement core data types and validation service



  - Define TypeScript interfaces for Appointment, AppointmentFormData, ValidationError, AppState
  - Implement ValidationService with validation functions
  - Implement isNonEmptyString, isDatetimeInFuture validation helpers
  - Implement validateAppointment function that returns ValidationError[]
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 2.1 Write property test for invalid appointment validation


  - **Property 2: Invalid appointments are rejected with validation errors**
  - **Validates: Requirements 1.2**

- [x] 2.2 Write property test for past datetime rejection


  - **Property 3: Past datetime appointments are rejected**
  - **Validates: Requirements 1.3**

- [x] 3. Implement storage service



  - Create StorageService interface
  - Implement saveAppointments and loadAppointments functions
  - Implement date serialization/deserialization (ISO 8601)
  - Implement error handling for corrupted data
  - Implement saveThemePreference and loadThemePreference functions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.3, 9.4_

- [x] 3.1 Write property test for appointment persistence round trip


  - **Property 11: Appointment persistence round trip**
  - **Validates: Requirements 5.1, 5.2**

- [x] 3.2 Write property test for theme persistence round trip


  - **Property 12: Theme preference persistence round trip**
  - **Validates: Requirements 9.1, 9.3**

- [x] 3.3 Write unit test for corrupted data handling

  - Test that corrupted JSON initializes with empty array
  - _Requirements: 5.4_

- [x] 4. Implement state management with Context API



  - Create AppContext with AppState and AppAction types
  - Implement reducer function for all action types
  - Create AppProvider component with useReducer
  - Implement custom hooks: useAppState, useAppDispatch
  - Initialize state by loading from localStorage on mount
  - _Requirements: All_

- [x] 5. Implement appointment list sorting and filtering utilities



  - Create sortAppointmentsByDatetime function (ascending order)
  - Create isPastAppointment utility function
  - Create filterByKeyword function for text search
  - Create filterByDateRange function
  - _Requirements: 2.1, 2.3, 10.1, 10.2, 10.3, 10.4_

- [x] 5.1 Write property test for appointment sorting


  - **Property 4: Appointments are always sorted by datetime ascending**
  - **Validates: Requirements 2.1, 10.4**

- [x] 5.2 Write property test for keyword filtering

  - **Property 13: Keyword filter matches relevant fields**
  - **Validates: Requirements 10.1**

- [x] 5.3 Write property test for date range filtering

  - **Property 14: Date range filter includes only appointments within range**
  - **Validates: Requirements 10.2**

- [x] 5.4 Write property test for clearing filters

  - **Property 15: Clearing filters restores full appointment list**
  - **Validates: Requirements 10.3**

- [x] 6. Create AppointmentForm component



  - Build form with inputs for name, datetime, location, preparation notes
  - Implement controlled form state with useState
  - Integrate validation on submit
  - Display validation errors inline
  - Clear form after successful submission
  - Dispatch ADD_APPOINTMENT action on valid submission
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6.1 Write property test for valid appointment creation


  - **Property 1: Valid appointment creation increases list size**
  - **Validates: Requirements 1.1, 1.4**

- [x] 6.2 Write unit tests for form component


  - Test form validation error display
  - Test form clearing after submission
  - _Requirements: 1.2_

- [x] 7. Create AppointmentItem component



  - Display appointment name, formatted datetime, location, truncated preparation notes
  - Apply past appointment styling based on isPastAppointment check
  - Add "Mark as Done" and "Delete" buttons
  - Implement confirmation dialogs for destructive actions
  - Dispatch MARK_DONE or DELETE_APPOINTMENT actions
  - _Requirements: 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

- [x] 7.1 Write property test for appointment display content

  - **Property 5: Appointment display contains all required information**
  - **Validates: Requirements 2.2**

- [x] 7.2 Write property test for past appointment styling

  - **Property 6: Past appointments are visually distinguished**
  - **Validates: Requirements 2.3**

- [x] 7.3 Write property test for confirmation before destructive actions

  - **Property 8: Destructive actions require confirmation**
  - **Validates: Requirements 3.4**

- [x] 7.4 Write property test for removal operations

  - **Property 7: Removal operations delete appointments**
  - **Validates: Requirements 3.1, 3.2**

- [x] 8. Create AppointmentList component







  - Retrieve appointments from context
  - Sort appointments using sortAppointmentsByDatetime
  - Map appointments to AppointmentItem components
  - Display empty state message when no appointments exist
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8.1 Write unit test for empty state display



  - Test that empty state message appears when appointments array is empty
  - _Requirements: 2.4_

- [x] 9. Create PrintableChecklist component



  - Filter appointments to only future appointments
  - Display appointment name, datetime, location, full preparation notes
  - Apply print-optimized CSS styling
  - Add print media query styles
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 9.1 Write property test for printable checklist filtering


  - **Property 9: Printable checklist contains only future appointments**
  - **Validates: Requirements 4.1**

- [x] 9.2 Write property test for printable checklist content


  - **Property 10: Printable checklist includes complete appointment details**
  - **Validates: Requirements 4.2**

- [x] 10. Implement Neomorphism 2.0 and Skeuomorphism styling



  - Create CSS variables for light and dark themes
  - Implement neomorphic shadow styles for buttons, cards, inputs
  - Create skeuomorphic checklist styling
  - Apply rounded corners and soft shadows throughout
  - Ensure color contrast meets WCAG AA standards
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 11. Implement responsive design





  - Add responsive breakpoints (mobile < 640px, tablet 640-1024px, desktop > 1024px)
  - Implement mobile-first CSS with media queries
  - Ensure touch targets are minimum 44x44px
  - Test layout at various viewport sizes
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 12. Implement accessibility features





  - Add ARIA labels to icon-only buttons
  - Ensure semantic HTML (button, nav, main elements)
  - Implement keyboard navigation (tab order, enter/escape)
  - Add focus indicators with 2px solid outline
  - Add skip to main content link
  - _Requirements: 7.4, 8.4_

- [x] 12.1 Run automated accessibility tests


  - Use axe-core or similar tool to validate accessibility
  - _Requirements: 7.4, 8.4_

- [x] 13. Create ThemeToggle component (optional feature)





  - Add toggle button for light/dark mode
  - Dispatch SET_THEME action on toggle
  - Apply theme to all components via CSS variables or styled-components
  - Persist theme preference to localStorage
  - Load theme preference on app initialization
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 14. Create FilterPanel component (optional feature)





  - Add keyword input field with debouncing
  - Add date range inputs (start date, end date)
  - Add clear filters button
  - Apply filters to appointment list
  - Maintain sort order for filtered results
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 15. Implement Google Calendar integration service (optional feature)





  - Create GoogleCalendarService interface
  - Implement OAuth 2.0 authentication flow
  - Implement createEvent function to add appointments to Google Calendar
  - Handle authentication errors gracefully
  - Handle API request failures gracefully
  - Store connection status in app state
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 15.1 Write unit test for Google Calendar error handling


  - Test that errors don't crash the app
  - Test that appointments can still be created when calendar integration fails
  - _Requirements: 6.4_

- [x] 16. Create GoogleCalendarIntegration component (optional feature)





  - Add "Connect Google Calendar" button
  - Display connection status
  - Add reminder settings input when creating appointments
  - Show error messages for integration failures
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 17. Wire up main App component





  - Wrap app with AppProvider
  - Render AppointmentForm component
  - Render AppointmentList component
  - Render ThemeToggle component (if implemented)
  - Render FilterPanel component (if implemented)
  - Render GoogleCalendarIntegration component (if implemented)
  - Add navigation/layout structure
  - _Requirements: All_

- [x] 18. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Final polish and optimization





  - Implement React.memo for AppointmentItem to prevent unnecessary re-renders
  - Add loading states where appropriate
  - Optimize bundle size (code splitting for optional features)
  - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test print functionality
  - Verify localStorage behavior across browsers
  - _Requirements: All_
