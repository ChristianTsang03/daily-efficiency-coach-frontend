import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Paper, TextField, Typography, Alert} from '@mui/material';

function SignupPage() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const schema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="sm">
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Daily Efficiency Coach
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting }) => {
              setServerError('');
              try {
                console.log(values); //placeholder for API call
                navigate('/dashboard');
              } catch (err) {
                setServerError('Something went wrong. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (

              <Form>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Field
                    as={TextField}
                    name="email"
                    type="email"
                    label="Email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <Field
                    as={TextField}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />

                  {serverError && <Alert severity="error">{serverError}</Alert>}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{ py: 1.5, mt: 1, fontWeight: 'bold' }}
                  >
                    {isSubmitting ? 'Creating account...' : 'Sign Up'}
                  </Button>

                  <Typography align="center" variant="body2">
                    Already have an account?{' '}
                    <Link to="/" style={{ fontWeight: 'bold' }}>
                      Sign in
                    </Link>
                  </Typography>

                </Box>
              </Form>
            )}
          </Formik>
      </Container>
    </Box>
  );
}

export default SignupPage;