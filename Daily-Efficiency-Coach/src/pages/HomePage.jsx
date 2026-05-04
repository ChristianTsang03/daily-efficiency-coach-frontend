import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Typography, Grid, Paper, Stack
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsIcon from '@mui/icons-material/Sports';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#5DADE2' }} />,
      title: 'Task Management',
      desc: 'Add, prioritize, and track tasks by deadline. Skip or postpone with one click.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32, color: '#5DADE2' }} />,
      title: 'Habit Tracking',
      desc: 'Build daily streaks and monitor consistency across all your habits.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 32, color: '#5DADE2' }} />,
      title: 'Smart Analytics',
      desc: 'Discover your most productive days, times, and behavior patterns.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#5DADE2' }} />,
      title: 'Progress Insights',
      desc: 'Visualize completion rates, delays, and habit streaks over time.',
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#F2EFE9',
      color: '#2C3E50',
      fontFamily: "'Georgia', serif",
      pb: 10,
      position: 'relative', 
    }}>

      {/* BRAND LABEL (Top Left) */}
      <Box sx={{ 
        position: 'absolute', 
        top: 24, 
        left: 24, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        zIndex: 10 
      }}>
        <SportsIcon sx={{ color: '#1B4F72', fontSize: 28 }} />
        <Typography 
          variant="h6" 
          fontWeight={800} 
          sx={{ 
            color: '#1B4F72', 
            letterSpacing: '-0.02em',
            fontSize: '1.1rem',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Daily Efficiency Coach
        </Typography>
      </Box>

      <Box sx={{
        position: 'relative',
        zIndex: 1,
        pt: { xs: 14, md: 16 },
        pb: { xs: 8, md: 8 },
        textAlign: 'center',
        px: 2,
      }}>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              color: '#1B4F72',
            }}
          >
            Daily Efficiency Coach
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#566573',
              maxWidth: 550,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Improve your time management, build long-lasting habits, and elevate your productivity with a system that breathes.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={() => navigate('/signup')} 
              sx={{ 
                bgcolor: '#1B4F72', 
                color: 'white', 
                fontWeight: 600, 
                px: 5, 
                py: 1.8, 
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 10px 20px rgba(27, 79, 114, 0.15)',
                '&:hover': { bgcolor: '#2874A6' }
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')} 
              sx={{ 
                borderColor: '#A9CCE3', 
                color: '#1B4F72', 
                px: 5, 
                py: 1.8, 
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': { borderWidth: '2px', borderColor: '#1B4F72', bgcolor: 'rgba(27, 79, 114, 0.05)' }
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg"> 
        <Grid 
          container 
          spacing={4} 
          justifyContent="center" 
          sx={{ width: '100%', margin: '0 auto' }} 
        >
          {features.map((f, i) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4}
              key={i} 
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  maxWidth: 400, 
                  minHeight: 260,
                  p: 4,
                  bgcolor: '#E8F1F5', 
                  border: '1px solid #D4E6F1',
                  borderRadius: 6, 
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  {f.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#1B4F72', mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5D6D7E', lineHeight: 1.7 }}>
                  {f.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;