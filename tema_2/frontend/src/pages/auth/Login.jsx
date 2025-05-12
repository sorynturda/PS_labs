// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/auth.service';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { handleApiError, logError } from '../../utils/errorHandler';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await AuthService.login(username, password);
      login(response.user, response.token);
    } catch (err) {
      logError(err, 'Login Component');
      setError(handleApiError(err, 'Failed to login. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="shadow">
          <Card.Body>
            <h2 className="text-center mb-4">MedCare Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group id="username" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  autoComplete="username"
                />
              </Form.Group>
              
              <Form.Group id="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  autoComplete="current-password"
                />
              </Form.Group>
              
              <Button 
                className="w-100" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;