import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (!username.trim() || !password) {
            setError('Please enter your username and password.');
            return;
        }

        setLoading(true);

        try {
            /*
             * Temporary frontend login.
             *
             * We will replace this with the Spring Boot
             * authentication API after the login screen works.
             */
            if (username === 'admin' && password === 'admin123') {
                onLogin();
            } else {
                setError('Invalid username or password.');
            }
        } catch (err) {
            setError('Unable to login. Please try again.');
        } finally {
            setLoading(false);
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

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Enter your username"
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                disabled={loading}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>

                        </div>
                    </div>

                    {error && (
                        <div className="login-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? 'Signing in...'
                            : 'Sign In'}
                    </button>

                </form>

                <div className="login-security">
                    🔒 Secure EduTrack Access
                </div>

            </div>
        </div>
    );
}

export default Login;