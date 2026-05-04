import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert, Container, Paper } from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports'; // Whistle icon
import api from '../api/api';

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const schema = Yup.object({
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm'),
  });

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#F8F9FA',
      borderRadius: 3,
      '& fieldset': { borderColor: 'rgba(0,0,0,0.04)' },
    }
  };

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
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          zIndex: 10,
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.8 }
        }}
      >
        <SportsIcon sx={{ color: '#1B4F72', fontSize: 28 }} />
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: '#1B4F72',
            letterSpacing: '-0.02em',
            fontSize: '1.1rem',
            userSelect: 'none' 
          }}
        >
          Daily Efficiency Coach
        </Typography>
      </Box>

      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1B4F72', mb: 1.5 }}>
            Create Account
          </Typography>
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              setServerError('');
              try {
                const res = await api.post('/auth/register', { email: values.email, password: values.password });
                localStorage.setItem('token', res.data.access_token);
                navigate('/dashboard');
              } catch (err) {
                setServerError(err.response?.data?.detail || 'Something went wrong.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Field as={TextField} name="email" label="Email" fullWidth error={touched.email && Boolean(errors.email)} helperText={touched.email && errors.email} sx={fieldSx} />
                  <Field as={TextField} name="password" type="password" label="Password" fullWidth error={touched.password && Boolean(errors.password)} helperText={touched.password && errors.password} sx={fieldSx} />
                  <Field as={TextField} name="confirmPassword" type="password" label="Confirm Password" fullWidth error={touched.confirmPassword && Boolean(errors.confirmPassword)} helperText={touched.confirmPassword && errors.confirmPassword} sx={fieldSx} />

                  {serverError && <Alert severity="error" sx={{ color: '#CB4335' }}>{serverError}</Alert>}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ py: 1.8, bgcolor: '#1B4F72', borderRadius: 3, fontWeight: 700, textTransform: 'none' }}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#5D6D7E' }}>
                      Already have an account? <Link to="/login" style={{ color: '#1B4F72', fontWeight: 700 }}>Sign in</Link>
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

export default SignupPage;