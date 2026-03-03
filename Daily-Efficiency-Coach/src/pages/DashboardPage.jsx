import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Alert, Chip, IconButton, Checkbox, Select, MenuItem, FormControl, InputLabel, Divider} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

//SAMPLE DATA
const initialTasks = [
  { id: 1, title: 'Submit Homework', priority: 'high', completed: false, type: 'task', deadline: '2026-03-05' },
  { id: 2, title: 'Review lecture notes', priority: 'medium', completed: false, type: 'task', deadline: '2026-03-03' },
  { id: 3, title: 'Go to class', priority: 'low', completed: false, type: 'habit', deadline: '' },
];

const priorityColour = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

function DashboardPage() {
  const [items, setItems] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newType, setNewType] = useState('task');
  const [newDeadline, setNewDeadline] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleAdd = () => {
    if (!newTitle.trim()) {
      setFeedback('Please enter a title.');
      return;
    }
    const newItem = {
      id: Date.now(),
      title: newTitle,
      priority: newPriority,
      type: newType,
      completed: false,
      deadline: newDeadline,
    };
    setItems([...items, newItem]);
    setNewTitle('');
    setNewDeadline('');
    setFeedback('');
  };

  const handleToggle = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      } else {
        return item;
      }
    }));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const tasks = items.filter(i => i.type === 'task');
  const habits = items.filter(i => i.type === 'habit');

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isToday = (deadline) => {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline === today;
  };

  const isOverdue = (deadline, completed) => {
    if (!deadline || completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  const renderItem = (item) => (
    <Box key={item.id}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        <Checkbox
          checked={item.completed}
          onChange={() => handleToggle(item.id)}
          sx={{ color: '#1a1a2e', '&.Mui-checked': { color: '#1a1a2e' } }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: item.completed ? 'line-through' : 'none',
              color: item.completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {item.title}
          </Typography>
          {item.deadline && (
            <Typography
              variant="caption"
              sx={{
                color: isOverdue(item.deadline, item.completed)
                  ? 'error.main'
                  : isToday(item.deadline)
                  ? 'warning.main'
                  : 'text.secondary',
              }}
            >
              {isOverdue(item.deadline, item.completed)
                ? `Overdue · ${formatDeadline(item.deadline)}`
                : isToday(item.deadline)
                ? `Due today · ${formatDeadline(item.deadline)}`
                : `Due ${formatDeadline(item.deadline)}`}
            </Typography>
          )}
        </Box>
        <Chip
          label={item.priority}
          color={priorityColour[item.priority]}
          size="small"
          sx={{ mr: 1, textTransform: 'capitalize' }}
        />
        <IconButton onClick={() => handleDelete(item.id)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#f0f2f5', py: 4 }}>
      <Container maxWidth="md">

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {today}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/analytics')}
            startIcon={<BarChartIcon />}
            sx={{
              fontWeight: 'bold',
              borderColor: '#1a1a2e',
              color: '#1a1a2e',
              '&:hover': { backgroundColor: '#1a1a2e', color: '#fff', borderColor: '#1a1a2e' }
            }}
          >
            Analytics
          </Button>
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Add New
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              sx={{ flex: 2, minWidth: 200 }}
            />

            <TextField
              label="Deadline"
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />

            <FormControl sx={{ minWidth: 130 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newPriority}
                label="Priority"
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newType}
                label="Type"
                onChange={(e) => setNewType(e.target.value)}
              >
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="habit">Habit</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleAdd}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>

          {feedback && <Alert severity="error" sx={{ mt: 2 }}>{feedback}</Alert>}
        </Paper>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Tasks</Typography>
          {tasks.length === 0 && (
            <Typography variant="body2" color="text.secondary">No tasks yet.</Typography>
          )}
          {tasks.map(renderItem)}
        </Paper>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Habits</Typography>
          {habits.length === 0 && (
            <Typography variant="body2" color="text.secondary">No habits yet.</Typography>
          )}
          {habits.map(renderItem)}
        </Paper>

      </Container>
    </Box>
  );
}

export default DashboardPage;