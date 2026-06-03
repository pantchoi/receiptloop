import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CheckIn from "./pages/CheckIn"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check-in/:campaignId" element={<CheckIn />} />
    </Routes>
  )
}