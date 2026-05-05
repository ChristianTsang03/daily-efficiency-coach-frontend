import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import api from '../api/api';
import LogoSrc from '../assets/logo.svg';

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const schema = Yup.object({
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#FAFAFA',
      borderRadius: '10px',
      fontSize: '0.95rem',
      '& fieldset': { borderColor: 'rgba(27,79,114,0.15)' },
      '&:hover fieldset': { borderColor: 'rgba(27,79,114,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#1B4F72', borderWidth: '1.5px' },
    },
    '& .MuiInputLabel-root': { color: '#8FA3B1', fontSize: '0.9rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#1B4F72' },
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: '#F2EFE9',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Dot grid */}
      <Box sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, #C5D8E8 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.35,
        pointerEvents: 'none',
      }} />

      {/* Left panel — form */}
      <Box sx={{
        flex: { xs: 1, md: '0 0 480px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, sm: 6 },
        py: 6,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', mb: 8, display: 'inline-block', '&:hover': { opacity: 0.8 } }}
        >
          <img src={LogoSrc} alt="Daily Efficiency Coach" style={{ height: 200 }} />
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography sx={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#1B4F72',
            fontFamily: "'Georgia', serif",
            letterSpacing: '-0.02em',
            mb: 1,
          }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#8FA3B1' }}>
            Sign in to continue your progress
          </Typography>
        </Box>

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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email address"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={fieldSx}
                />
                <Field
                  as={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={fieldSx}
                />

                {serverError && (
                  <Alert severity="error" sx={{
                    bgcolor: 'rgba(203,67,53,0.06)',
                    color: '#CB4335',
                    border: '1px solid rgba(203,67,53,0.15)',
                    borderRadius: 2,
                    '& .MuiAlert-icon': { color: '#CB4335' },
                  }}>
                    {serverError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 1,
                    py: 1.6,
                    bgcolor: '#1B4F72',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(27,79,114,0.25)',
                    '&:hover': {
                      bgcolor: '#154060',
                      boxShadow: '0 6px 20px rgba(27,79,114,0.32)',
                    },
                    '&:disabled': { bgcolor: '#A9CCE3' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#8FA3B1', mt: 1 }}>
                  New here?{' '}
                  <Link to="/signup" style={{ color: '#1B4F72', fontWeight: 700, textDecoration: 'none' }}>
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      {/* Right panel — decorative */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#1B4F72',
        position: 'relative',
        overflow: 'hidden',
        px: 6,
      }}>
        <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography sx={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.15,
            fontFamily: "'Georgia', serif",
            mb: 3,
            letterSpacing: '-0.02em',
          }}>
            Track. Analyze.
            <br />
            Improve.
          </Typography>
          <Typography sx={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8,
            maxWidth: 300,
          }}>
            Your personal productivity system — built around how you actually work.
          </Typography>
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Avg completion rate', value: '84%' },
              { label: 'Habits tracked daily', value: '6 avg' },
            ].map((s, i) => (
              <Box key={i} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2,
                bgcolor: 'rgba(255,255,255,0.07)',
                borderRadius: 2.5,
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{s.label}</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{s.value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;