import './App.css'
import Error from './components/error'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SetupInterceptors } from './interceptor/interceptor';
import { Route, Routes } from 'react-router-dom';
import CategoryCreation from './components/category/category-create';
import Layout from './components/layout';
import ProductCreate from './components/product/product-create';
import HomePage from './components/home';
import CategoryTable from './components/category/category-table';
import { Login } from './components/user/login';
import { Registration } from './components/user/registration';
import ProductTable from './components/product/product-table';
import AdminProtectedRoute from './components/protected-routes/AdminProtectedRoute';
import FavoritesPage from './components/favorites';
import user from './store/userStore'
import { storageService } from './services/storageService';

function App() {
  SetupInterceptors();
  user.favCount = storageService.getLocalFavorites().length || 0;
  user.setUserData(storageService.getAccessToken());
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/categories/create" element={
            <AdminProtectedRoute children={<CategoryCreation />} />} />
          <Route path="/categories" element={
            <AdminProtectedRoute children={<CategoryTable />} />} />
          <Route path="/products" element={
            <AdminProtectedRoute children={<ProductTable />} />} />
          <Route path="/products/create" element={
            <AdminProtectedRoute children={<ProductCreate />} />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="*" element={
            <Error
              status="404"
              title="404"
              subTitle="Вибачте, сторінкт на яку ви намагаєтесь перейти не існує."
            />} />
          <Route path="forbiden" element={
            <Error
              status="403"
              title="403"
              subTitle="В доступі відмовлено.Ви не маєте дозволу для доступу до цієї сторінки."
            />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
