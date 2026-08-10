import { useEffect, useState } from 'react'
import { HiPlus, HiPencil, HiTrash, HiEye, HiExclamationCircle } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteProduit,
  getByCategorie,
  getByPrix,
  getLowStock,
  getProduits,
} from '../../api/produitApi'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/constants'
import './Products.css'

export default function Products() {
  const { role } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('nom')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const canWrite = role === 'ADMIN' || role === 'MANAGER'
  const canDelete = role === 'ADMIN'
  const canSeeLowStock = role === 'ADMIN' || role === 'MANAGER'

  const load = () => {
    setLoading(true)
    const params = { page, size, sort }
    let request
    if (lowStock) request = getLowStock(params)
    else if (category.trim()) request = getByCategorie(category.trim(), params)
    else if (price !== '') request = getByPrix(price, params)
    else request = getProduits(params)
    request.then(setData).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [page, size, sort, category, price, lowStock])

  const resetFilters = () => {
    setCategory('')
    setPrice('')
    setLowStock(false)
    setPage(0)
  }

  const changeFilter = (fn) => {
    setPage(0)
    fn()
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduit(toDelete.id)
      setToDelete(null)
      if (data.content.length === 1 && page > 0) setPage(page - 1)
      else load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="products-header">
        <h1 className="page-title">Produits</h1>
        {canWrite && (
          <Link to="/products/new" className="btn btn--primary">
            <HiPlus size={18} /> Ajouter un produit
          </Link>
        )}
      </div>

      <div className="ui-card products-card">
        <div className="products-filters">
          <SearchBar
            value={category}
            onChange={(v) => changeFilter(() => setCategory(v))}
            onSearch={() => changeFilter(() => {})}
            placeholder="Rechercher par catégorie..."
            label="Catégorie"
          />
          <div className="field product-price-input">
            <label htmlFor="product-price">Prix exact (€)</label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => changeFilter(() => setPrice(e.target.value))}
            />
          </div>
          {canSeeLowStock && (
            <button
              type="button"
              className={`toggle-btn${lowStock ? ' toggle-btn--active' : ''}`}
              onClick={() => changeFilter(() => setLowStock((v) => !v))}
            >
              <HiExclamationCircle size={18} className="product-toggle-icon" /> Stock faible
            </button>
          )}
          <button type="button" className="btn btn--outlined" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      <button type="button" className={`sort-btn${sort === 'nom' ? ' sort-btn--active' : ''}`} onClick={() => setSort('nom')}>
                        Nom
                      </button>
                    </th>
                    <th>Catégorie</th>
                    <th>
                      <button type="button" className={`sort-btn${sort === 'prix' ? ' sort-btn--active' : ''}`} onClick={() => setSort('prix')}>
                        Prix
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`sort-btn${sort === 'quantiteStock' ? ' sort-btn--active' : ''}`}
                        onClick={() => setSort('quantiteStock')}
                      >
                        Stock
                      </button>
                    </th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Aucun produit trouvé.
                      </td>
                    </tr>
                  )}
                  {data?.content?.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <Link to={`/products/${product.id}`} className="table-link">
                          {product.nom}
                        </Link>
                      </td>
                      <td>
                        <span className="chip">{product.categorie}</span>
                      </td>
                      <td>{formatPrice(product.prix)}</td>
                      <td>
                        <span className={`chip${product.quantiteStock <= 5 ? ' chip--error' : ''}`}>{product.quantiteStock}</span>
                      </td>
                      <td className="text-right">
                        <button type="button" className="icon-btn" title="Voir" onClick={() => navigate(`/products/${product.id}`)}>
                          <HiEye size={18} />
                        </button>
                        {canWrite && (
                          <button
                            type="button"
                            className="icon-btn"
                            title="Modifier"
                            onClick={() => navigate(`/products/${product.id}/edit`)}
                          >
                            <HiPencil size={18} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            title="Supprimer"
                            onClick={() => setToDelete(product)}
                          >
                            <HiTrash size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <Pagination
                page={page}
                size={size}
                totalElements={data.totalElements}
                totalPages={data.totalPages}
                onPageChange={setPage}
                onSizeChange={(s) => {
                  setSize(s)
                  setPage(0)
                }}
              />
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer le produit « ${toDelete?.nom} » ?`}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
