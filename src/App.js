import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    if (!isLoggedIn) {
        return (
            <Login onLogin={handleLogin} />
        );
    }

    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;