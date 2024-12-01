import "./App.css";
import DetailedView from "./pages/DetailedView/DetailedView";
import GuestView from "./pages/GuestView/GuestView";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<GuestView />} />
          <Route path="/DetailedView" element={<DetailedView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
