import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import { DarkModeProvider } from "./contexts/DarkModeContext";
import axios from "axios";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Find the main scrollable container and reset its scroll
    const mainContent = document.querySelector('main > div');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [location.pathname]);


  return (
    <>
    <DarkModeProvider>
      <AppRoutes />
    </DarkModeProvider>
    </>
  );
}

export default App;