import './App.css'
import Error from './components/error'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SetupInterceptors } from './interceptor/interceptor';
import { Route, Routes } from 'react-router-dom';
import CategoryTable from './components/category/category-table';
import CategoryCreation from './components/category/category-create';
import Layout from './components/layout';



function App() {
  SetupInterceptors();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CategoryTable />} />
          <Route path="/create" element={<CategoryCreation />} />
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
