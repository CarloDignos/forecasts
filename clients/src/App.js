import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserInformation from "./pages/UserInfomation";
import ChickenInformation from "./pages/ChickenInformation";
import VarietyList from "./pages/varietyList";
import Reports from "./pages/varietyForm";
import RegistrationForm  from "./pages/RegistrationForm";
import EventForm  from "./pages/EventForm";
import { useSelector } from "react-redux";
import ChickenHealthApp  from './pages/health';
import AttendeeInfo from './pages/breedingInformation';
import AttendeeInfo2 from './pages/eggMonitoring';
import FaceScanner2 from './pages/ForecastMonitor';
import BreedingList from './pages/breedingList';
import HealthList from './pages/healthList';

function App() {
    const user = useSelector((state) => state.user);

    // Helper function to render Login page only if user is not logged in
    const RenderLoginIfNotLoggedIn = () => {
        return !user ? <Login /> : <Navigate to="/" />;
    };

    


    return (
        <BrowserRouter>
            <div className="app">
                {user ? null : <Navigation />}
                <div className="Main-Content">
                    {user ? <Sidebar /> : null}
                    <main className="content">
                        {user ? <Topbar /> : null}
                        <div className="inner-content">
                            <Routes>
                                <Route path="/" element={user ? null :<Home />} />
                                <Route path="/login" element={<RenderLoginIfNotLoggedIn />} />
                                <Route path="/register" element={ <RegistrationForm />} />
                                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                                <Route path="/UserInformation" element={user ? <UserInformation /> : <Navigate to="/login" />} />
                                <Route path="/ChickenInformation" element={user ? <ChickenInformation /> : <Navigate to="/login" />} />
                                <Route path="/varietyList" element={user ? <VarietyList /> : <Navigate to="/login" />} />
                                <Route path="/varietyRegister" element={user ? <Reports /> : <Navigate to="/login" />} />
                                <Route path="/event" element={user ? <EventForm /> : <Navigate to="/login" />} />
                                <Route path="/breeding" element={user ? <AttendeeInfo /> : <Navigate to="/login" />} />
                                <Route path="/EggCollection" element={user ? <AttendeeInfo2 /> : <Navigate to="/login" />} />
                                <Route path="/ForecastEggProduction" element={user ? <FaceScanner2 /> : <Navigate to="/login" />} />
                                <Route path="/Health" element={user ? <ChickenHealthApp  /> : <Navigate to="/login" />} />
                                <Route path="/BreedingList" element={user ? <BreedingList  /> : <Navigate to="/login" />} />
                                <Route path="/HealthList" element={user ? <HealthList  /> : <Navigate to="/login" />} />
  

                            </Routes>
                        </div>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}


export default App;
