import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load your components
const Home = lazy(() => import("./page/index"));
const Dashboard = lazy(() => import("./page/dashboard"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/finance" element={<Home />} />
          <Route path="/akun" element={<Home />} />
          <Route path="/invenstment" element={<Home />} />
          <Route path="/credit-card" element={<Home />} />
          <Route path="/service" element={<Home />} />
          <Route path="/setting" element={<Home />} />
          <Route path="/button" element={<Home />} />
          <Route path="/card" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
