import { useState, useEffect } from 'react';
import {
  Box, Button, CircularProgress, Container, FormControl,
  InputLabel, MenuItem, Paper, Select, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const COLORS = {
  completed: '#4caf50',
  remaining: '#163775',
  onTime:    '#4caf50',
  late:      '#f44336',
};


/**
 * A single stat card showing a label, a large number, and an optional subtitle.
 */
function StatCard({ label, value, subtitle, color }) {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center', flex: 1, minWidth: 160 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h3" fontWeight="bold" sx={{ color: color || 'text.primary' }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

function AnalyticsPage() {
  const navigate = useNavigate();

  // Time window selector
  const [days, setDays] = useState(7);

  //Task completion rate state
  const [completionData, setCompletionData]       = useState(null);
  const [completionLoading, setCompletionLoading] = useState(true);

  //Task delays state
  const [delayData, setDelayData]       = useState(null);
  const [delayLoading, setDelayLoading] = useState(true);

  // Habit streaks state
  // habits is the list of all habits fetched from /habits
  // streaks maps habitId → streak count
  const [habits, setHabits]           = useState([]);
  const [streaks, setStreaks]         = useState({});
  const [habitsLoading, setHabitsLoading] = useState(true);

  //Fetch task analytics whenever the time window changes
  useEffect(() => {
    const fetchTaskAnalytics = async () => {
      setCompletionLoading(true);
      setDelayLoading(true);
      try {
        const [completionRes, delayRes] = await Promise.all([
          api.get(`/analytics/tasks/completion-rate?days=${days}`),
          api.get(`/analytics/tasks/delays?days=${days}`),
        ]);
        setCompletionData(completionRes.data);
        setDelayData(delayRes.data);
      } catch (err) {
        console.error('Failed to fetch task analytics:', err);
      } finally {
        setCompletionLoading(false);
        setDelayLoading(false);
      }
    };
    fetchTaskAnalytics();
  }, [days]); // re-runs whenever days changes

  //Fetch habits once, then fetch a streak for each one
  useEffect(() => {
    const fetchHabitStreaks = async () => {
      setHabitsLoading(true);
      try {
        const habitsRes = await api.get('/habits?active_only=true');
        const habitList = habitsRes.data;
        setHabits(habitList);

        // Fetch all streaks in parallel — one request per habit
        const streakResults = await Promise.all(
          habitList.map((h) =>
            api.get(`/analytics/habits/streak?habit_id=${h._id}`)
          )
        );

        // Build a map of habitId → streak count for easy lookup
        const streakMap = {};
        streakResults.forEach((res, i) => {
          streakMap[habitList[i]._id] = res.data.streak;
        });
        setStreaks(streakMap);
      } catch (err) {
        console.error('Failed to fetch habit streaks:', err);
      } finally {
        setHabitsLoading(false);
      }
    };
    fetchHabitStreaks();
  }, []); // only runs once on mount


  // Pie chart
  const completionPieData = completionData
    ? [
        {
          name:  'Completed',
          value: completionData.completed,
          fill:  COLORS.completed,
        },
        {
          name:  'Not Completed',
          value: completionData.created - completionData.completed,
          fill:  COLORS.remaining,
        },
      ]
    : [];

  // Bar chart
  const delayBarData = delayData
    ? [
        { name: 'On Time', count: delayData.onTime, fill: COLORS.onTime },
        { name: 'Late',    count: delayData.late,   fill: COLORS.late   },
      ]
    : [];


  return (
    <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#f0f2f5', py: 4 }}>
      <Container maxWidth="md">

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Analytics</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              fontWeight: 'bold',
              borderColor: '#1a1a2e',
              color: '#1a1a2e',
              '&:hover': { backgroundColor: '#1a1a2e', color: '#fff', borderColor: '#1a1a2e' },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Time window selector */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" fontWeight="bold">Time Window</Typography>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Days</InputLabel>
            <Select value={days} label="Days" onChange={(e) => setDays(e.target.value)}>
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Task Completion Rate */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Task Completion Rate
          </Typography>

          {completionLoading ? (
            <CircularProgress size={24} />
          ) : !completionData || completionData.created === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No tasks created in this period.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>

              {/* Stat cards */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="Completion Rate"
                  value={`${Math.round((completionData.completionRate ?? 0) * 100)}%`}
                  subtitle={`${completionData.completed} of ${completionData.created} tasks`}
                  color="#4caf50"
                />
                <StatCard
                  label="Created"
                  value={completionData.created}
                  subtitle="tasks this period"
                />
                <StatCard
                  label="Completed"
                  value={completionData.completed}
                  subtitle="tasks this period"
                />
              </Box>

              {/* Pie chart  */}
              <Box sx={{ flex: 1, minWidth: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

            </Box>
          )}
        </Paper>

        {/*Task Delays */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Task Delays
          </Typography>

          {delayLoading ? (
            <CircularProgress size={24} />
          ) : !delayData || (delayData.onTime === 0 && delayData.late === 0) ? (
            <Typography variant="body2" color="text.secondary">
              No completed tasks with deadlines in this period.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>

              {/* Stat cards */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="On Time"
                  value={delayData.onTime}
                  subtitle="tasks completed on time"
                  color="#4caf50"
                />
                <StatCard
                  label="Late"
                  value={delayData.late}
                  subtitle="tasks completed late"
                  color="#f44336"
                />
                <StatCard
                  label="Avg Delay"
                  value={delayData.late > 0 ? `${delayData.avgDelayDays}d` : '—'}
                  subtitle="average days late"
                />
              </Box>

              {/* Bar chart*/}
              <Box sx={{ flex: 1, minWidth: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayBarData} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}
                      // fill per entry is read from the data object automatically
                      isAnimationActive={true}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

            </Box>
          )}
        </Paper>

        {/*Habit Streaks*/}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Habit Streaks
          </Typography>

          {habitsLoading ? (
            <CircularProgress size={24} />
          ) : habits.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No active habits found.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Sort by streak descending */}
              {[...habits]
                .sort((a, b) => (streaks[b._id] ?? 0) - (streaks[a._id] ?? 0))
                .map((habit) => {
                  const streak = streaks[habit._id] ?? 0;
                  return (
                    <Box
                      key={habit._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <Box>
                        <Typography variant="body1">{habit.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {habit.schedule?.type === 'daily' ? 'Daily' : `${habit.schedule?.timesPerWeek}x / week`}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ color: streak > 0 }}
                        >
                          {streak > 0 ? ` ${streak}` : '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          day streak
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          )}
        </Paper>

      </Container>
    </Box>
  );
}

export default AnalyticsPage;
