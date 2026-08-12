import { Navigate, Link } from 'react-router-dom'
import {
  HiTruck,
  HiCube,
  HiShoppingCart,
  HiUsers,
  HiChartBar,
  HiLockClosed,
  HiArrowRight,
  HiUserAdd,
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import logo from '../Photos/661897cd-b9ba-4012-a9c7-dd79280d7a18.png'
import './Landing.css'

const FEATURES = [
  {
    icon: HiCube,
    title: 'Gestion des produits & stock',
    description: 'Suivez vos produits, catégories et niveaux de stock en temps réel.',
  },
  {
    icon: HiShoppingCart,
    title: 'Commandes',
    description: 'Créez et suivez vos commandes clients de l’enregistrement jusqu’à la livraison.',
  },
  {
    icon: HiUsers,
    title: 'Gestion des clients',
    description: 'Centralisez vos clients et leurs informations en un seul endroit.',
  },
  {
    icon: HiChartBar,
    title: 'Tableau de bord',
    description: 'Des statistiques claires pour piloter votre activité au quotidien.',
  },
  {
    icon: HiLockClosed,
    title: 'Sécurité & rôles',
    description: 'Authentification JWT et gestion fine des rôles (Administrateur, Manager, Agent).',
  },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="landing-bg">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <img src={logo} alt="Logo LogiTrack" className="landing-logo" />
            <span className="landing-brand-name">LogiTrack</span>
          </div>
          <nav className="landing-nav">
            <Link to="/login" className="landing-nav-link">
              Se connecter
            </Link>
            <Link to="/register" className="landing-nav-btn">
              S&apos;inscrire
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <h1 className="landing-title">LogiTrack</h1>
            <p className="landing-tagline">Gestion logistique sécurisée pour votre entreprise</p>
            <p className="landing-description">
              LogiTrack est la plateforme complète de gestion de votre chaîne logistique :
              produits, stock, commandes, clients et statistiques — le tout sécurisé par
              authentification JWT et un système de rôles flexible.
            </p>
            <div className="landing-actions">
              <Link to="/login" className="landing-btn landing-btn--primary">
                Se connecter
                <HiArrowRight size={20} />
              </Link>
              <Link to="/register" className="landing-btn landing-btn--secondary">
                S&apos;inscrire
                <HiUserAdd size={20} />
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <h2 className="landing-features-title">Une plateforme tout-en-un</h2>
          <div className="landing-features-grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="landing-feature-card">
                <span className="landing-feature-icon">
                  <feature.icon size={28} />
                </span>
                <h3 className="landing-feature-title">{feature.title}</h3>
                <p className="landing-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-brand">
            <HiTruck size={20} /> LogiTrack
          </span>
          <p className="landing-footer-text">
            Personnel autorisé uniquement. Protégé par LogiTrack Security Systems.
          </p>
        </div>
      </footer>
    </div>
  )
}
