// Common user type used across components
export interface User {
  id: string;
  name: string;
  email: string;
}

// Base props for components that need user information
export interface UserAwareProps {
  user: User;
}

// Props for components that need logout functionality
export interface AuthAwareProps extends UserAwareProps {
  onLogout: () => void;
}

// Authentication handler props
export interface AuthHandlerProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
}
