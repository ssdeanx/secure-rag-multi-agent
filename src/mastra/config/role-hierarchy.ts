/**
 * Role Hierarchy Configuration
 *
 * Defines the hierarchical relationships between roles where higher-level roles
 * automatically inherit access permissions from lower-level roles.
 *
 * Structure: { role: [inherited_roles...] }
 * - Each role inherits access from all roles listed in its array
 * - Higher privilege roles should include lower privilege roles
 * - 'public' is the base level accessible to everyone
 */

export interface RoleHierarchy {
  [role: string]: string[];
}

export const ROLE_HIERARCHY: RoleHierarchy = {
  // Super admin - access to everything
  'admin': [
    'hr.admin', 'hr.viewer',
    'finance.admin', 'finance.viewer',
    'engineering.admin', 'engineering.viewer',
    'employee', 'public'
  ],

  // Department admin roles - full access to their department + general access
  'hr.admin': ['hr.viewer', 'employee', 'public'],
  'finance.admin': ['finance.viewer', 'employee', 'public'],
  'engineering.admin': ['engineering.viewer', 'employee', 'public'],

  // Department viewer roles - read access to their department + general access
  'hr.viewer': ['employee', 'public'],
  'finance.viewer': ['employee', 'public'],
  'engineering.viewer': ['employee', 'public'],

  // Base employee role - access to general company documents
  'employee': ['public'],

  // Public role - no additional inheritance (base level)
  'public': []
};

/**
 * Role privilege levels for sorting and comparison
 * Higher numbers indicate higher privilege levels
 */
export const ROLE_LEVELS: Record<string, number> = {
  'admin': 100,
  'hr.admin': 80,
  'finance.admin': 80,
  'engineering.admin': 80,
  'hr.viewer': 60,
  'finance.viewer': 60,
  'engineering.viewer': 60,
  'employee': 40,
  'public': 10
};

/**
 * Get the privilege level of a role
 */
export function getRoleLevel(role: string): number {
  return ROLE_LEVELS[role] || 0;
}

/**
 * Check if a role exists in the hierarchy
 */
export function isValidRole(role: string): boolean {
  return role in ROLE_HIERARCHY;
}

/**
 * Get all roles that inherit from a specific role
 * @param targetRole The role to find inheritors for
 * @returns Array of roles that can access the target role
 */
export function getInheritorRoles(targetRole: string): string[] {
  const inheritors: string[] = [];
  
  for (const [role, inheritedRoles] of Object.entries(ROLE_HIERARCHY)) {
    if (inheritedRoles.includes(targetRole) || role === targetRole) {
      inheritors.push(role);
    }
  }
  
  return inheritors.sort((a, b) => getRoleLevel(b) - getRoleLevel(a));
}