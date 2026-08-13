import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        setError('');

        // Demo login credentials
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🎓
                </div>

                <h1>EduTrack AI</h1>

                <p className="login-subtitle">
                    Student Success Intelligence Platform
                </p>

                <h2>Welcome Back</h2>

                <p className="login-description">
                    Sign in to access your student success dashboard.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>

                <div className="demo-login">
                    <p>Demo Login</p>
                    <span>Username: admin</span>
                    <span>Password: admin123</span>
                </div>

                <div className="login-footer">
                    EduTrack AI © 2026
                </div>

            </div>

        </div>
    );
}

export default Login;