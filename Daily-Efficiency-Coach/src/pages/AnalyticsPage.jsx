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
import { today } from '../components/dashboardUtils';

const COLORS = {
  completed: '#4caf50',
  remaining: '#163775',
  onTime:    '#4caf50',
  late:      '#f44336',
};

const TIME_BLOCK_LABELS = {
  midnight:      'Midnight (12–5am)',
  early_morning: 'Early Morning (5–9am)',
  morning:       'Morning (9am–12pm)',
  afternoon:     'Afternoon (12–5pm)',
  evening:       'Evening (5–9pm)',
  night:         'Night (9pm+)',
};

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

  const [days, setDays] = useState(7);

  const [completionData, setCompletionData]       = useState(null);
  const [completionLoading, setCompletionLoading] = useState(true);

  const [delayData, setDelayData]       = useState(null);
  const [delayLoading, setDelayLoading] = useState(true);

  const [patternData, setPatternData]       = useState(null);
  const [patternLoading, setPatternLoading] = useState(true);

  const [habits, setHabits]               = useState([]);
  const [streaks, setStreaks]             = useState({});
  const [habitsLoading, setHabitsLoading] = useState(true);

  useEffect(() => {
    const fetchTaskAnalytics = async () => {
      setCompletionLoading(true);
      setDelayLoading(true);
      setPatternLoading(true);
      try {
        const [completionRes, delayRes, patternRes] = await Promise.all([
          api.get(`/analytics/tasks/completion-rate?days=${days}`),
          api.get(`/analytics/tasks/delays?days=${days}`),
          api.get(`/analytics/tasks/behavior-patterns?days=${days}`),
        ]);
        setCompletionData(completionRes.data);
        setDelayData(delayRes.data);
        setPatternData(patternRes.data);
      } catch (err) {
        console.error('Failed to fetch task analytics:', err);
      } finally {
        setCompletionLoading(false);
        setDelayLoading(false);
        setPatternLoading(false);
      }
    };
    fetchTaskAnalytics();
  }, [days]);

  useEffect(() => {
    const fetchHabitStreaks = async () => {
      setHabitsLoading(true);
      try {
        const habitsRes = await api.get('/habits?active_only=true');
        const habitList = habitsRes.data;
        setHabits(habitList);

        // Pass today's local date to streak endpoint so timezone doesn't cause mismatch
        const streakResults = await Promise.all(
          habitList.map((h) =>
            api.get(`/analytics/habits/streak?habit_id=${h._id}&date=${today}`)
          )
        );

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
  }, []);

  const completionPieData = completionData
    ? [
        { name: 'Completed',     value: completionData.completed,                               fill: COLORS.completed },
        { name: 'Not Completed', value: completionData.created - completionData.completed,      fill: COLORS.remaining },
      ]
    : [];

  const delayBarData = delayData
    ? [
        { name: 'On Time', count: delayData.onTime, fill: COLORS.onTime },
        { name: 'Late',    count: delayData.late,   fill: COLORS.late   },
      ]
    : [];

  const productiveDaysData = patternData?.productiveDays?.map((d) => ({
    name:        d.day.slice(0, 3),
    completions: d.completions,
    fill:        '#1a1a2e',
  })) ?? [];

  const productiveBlocksData = patternData?.productiveBlocks?.map((b) => ({
    name:        TIME_BLOCK_LABELS[b.time_block] ?? b.time_block,
    completions: b.completions,
    fill:        '#163775',
  })) ?? [];

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#F2EFE9', py: 4 }}>
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
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="Completion Rate"
                  value={`${Math.round((completionData.completionRate ?? 0) * 100)}%`}
                  subtitle={`${completionData.completed} of ${completionData.created} tasks`}
                  color="#4caf50"
                />
                <StatCard label="Created"   value={completionData.created}   subtitle="tasks this period" />
                <StatCard label="Completed" value={completionData.completed} subtitle="tasks this period" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionPieData}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={80}
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

        {/* Task Delays */}
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
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard label="On Time" value={delayData.onTime} subtitle="tasks completed on time" color="#4caf50" />
                <StatCard label="Late"    value={delayData.late}   subtitle="tasks completed late"    color="#f44336" />
                <StatCard
                  label="Avg Delay"
                  value={delayData.late > 0 ? `${delayData.avgDelayDays}d` : '—'}
                  subtitle="average days late"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayBarData} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Behavior Patterns */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Behavior Patterns
          </Typography>
          {patternLoading ? (
            <CircularProgress size={24} />
          ) : !patternData ? (
            <Typography variant="body2" color="text.secondary">
              No pattern data available.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="Most Productive Day"
                  value={patternData.mostProductiveDay ?? '—'}
                  subtitle="most tasks completed"
                  color="#1a1a2e"
                />
                <StatCard
                  label="Most Productive Time"
                  value={TIME_BLOCK_LABELS[patternData.mostProductiveBlock]?.split(' ')[0] ?? '—'}
                  subtitle={TIME_BLOCK_LABELS[patternData.mostProductiveBlock] ?? ''}
                  color="#1a1a2e"
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Completions by Day of Week
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productiveDaysData} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Completions by Time of Day
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productiveBlocksData} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#163775" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {patternData.mostSkipped?.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Most Skipped Categories
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostSkipped.map((item) => (
                      <StatCard key={item.category} label={item.category} value={item.count} subtitle="times skipped" color="#f44336" />
                    ))}
                  </Box>
                </Box>
              )}

              {patternData.mostPostponed?.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Most Postponed Categories
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostPostponed.map((item) => (
                      <StatCard key={item.category} label={item.category} value={item.count} subtitle="times postponed" color="#ff9800" />
                    ))}
                  </Box>
                </Box>
              )}

              {patternData.mostLate?.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Most Often Late by Category
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostLate.map((item) => (
                      <StatCard key={item.category} label={item.category} value={item.times_late} subtitle="times completed late" color="#f44336" />
                    ))}
                  </Box>
                </Box>
              )}

              {patternData.mostSkipped?.length === 0 &&
               patternData.mostPostponed?.length === 0 &&
               patternData.mostLate?.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Category breakdown will appear once tasks with categories are skipped, postponed, or completed late.
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        {/* Habit Streaks */}
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
                          sx={{ color: streak > 0 ? '#ff9800' : 'text.secondary' }}
                        >
                          {streak > 0 ? `🔥 ${streak}` : '—'}
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