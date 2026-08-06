import './Loader.css'

export default function Loader({ fullscreen = false }) {
  return (
    <div className={`loader-container${fullscreen ? ' loader-container--fullscreen' : ''}`}>
      <span className="spinner" role="status" aria-label="Chargement" />
    </div>
  )
}
