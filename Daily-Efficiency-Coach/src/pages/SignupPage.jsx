import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import api from '../api/api';
import LogoSrc from '../assets/logo.svg';

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
          sx={{ cursor: 'pointer', mb: 7, display: 'inline-block', '&:hover': { opacity: 0.8 } }}
        >
          <img src={LogoSrc} alt="Daily Efficiency Coach" style={{ height: 200 }} />
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography sx={{
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#1B4F72',
            fontFamily: "'Georgia', serif",
            letterSpacing: '-0.02em',
            mb: 1,
          }}>
            Create your account
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#8FA3B1' }}>
            Start building better habits today
          </Typography>
        </Box>

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
                <Field
                  as={TextField}
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  fullWidth
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
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
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>

                <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#8FA3B1', mt: 1 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#1B4F72', fontWeight: 700, textDecoration: 'none' }}>
                    Sign in
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
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
        }} />
        <Box sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 260,
          height: 260,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
        }} />

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
            One system.
            <br />
            Every habit.
          </Typography>
          <Typography sx={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8,
            maxWidth: 300,
            mb: 5,
          }}>
            Join and start building the routine that actually sticks.
          </Typography>

          {/* Feature list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
            {[
              'Track tasks and habits daily',
              'Analyze your productivity patterns',
              'Get AI-powered weekly coaching',
              'Build streaks that last',
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'white',
                  }} />
                </Box>
                <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignupPage;