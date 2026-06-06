import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CheckIn from "./pages/CheckIn"
import Nota from "./pages/Nota"
import Perfil from "./pages/Perfil"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check-in/:campaignId" element={<CheckIn />} />
      <Route path="/nota/:saleId" element={<Nota />} />
      <Route path="/perfil/:phone" element={<Perfil />} />
    </Routes>
  )
}