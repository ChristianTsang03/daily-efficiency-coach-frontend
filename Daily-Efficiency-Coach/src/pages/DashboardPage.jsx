import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { today, mapHabits, getDueDateStr, sortByPriority } from '../components/dashboardUtils';
import AddForm from '../components/AddForm';
import TaskList from '../components/TaskList';
import HabitList from '../components/HabitList';
import { EditTaskDialog, EditHabitDialog } from '../components/EditDialogs';

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // Shared add-form fields
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('task');

  // Task add-form fields
  const [newPriority, setNewPriority] = useState('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Habit add-form fields
  const [habitScheduleType, setHabitScheduleType] = useState('daily');
  const [habitTimesPerWeek, setHabitTimesPerWeek] = useState(3);
  const [habitTargetType, setHabitTargetType] = useState('binary');
  const [habitTargetValue, setHabitTargetValue] = useState(1);
  const [habitTargetUnit, setHabitTargetUnit] = useState('');

  // Edit Task Dialog state
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState('medium');
  const [editTaskDeadline, setEditTaskDeadline] = useState('');

  // Edit Habit Dialog state
  const [editingHabit, setEditingHabit] = useState(null);
  const [editHabitName, setEditHabitName] = useState('');
  const [editHabitSchedule, setEditHabitSchedule] = useState('daily');
  const [editHabitTimesPerWeek, setEditHabitTimesPerWeek] = useState(3);
  const [editHabitTargetType, setEditHabitTargetType] = useState('binary');
  const [editHabitTargetValue, setEditHabitTargetValue] = useState(1);
  const [editHabitTargetUnit, setEditHabitTargetUnit] = useState('');

  const navigate = useNavigate();

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, todayRes] = await Promise.all([
          api.get('/tasks'),
          api.get(`/today?date=${today}`),
        ]);
        setTasks(sortByPriority(tasksRes.data.map((t) => ({ ...t, id: t._id }))));
        setHabits(mapHabits(todayRes.data.habits));
      } catch (err) {
        setFeedback('Failed to load data from server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) {
      setFeedback('Please enter a title.');
      return;
    }

    if (newType === 'habit') {
      const duplicate = habits.some(
        (h) => h.habit.name.toLowerCase() === newTitle.trim().toLowerCase()
      );
      if (duplicate) {
        setFeedback('A habit with this name already exists.');
        return;
      }
    }

    const payload =
      newType === 'task'
        ? {
          title: newTitle,
          priority: newPriority,
          dueAt: newDeadline ? `${newDeadline}T23:59:59` : null,
          category: newCategory || null,
        }
        : {
          name: newTitle,
          description: '',
          targetType: habitTargetType,
          targetValue: habitTargetType === 'binary' ? 1 : habitTargetValue,
          targetUnit: habitTargetType === 'binary' ? 'times' : habitTargetUnit,
          schedule: {
            type: habitScheduleType === 'weekly' ? 'weekly_x' : habitScheduleType,
            daysOfWeek: [],
            timesPerWeek: habitScheduleType === 'weekly' ? habitTimesPerWeek : 1,
          },
          startDate: today,
        };

    try {
      const endpoint = newType === 'task' ? '/tasks' : '/habits';
      const res = await api.post(endpoint, payload);

      if (newType === 'task') {
        setTasks((prev) => [{ ...res.data, id: res.data._id }, ...prev]);
      } else {
        const todayRes = await api.get(`/today?date=${today}`);
        setHabits(mapHabits(todayRes.data.habits));
      }

      setNewTitle('');
      setNewDeadline('');
      setNewCategory('');
      setFeedback('');
    } catch (err) {
      setFeedback('Failed to add item. Check console for details.');
      console.error(err.response?.data || err);
    }
  };

  const openEditTask = async (task) => {
    if (task.status === 'todo') {
      try {
        const res = await api.patch(`/tasks/${task.id}/start`);
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...res.data, id: res.data._id } : t))
        );
      } catch (err) {
        console.error('Failed to start task:', err);
      }
    }
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskPriority(task.priority);
    setEditTaskDeadline(task.dueAt ? getDueDateStr(task.dueAt) : '');
  };

  const closeEditTask = () => setEditingTask(null);

  const handleSaveTask = async () => {
    if (!editTaskTitle.trim()) return;
    try {
      const res = await api.patch(`/tasks/${editingTask.id}`, {
        title: editTaskTitle,
        priority: editTaskPriority,
        dueAt: editTaskDeadline ? `${editTaskDeadline}T00:00:00` : null,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...res.data, id: res.data._id } : t
        )
      );
      closeEditTask();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const openEditHabit = (habitEntry) => {
    const { habit } = habitEntry;
    setEditingHabit(habitEntry);
    setEditHabitName(habit.name);
    setEditHabitSchedule(
      habit.schedule?.type === 'weekly_x' ? 'weekly' : (habit.schedule?.type ?? 'daily')
    );
    setEditHabitTimesPerWeek(habit.schedule?.timesPerWeek ?? 3);
    setEditHabitTargetType(habit.targetType ?? 'binary');
    setEditHabitTargetValue(habit.targetValue ?? 1);
    setEditHabitTargetUnit(habit.targetUnit ?? '');
  };

  const closeEditHabit = () => setEditingHabit(null);

  const handleSaveHabit = async () => {
    if (!editHabitName.trim()) return;
    try {
      await api.patch(`/habits/${editingHabit.habit._id}`, {
        name: editHabitName,
        targetType: editHabitTargetType,
        targetValue: editHabitTargetType === 'binary' ? 1 : editHabitTargetValue,
        targetUnit: editHabitTargetType === 'binary' ? 'times' : editHabitTargetUnit,
        schedule: {
          type: editHabitSchedule === 'weekly' ? 'weekly_x' : editHabitSchedule,
          daysOfWeek: [],
          timesPerWeek: editHabitSchedule === 'weekly' ? editHabitTimesPerWeek : 1,
        },
      });
      const todayRes = await api.get(`/today?date=${today}`);
      setHabits(mapHabits(todayRes.data.habits));
      closeEditHabit();
    } catch (err) {
      console.error('Failed to update habit:', err);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      if (task.status !== 'done') {
        const res = await api.patch(`/tasks/${task.id}/complete`);
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...res.data, id: res.data._id } : t))
        );
      } else {
        const res = await api.patch(`/tasks/${task.id}`, { status: 'todo' });
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...res.data, id: res.data._id } : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleSkipTask = async (task) => {
    try {
      const res = await api.patch(`/tasks/${task.id}/skip`);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...res.data, id: res.data._id } : t))
      );
    } catch (err) {
      console.error('Failed to skip task:', err);
    }
  };

  const handlePostponeTask = async (task) => {
    try {
      const res = await api.patch(`/tasks/${task.id}/postpone?days=1`);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...res.data, id: res.data._id } : t))
      );
    } catch (err) {
      console.error('Failed to postpone task:', err);
    }
  };

  const handleToggleBinaryHabit = async (habitEntry) => {
    const isDone = habitEntry.statusToday === 'done';
    try {
      await api.post('/habit-logs', {
        habitId: habitEntry.habit._id,
        date: today,
        status: isDone ? 'missed' : 'done',
      });
      setHabits((prev) =>
        prev.map((h) =>
          h.habit._id === habitEntry.habit._id
            ? { ...h, statusToday: isDone ? 'missed' : 'done' }
            : h
        )
      );
    } catch (err) {
      console.error('Failed to log binary habit:', err);
    }
  };

  const handleCountChange = async (habitEntry, delta) => {
    const target = habitEntry.habit.targetValue;
    const newValue = Math.max(0, Math.min(target, (habitEntry.currentValue || 0) + delta));
    const newStatus =
      newValue >= target ? 'done'
        : newValue > 0 ? 'in_progress'
          : 'missed';

    try {
      await api.post('/habit-logs', {
        habitId: habitEntry.habit._id,
        date: today,
        status: newStatus,
        value: newValue,
      });
      setHabits((prev) =>
        prev.map((h) =>
          h.habit._id === habitEntry.habit._id
            ? { ...h, currentValue: newValue, statusToday: newStatus }
            : h
        )
      );
    } catch (err) {
      console.error('Failed to log count habit:', err);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await api.delete(`/tasks/${task.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleDeleteHabit = async (habitEntry) => {
    try {
      await api.delete(`/habits/${habitEntry.habit._id}`);
      setHabits((prev) => prev.filter((h) => h.habit._id !== habitEntry.habit._id));
    } catch (err) {
      console.error('Failed to delete habit:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%', 
      backgroundColor: '#F2EFE9', 
      color: '#2C3E50',
      py: 4 
    }}>
      <Container maxWidth="md">

        {/* Header */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#1B4F72' }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#5D6D7E' }}>{todayLabel}</Typography>
          </Box>
          
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={() => navigate('/analytics')}
              startIcon={<BarChartIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2.5,
                bgcolor: '#1B4F72',
                boxShadow: '0 4px 12px rgba(27, 79, 114, 0.2)',
                '&:hover': { backgroundColor: '#2874A6' },
              }}
            >
              Analytics
            </Button>
              <Button
              variant="contained"
              onClick={() => navigate('/insights')}
              startIcon={<BarChartIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2.5,
                bgcolor: '#1B4F72',
                boxShadow: '0 4px 12px rgba(27, 79, 114, 0.2)',
                '&:hover': { backgroundColor: '#2874A6' },
              }}
            >
              Insights
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2.5,
                borderColor: '#A9CCE3', 
                color: '#1B4F72',
                '&:hover': { borderColor: '#1B4F72', bgcolor: 'rgba(27, 79, 114, 0.05)' }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        <AddForm
          newTitle={newTitle} setNewTitle={setNewTitle}
          newType={newType} setNewType={setNewType}
          feedback={feedback}
          onAdd={handleAdd}
          newPriority={newPriority} setNewPriority={setNewPriority}
          newDeadline={newDeadline} setNewDeadline={setNewDeadline}
          newCategory={newCategory} setNewCategory={setNewCategory}
          habitScheduleType={habitScheduleType} setHabitScheduleType={setHabitScheduleType}
          habitTimesPerWeek={habitTimesPerWeek} setHabitTimesPerWeek={setHabitTimesPerWeek}
          habitTargetType={habitTargetType} setHabitTargetType={setHabitTargetType}
          habitTargetValue={habitTargetValue} setHabitTargetValue={setHabitTargetValue}
          habitTargetUnit={habitTargetUnit} setHabitTargetUnit={setHabitTargetUnit}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggleTask}
          onEdit={openEditTask}
          onDelete={handleDeleteTask}
          onSkip={handleSkipTask}
          onPostpone={handlePostponeTask}
        />

        <HabitList
          habits={habits}
          loading={loading}
          onToggleBinary={handleToggleBinaryHabit}
          onCountChange={handleCountChange}
          onEdit={openEditHabit}
          onDelete={handleDeleteHabit}
        />

      </Container>

      <EditTaskDialog
        open={!!editingTask}
        onClose={closeEditTask}
        onSave={handleSaveTask}
        title={editTaskTitle} setTitle={setEditTaskTitle}
        priority={editTaskPriority} setPriority={setEditTaskPriority}
        deadline={editTaskDeadline} setDeadline={setEditTaskDeadline}
      />

      <EditHabitDialog
        open={!!editingHabit}
        onClose={closeEditHabit}
        onSave={handleSaveHabit}
        name={editHabitName} setName={setEditHabitName}
        schedule={editHabitSchedule} setSchedule={setEditHabitSchedule}
        timesPerWeek={editHabitTimesPerWeek} setTimesPerWeek={setEditHabitTimesPerWeek}
        targetType={editHabitTargetType} setTargetType={setEditHabitTargetType}
        targetValue={editHabitTargetValue} setTargetValue={setEditHabitTargetValue}
        targetUnit={editHabitTargetUnit} setTargetUnit={setEditHabitTargetUnit}
      />
    </Box>
  );
}

export default DashboardPage;