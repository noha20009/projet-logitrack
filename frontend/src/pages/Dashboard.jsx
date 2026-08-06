import { useEffect, useState } from 'react'
import {
  PeopleIcon,
  InventoryIcon,
  ShoppingCartIcon,
  ScheduleIcon,
  LocalShippingIcon,
  CheckCircleIcon,
  WarningIcon,
} from '../components/Icons'
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
  if (error || !stats) return <p className="dashboard-error">{error || 'Impossible de charger les statistiques.'}</p>

  const cards = [
    { title: 'Clients', value: stats.totalClients, icon: <PeopleIcon />, color: 'primary', to: '/clients' },
    { title: 'Produits', value: stats.totalProduits, icon: <InventoryIcon />, color: 'secondary', to: '/products' },
    { title: 'Commandes', value: stats.totalCommandes, icon: <ShoppingCartIcon />, color: 'primary', to: '/orders' },
    { title: 'En attente', value: stats.pendingOrders, icon: <ScheduleIcon />, color: 'warning' },
    { title: 'Expédiées', value: stats.shippedOrders, icon: <LocalShippingIcon />, color: 'info' },
    { title: 'Livrées', value: stats.deliveredOrders, icon: <CheckCircleIcon />, color: 'success' },
    { title: 'Stock faible', value: stats.lowStockCount, icon: <WarningIcon />, color: 'warning', to: '/products' },
  ]

  return (
    <div>
      <h1 className="page-title">Tableau de bord</h1>

      <div className="grid">
        {cards.map((card) => (
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={card.title}>
            {card.to ? (
              <Link to={card.to} className="dashboard-card-link">
                <DashboardCard {...card} />
              </Link>
            ) : (
              <DashboardCard {...card} />
            )}
          </div>
        ))}
      </div>

      <RecentOrders orders={stats.recentOrders} />
    </div>
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
  if (error || !counts) return <p className="dashboard-error">{error || 'Impossible de charger le tableau de bord.'}</p>

  const cards = [
    { title: 'Clients', value: counts.totalClients, icon: <PeopleIcon />, color: 'primary', to: '/clients' },
    { title: 'Produits', value: counts.totalProduits, icon: <InventoryIcon />, color: 'secondary', to: '/products' },
    { title: 'Commandes', value: counts.totalCommandes, icon: <ShoppingCartIcon />, color: 'primary', to: '/orders' },
    { title: 'En attente', value: counts.pendingOrders, icon: <ScheduleIcon />, color: 'warning' },
    { title: 'Expédiées', value: counts.shippedOrders, icon: <LocalShippingIcon />, color: 'info' },
    { title: 'Livrées', value: counts.deliveredOrders, icon: <CheckCircleIcon />, color: 'success' },
  ]

  return (
    <div>
      <h1 className="page-title">Tableau de bord</h1>
      <div className="grid">
        {cards.map((card) => (
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={card.title}>
            {card.to ? (
              <Link to={card.to} className="dashboard-card-link">
                <DashboardCard {...card} />
              </Link>
            ) : (
              <DashboardCard {...card} />
            )}
          </div>
        ))}
      </div>
      <RecentOrders orders={recentOrders} />
    </div>
  )
}

function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) return null

  return (
    <div className="ui-card ui-card--pad dashboard-recent-orders">
      <h2 className="section-title">Commandes récentes</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Client</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.client ? `${order.client.nom} (${order.client.ville || '-'})` : '-'}</td>
                <td>{formatDate(order.dateCommande)}</td>
                <td>
                  <span className={`chip chip--${STATUT_COLORS[order.statut] || 'default'}`}>
                    {STATUT_LABELS[order.statut] || order.statut}
                  </span>
                </td>
                <td>
                  <Link to={`/orders/${order.id}`} className="dashboard-order-link">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
