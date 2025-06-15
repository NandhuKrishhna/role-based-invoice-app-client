import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./Components/MainLayout"
import LoginPage from "./Pages/LoginPage"
import AuthLayout from "./Components/AuthLayout"
import DashboardPage from "./Pages/DashboardPage"
import RequireAuth from "./Components/RequiredAuth"
import { Role } from "./utils/contants"
import PublicRoute from "./Components/PublicRoute"
import { InvoicePage } from "./Pages/InvoicePage"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "./redux/slice/authSlice"


const App = () => {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
          </Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={[Role.SUPER_ADMIN, Role.UNIT_MANAGER, Role.ADMIN, Role.USER]} redirectTo="/" />}>
          <Route element={<MainLayout />}>
            {currentUser?.role !== Role.USER && <Route path="/dashboard" element={<DashboardPage />} />}
            <Route path="/invoice" element={<InvoicePage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
