export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT: 'AGENT',
}

export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  REPORTER: 'Reporter',
}

export const STATUTS = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE']

export const STATUT_LABELS = {
  EN_ATTENTE: 'En attente',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
}

export const STATUT_COLORS = {
  EN_ATTENTE: 'warning',
  EXPEDIEE: 'info',
  LIVREE: 'success',
}

export const PAGE_SIZES = [5, 10, 25, 50]

export const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value || 0)

export const formatDate = (value) =>
  value ? new Date(value + 'T00:00:00').toLocaleDateString('fr-FR') : '-'
