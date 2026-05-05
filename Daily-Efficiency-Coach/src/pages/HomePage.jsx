import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, Stack } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoSrc from '../assets/logo.svg';

const features = [
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 22, color: '#1B4F72' }} />,
    title: 'Task Management',
    desc: 'Add, prioritize, and track tasks by deadline. Skip or postpone with one click.',
    number: '01',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 22, color: '#1B4F72' }} />,
    title: 'Habit Tracking',
    desc: 'Build daily streaks and monitor consistency across all your habits.',
    number: '02',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 22, color: '#1B4F72' }} />,
    title: 'Smart Analytics',
    desc: 'Discover your most productive days, times, and behavior patterns.',
    number: '03',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 22, color: '#1B4F72' }} />,
    title: 'AI Coach',
    desc: 'Get personalized weekly reflections and coaching based on your real data.',
    number: '04',
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#F2EFE9',
      color: '#2C3E50',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle dot grid texture */}
      <Box sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, #C5D8E8 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.35,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Decorative circle top right */}
      <Box sx={{
        position: 'absolute',
        top: -120,
        right: -120,
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '1px solid rgba(27,79,114,0.08)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 260,
        height: 260,
        borderRadius: '50%',
        border: '1px solid rgba(27,79,114,0.06)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Nav */}
      <Box sx={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 3, md: 6 },
        py: 3,
      }}>
        <img src={LogoSrc} alt="Daily Efficiency Coach" style={{ height: 150 }} />
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() => navigate('/login')}
            sx={{
              color: '#1B4F72',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              px: 2.5,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(27,79,114,0.06)' },
            }}
          >
            Sign in
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              bgcolor: '#1B4F72',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 3,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#154060', boxShadow: 'none' },
            }}
          >
            Get started
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 10 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 6, md: 8 },
        }}>

          {/* Left — text */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{
              display: 'inline-block',
              px: 2,
              py: 0.5,
              mb: 3,
              bgcolor: 'rgba(27,79,114,0.07)',
              borderRadius: 99,
              border: '1px solid rgba(27,79,114,0.12)',
            }}>
              <Typography sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#1B4F72',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Productivity · Analytics · AI Coaching
              </Typography>
            </Box>

            <Typography sx={{
              fontSize: { xs: '2.6rem', md: '3.8rem' },
              fontWeight: 800,
              lineHeight: 1.08,
              color: '#1B4F72',
              mb: 3,
              fontFamily: "'Georgia', serif",
              letterSpacing: '-0.02em',
            }}>
              Build better
              <br />
              <Box component="span" sx={{
                color: 'transparent',
                WebkitTextStroke: '2px #1B4F72',
              }}>
                habits.
              </Box>
              <br />
              Do more.
            </Typography>

            <Typography sx={{
              fontSize: '1.05rem',
              color: '#566573',
              lineHeight: 1.8,
              maxWidth: 440,
              mb: 5,
            }}>
              Track your tasks and habits, analyze your patterns, and get personalized AI coaching.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: '#1B4F72',
                  color: 'white',
                  fontWeight: 700,
                  px: 5,
                  py: 1.6,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 24px rgba(27,79,114,0.2)',
                  '&:hover': { bgcolor: '#154060', boxShadow: '0 12px 32px rgba(27,79,114,0.28)' },
                  transition: 'all 0.2s ease',
                }}
              >
                Start for free
              </Button>
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  color: '#1B4F72',
                  fontWeight: 600,
                  px: 4,
                  py: 1.6,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  border: '1.5px solid rgba(27,79,114,0.2)',
                  '&:hover': { bgcolor: 'rgba(27,79,114,0.05)', borderColor: '#1B4F72' },
                }}
              >
                Sign in →
              </Button>
            </Stack>
          </Box>

          {/* Right — stat cards */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: { md: 380 },
            width: '100%',
          }}>
            {[
              { label: 'Tasks completed this week', value: '12 / 14', delta: '+3 from last week', color: '#E8F4FD' },
              { label: 'Habit consistency', value: '87%', delta: 'Best streak: 9 days', color: '#EAF7F0' },
              { label: 'Most productive time', value: 'Morning', delta: '9am – 12pm window', color: '#FEF9EE' },
            ].map((stat, i) => (
              <Box key={i} sx={{
                p: 3,
                bgcolor: stat.color,
                borderRadius: 3,
                border: '1px solid rgba(27,79,114,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Box>
                  <Typography sx={{ fontSize: '0.78rem', color: '#5D6D7E', mb: 0.5, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: '#27AE60', fontWeight: 500 }}>
                    {stat.delta}
                  </Typography>
                </Box>
                <Typography sx={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#1B4F72',
                  fontFamily: "'Georgia', serif",
                }}>
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 8 }} />

        {/* Features */}
        <Box sx={{ pb: 12 }}>
          <Box sx={{ mb: 6 }}>
            <Typography sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1B4F72',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}>
              Everything you need
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} key={i} sx={{ display: 'flex' }}>
                <Box sx={{
                  p: 3.5,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid rgba(27,79,114,0.08)',
                  width: '100%',
                  minHeight: 200,
                  maxWidth: 200,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(27,79,114,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(27,79,114,0.08)',
                  },
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: '#EBF5FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {f.icon}
                    </Box>
                    <Typography sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'rgba(27,79,114,0.3)',
                      letterSpacing: '0.05em',
                    }}>
                      {f.number}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1B4F72', mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#5D6D7E', lineHeight: 1.7 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;