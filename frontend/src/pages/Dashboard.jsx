import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PendingIcon from '@mui/icons-material/Schedule'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { Link } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import Loader from '../components/Loader'
import { getStats } from '../api/statsApi'
import { getClients } from '../api/clientApi'
import { getProduits } from '../api/produitApi'
import { getCommandes } from '../api/commandeApi'
import { useAuth } from '../context/AuthContext'
import { STATUT_COLORS, STATUT_LABELS, formatDate } from '../utils/constants'
import './Dashboard.css'

export default function Dashboard() {
  const { role } = useAuth()
  return role === 'AGENT' ? <AgentDashboard /> : <StatsDashboard />
}

function StatsDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error || !stats) return <Typography color="error">{error || 'Impossible de charger les statistiques.'}</Typography>

  const cards = [
    { title: 'Clients', value: stats.totalClients, icon: <PeopleIcon />, color: 'primary', to: '/clients' },
    { title: 'Produits', value: stats.totalProduits, icon: <InventoryIcon />, color: 'secondary', to: '/products' },
    { title: 'Commandes', value: stats.totalCommandes, icon: <ShoppingCartIcon />, color: 'primary', to: '/orders' },
    { title: 'En attente', value: stats.pendingOrders, icon: <PendingIcon />, color: 'warning' },
    { title: 'Expédiées', value: stats.shippedOrders, icon: <LocalShippingIcon />, color: 'info' },
    { title: 'Livrées', value: stats.deliveredOrders, icon: <CheckCircleIcon />, color: 'success' },
    { title: 'Stock faible', value: stats.lowStockCount, icon: <WarningIcon />, color: 'warning', to: '/products' },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.title}>
            {card.to ? (
              <Link to={card.to} className="dashboard-card-link">
                <DashboardCard {...card} />
              </Link>
            ) : (
              <DashboardCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>

      <RecentOrders orders={stats.recentOrders} />
    </Box>
  )
}

function AgentDashboard() {
  const [counts, setCounts] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const one = { page: 0, size: 1 }
    Promise.all([
      getClients(one),
      getProduits(one),
      getCommandes(one),
      getCommandes({ ...one, statut: 'EN_ATTENTE' }),
      getCommandes({ ...one, statut: 'EXPEDIEE' }),
      getCommandes({ ...one, statut: 'LIVREE' }),
      getCommandes({ page: 0, size: 100 }),
    ])
      .then(([clients, produits, commandes, enAttente, expediees, livrees, all]) => {
        setCounts({
          totalClients: clients.totalElements,
          totalProduits: produits.totalElements,
          totalCommandes: commandes.totalElements,
          pendingOrders: enAttente.totalElements,
          shippedOrders: expediees.totalElements,
          deliveredOrders: livrees.totalElements,
        })
        setRecentOrders([...all.content].reverse().slice(0, 5))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error || !counts) return <Typography color="error">{error || 'Impossible de charger le tableau de bord.'}</Typography>

  const cards = [
    { title: 'Clients', value: counts.totalClients, icon: <PeopleIcon />, color: 'primary', to: '/clients' },
    { title: 'Produits', value: counts.totalProduits, icon: <InventoryIcon />, color: 'secondary', to: '/products' },
    { title: 'Commandes', value: counts.totalCommandes, icon: <ShoppingCartIcon />, color: 'primary', to: '/orders' },
    { title: 'En attente', value: counts.pendingOrders, icon: <PendingIcon />, color: 'warning' },
    { title: 'Expédiées', value: counts.shippedOrders, icon: <LocalShippingIcon />, color: 'info' },
    { title: 'Livrées', value: counts.deliveredOrders, icon: <CheckCircleIcon />, color: 'success' },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.title}>
            {card.to ? (
              <Link to={card.to} className="dashboard-card-link">
                <DashboardCard {...card} />
              </Link>
            ) : (
              <DashboardCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>
      <RecentOrders orders={recentOrders} />
    </Box>
  )
}

function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) return null

  return (
    <Card className="dashboard-recent-orders">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Commandes récentes
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Détails</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {order.client ? `${order.client.nom} (${order.client.ville || '-'})` : '-'}
                  </TableCell>
                  <TableCell>{formatDate(order.dateCommande)}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUT_LABELS[order.statut] || order.statut}
                      color={STATUT_COLORS[order.statut] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Link to={`/orders/${order.id}`} className="dashboard-order-link">
                      Voir
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
