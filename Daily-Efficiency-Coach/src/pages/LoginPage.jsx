import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert, Container, Paper } from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports'; 
import api from '../api/api';

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const schema = Yup.object({
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#F2EFE9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      position: 'relative'
    }}>

      <Box 
        onClick={() => navigate('/')}
        sx={{ 
          position: 'absolute', top: 24, left: 24, 
          display: 'flex', alignItems: 'center', gap: 1,
          cursor: 'pointer', zIndex: 10,
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.8 }
        }}
      >
        <SportsIcon sx={{ color: '#1B4F72', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={800} sx={{ color: '#1B4F72', letterSpacing: '-0.02em', fontSize: '1.1rem' }}>
          Daily Efficiency Coach
        </Typography>
      </Box>

      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B4F72', mb: 1.5 }}>
            Welcome Back
          </Typography>
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              setServerError('');
              try {
                const res = await api.post('/auth/login', { email: values.email, password: values.password });
                localStorage.setItem('token', res.data.access_token);
                navigate('/dashboard');
              } catch (err) {
                setServerError(err.response?.data?.detail || 'Invalid email or password');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F8F9FA', borderRadius: 3 } }}
                  />
                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F8F9FA', borderRadius: 3 } }}
                  />
                  {serverError && <Alert severity="error">{serverError}</Alert>}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ py: 1.8, bgcolor: '#1B4F72', borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#5D6D7E' }}>
                      Don't have an account? <Link to="/signup" style={{ color: '#1B4F72', fontWeight: 700, textDecoration: 'none' }}>Sign up</Link>
                    </Typography>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;