import './App.css'
import Error from './components/error'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SetupInterceptors } from './interceptor/interceptor';
import { Route, Routes } from 'react-router-dom';
import CategoryCreation from './components/category/category-create';
import Layout from './components/layout';
import ProductPage from './components/product';
import ProductCreate from './components/product/product-create';
import HomePage from './components/home';
import CategoryTable from './components/category/category-table';



function App() {
  SetupInterceptors();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/create" element={<CategoryCreation />} />
          <Route path="/categories" element={<CategoryTable />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/create-product" element={<ProductCreate />} />
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
