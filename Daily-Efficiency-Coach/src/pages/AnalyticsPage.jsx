import { useState, useEffect } from 'react';
import {
  Box, Button, CircularProgress, Container, FormControl,
  InputLabel, MenuItem, Select, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { today } from '../components/dashboardUtils';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COLORS = {
  completed: '#27AE60',
  remaining: '#A9CCE3',
  onTime:    '#27AE60',
  late:      '#E74C3C',
};

const TIME_BLOCK_LABELS = {
  midnight:      'Midnight (12–5am)',
  early_morning: 'Early Morning (5–9am)',
  morning:       'Morning (9am–12pm)',
  afternoon:     'Afternoon (12–5pm)',
  evening:       'Evening (5–9pm)',
  night:         'Night (9pm+)',
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, subtitle, color }) {
  return (
    <Box sx={{
      p: 2.5,
      bgcolor: 'white',
      border: '1px solid rgba(27,79,114,0.09)',
      borderRadius: '12px',
      textAlign: 'center',
      flex: 1,
      minWidth: 140,
    }}>
      <Typography sx={{ fontSize: '0.75rem', color: '#8FA3B1', mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: '2rem',
        fontWeight: 800,
        color: color || '#1B4F72',
        fontFamily: "'Georgia', serif",
        lineHeight: 1.2,
      }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: '0.72rem', color: '#8FA3B1', mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function AnalyticsPage() {
  const navigate = useNavigate();

  // Time window selector
  const [days, setDays] = useState(7);

  // Task completion rate
  const [completionData, setCompletionData]       = useState(null);
  const [completionLoading, setCompletionLoading] = useState(true);

  // Task delays
  const [delayData, setDelayData]       = useState(null);
  const [delayLoading, setDelayLoading] = useState(true);

  // Behavior patterns
  const [patternData, setPatternData]       = useState(null);
  const [patternLoading, setPatternLoading] = useState(true);

  // Habit streaks
  const [habits, setHabits]           = useState([]);
  const [streaks, setStreaks]         = useState({});
  const [habitsLoading, setHabitsLoading] = useState(true);

  // ── Fetch task analytics whenever days changes ─────────────────────────────

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

  // ── Fetch habits once then streak for each ─────────────────────────────────

  useEffect(() => {
    const fetchHabitStreaks = async () => {
      setHabitsLoading(true);
      try {
        const habitsRes = await api.get('/habits?active_only=true');
        const habitList = habitsRes.data;
        setHabits(habitList);

        // Pass today's local date so timezone doesn't cause mismatch
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

  // ── Derived chart data ─────────────────────────────────────────────────────

  const completionPieData = completionData
    ? [
        { name: 'Completed',     value: completionData.completed,                              fill: COLORS.completed },
        { name: 'Not Completed', value: completionData.created - completionData.completed,     fill: COLORS.remaining },
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
  })) ?? [];

  const productiveBlocksData = patternData?.productiveBlocks?.map((b) => ({
    name:        TIME_BLOCK_LABELS[b.time_block] ?? b.time_block,
    completions: b.completions,
  })) ?? [];

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="dec-page">
      <div className="dec-dotgrid" />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <h1 className="dec-page-title">Analytics</h1>
            <p className="dec-page-subtitle">Track your productivity patterns</p>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            className="dec-back-btn"
            sx={{ px: 2.5, py: 1 }}
          >
            Dashboard
          </Button>
        </Box>

        {/* Time window selector */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <span className="dec-stat-pill">Time Window</span>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#8FA3B1' }}>Days</InputLabel>
            <Select
              value={days}
              label="Days"
              onChange={(e) => setDays(e.target.value)}
              sx={{
                borderRadius: '10px',
                bgcolor: 'white',
                '& fieldset': { borderColor: 'rgba(27,79,114,0.15)' },
              }}
            >
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ── Task Completion Rate ── */}
        <div className="dec-card">
          <p className="dec-card-label">Task Completion Rate</p>

          {completionLoading ? (
            <CircularProgress size={22} sx={{ color: '#1B4F72' }} />
          ) : !completionData || completionData.created === 0 ? (
            <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
              No tasks created in this period.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="Completion Rate"
                  value={`${Math.round((completionData.completionRate ?? 0) * 100)}%`}
                  subtitle={`${completionData.completed} of ${completionData.created} tasks`}
                  color="#27AE60"
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
        </div>

        {/* ── Task Delays ── */}
        <div className="dec-card">
          <p className="dec-card-label">Task Delays</p>

          {delayLoading ? (
            <CircularProgress size={22} sx={{ color: '#1B4F72' }} />
          ) : !delayData || (delayData.onTime === 0 && delayData.late === 0) ? (
            <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
              No completed tasks with deadlines in this period.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard label="On Time"   value={delayData.onTime} subtitle="completed on time" color="#27AE60" />
                <StatCard label="Late"      value={delayData.late}   subtitle="completed late"    color="#E74C3C" />
                <StatCard
                  label="Avg Delay"
                  value={delayData.late > 0 ? `${delayData.avgDelayDays}d` : '—'}
                  subtitle="average days late"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayBarData} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
        </div>

        {/* ── Behavior Patterns ── */}
        <div className="dec-card">
          <p className="dec-card-label">Behavior Patterns</p>

          {patternLoading ? (
            <CircularProgress size={22} sx={{ color: '#1B4F72' }} />
          ) : !patternData ? (
            <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
              No pattern data available.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

              {/* Most productive day and time stat cards */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatCard
                  label="Most Productive Day"
                  value={patternData.mostProductiveDay ?? '—'}
                  subtitle="most tasks completed"
                />
                <StatCard
                  label="Most Productive Time"
                  value={TIME_BLOCK_LABELS[patternData.mostProductiveBlock]?.split(' ')[0] ?? '—'}
                  subtitle={TIME_BLOCK_LABELS[patternData.mostProductiveBlock] ?? ''}
                />
              </Box>

              {/* Completions by day of week */}
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4F72', mb: 1.5 }}>
                  Completions by Day of Week
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productiveDaysData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#1B4F72" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Completions by time of day */}
              <Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4F72', mb: 1.5 }}>
                  Completions by Time of Day
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productiveBlocksData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#2874A6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Most skipped categories */}
              {patternData.mostSkipped?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4F72', mb: 1.5 }}>
                    Most Skipped Categories
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostSkipped.map((item) => (
                      <StatCard
                        key={item.category}
                        label={item.category}
                        value={item.count}
                        subtitle="times skipped"
                        color="#E74C3C"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Most postponed categories */}
              {patternData.mostPostponed?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4F72', mb: 1.5 }}>
                    Most Postponed Categories
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostPostponed.map((item) => (
                      <StatCard
                        key={item.category}
                        label={item.category}
                        value={item.count}
                        subtitle="times postponed"
                        color="#E67E22"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Most often late categories */}
              {patternData.mostLate?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B4F72', mb: 1.5 }}>
                    Most Often Late by Category
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {patternData.mostLate.map((item) => (
                      <StatCard
                        key={item.category}
                        label={item.category}
                        value={item.times_late}
                        subtitle="times completed late"
                        color="#E74C3C"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Empty state for category stats */}
              {patternData.mostSkipped?.length === 0 &&
               patternData.mostPostponed?.length === 0 &&
               patternData.mostLate?.length === 0 && (
                <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
                  Category breakdown will appear once tasks with categories are skipped, postponed, or completed late.
                </Typography>
              )}

            </Box>
          )}
        </div>

        {/* ── Habit Streaks ── */}
        <div className="dec-card">
          <p className="dec-card-label">Habit Streaks</p>

          {habitsLoading ? (
            <CircularProgress size={22} sx={{ color: '#1B4F72' }} />
          ) : habits.length === 0 ? (
            <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
              No active habits found.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                        py: 1.5,
                        borderBottom: '1px solid rgba(27,79,114,0.07)',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#1B4F72' }}>
                          {habit.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#8FA3B1' }}>
                          {habit.schedule?.type === 'daily' ? 'Daily' : `${habit.schedule?.timesPerWeek}x / week`}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: streak > 0 ? '#E67E22' : '#C5D8E8',
                          fontFamily: "'Georgia', serif",
                        }}>
                          {streak > 0 ? `🔥 ${streak}` : '—'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#8FA3B1' }}>
                          day streak
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          )}
        </div>

      </Container>
    </div>
  );
}

export default AnalyticsPage;