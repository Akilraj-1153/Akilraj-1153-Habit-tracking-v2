import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Component/Navbar";
import Homepage from "./Pages/Homepage";
import DetailsPage from "./Pages/DetailsPage";
import { Error } from "./Pages/Error";
import Home from "./Pages/Home";
import Bmi from "./Pages/Bmi";
import Profile from "./Pages/Profile";
import LoginPage from "./Pages/LoginPage";

function App() {
  // Check the initial isLoggedIn state from localStorage
  const initialIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  useEffect(() => {
    // Update localStorage with the current isLoggedIn state
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn && <Navbar />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: isLoggedIn ? <Home /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />,
        },
        { path: "/home", element: <Home /> },
        { path: "/homepage", element: <Homepage /> },
        { path: "/detailspage", element: <DetailsPage /> },
        { path: "/bmi", element: <Bmi /> },
        { path: "/profile", element: <Profile setIsLoggedIn={setIsLoggedIn} /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
