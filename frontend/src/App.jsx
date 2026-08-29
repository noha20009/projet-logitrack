import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './guards/ProtectedRoute'
import RoleGuard from './guards/RoleGuard'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import Clients from './pages/clients/Clients'
import ClientDetails from './pages/clients/ClientDetails'
import ClientForm from './pages/clients/ClientForm'
import Products from './pages/products/Products'
import ProductDetails from './pages/products/ProductDetails'
import ProductForm from './pages/products/ProductForm'
import Orders from './pages/orders/Orders'
import OrderDetails from './pages/orders/OrderDetails'
import OrderForm from './pages/orders/OrderForm'
import Users from './pages/users/Users'
import Profile from './pages/Profile'
import AccessDenied from './pages/AccessDenied'
import NotFound from './pages/NotFound'

const WRITE_ROLES = ['ADMIN', 'MANAGER']
const ADMIN_ONLY = ['ADMIN']

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/404" element={<NotFound />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/clients" element={<Clients />} />
        <Route
          path="/clients/new"
          element={
            <RoleGuard roles={WRITE_ROLES}>
              <ClientForm />
            </RoleGuard>
          }
        />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route
          path="/clients/:id/edit"
          element={
            <RoleGuard roles={WRITE_ROLES}>
              <ClientForm />
            </RoleGuard>
          }
        />

        <Route path="/products" element={<Products />} />
        <Route
          path="/products/new"
          element={
            <RoleGuard roles={WRITE_ROLES}>
              <ProductForm />
            </RoleGuard>
          }
        />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/products/:id/edit"
          element={
            <RoleGuard roles={WRITE_ROLES}>
              <ProductForm />
            </RoleGuard>
          }
        />

        <Route path="/orders" element={<Orders />} />
        <Route
          path="/orders/new"
          element={
            <RoleGuard roles={WRITE_ROLES}>
              <OrderForm />
            </RoleGuard>
          }
        />
        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route
          path="/users"
          element={
            <RoleGuard roles={ADMIN_ONLY}>
              <Users />
            </RoleGuard>
          }
        />
        

        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
