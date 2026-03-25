import {
  Box, Chip, Checkbox, CircularProgress, Divider,
  IconButton, Paper, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { scheduleLabel } from './dashboardUtils';

function HabitRow({ habitEntry, onToggleBinary, onCountChange, onEdit, onDelete }) {
  const { habit, statusToday, currentValue } = habitEntry;
  const isCount = habit.targetType === 'count';
  const isDone  = statusToday === 'done';

  return (
    <Box key={habit._id}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1, gap: 1 }}>
        {!isCount && (
          <Checkbox
            checked={isDone}
            onChange={() => onToggleBinary(habitEntry)}
            sx={{ color: '#1a1a2e', '&.Mui-checked': { color: '#1a1a2e' } }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: isDone ? 'line-through' : 'none',
              color: isDone ? 'text.secondary' : 'text.primary',
            }}
          >
            {habit.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {scheduleLabel(habit.schedule)}
            {isCount ? ` · ${habit.targetValue} ${habit.targetUnit}` : ' · Yes/No'}
          </Typography>
        </Box>
        {isCount && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => onCountChange(habitEntry, -1)}
              disabled={currentValue <= 0}
              size="small"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'center' }}>
              {currentValue} / {habit.targetValue}
            </Typography>
            <IconButton
              onClick={() => onCountChange(habitEntry, 1)}
              disabled={currentValue >= habit.targetValue}
              size="small"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        )}
        <Chip
          label={
            isDone                          ? 'Done'
            : statusToday === 'in_progress' ? 'In Progress'
            : statusToday === 'missed'      ? 'Missed'
            : 'Pending'
          }
          color={
            isDone                          ? 'success'
            : statusToday === 'in_progress' ? 'warning'
            : statusToday === 'missed'      ? 'error'
            : 'default'
          }
          size="small"
          sx={{ mr: 1 }}
        />
        <IconButton onClick={() => onEdit(habitEntry)} size="small" sx={{ mr: 0.5 }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(habitEntry)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
    </Box>
  );
}


function HabitList({ habits, loading, onToggleBinary, onCountChange, onEdit, onDelete }) {
  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Habits</Typography>
      {loading ? (
        <CircularProgress size={24} />
      ) : habits.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No habits yet.</Typography>
      ) : (
        habits.map((habitEntry) => (
          <HabitRow
            key={habitEntry.habit._id}
            habitEntry={habitEntry}
            onToggleBinary={onToggleBinary}
            onCountChange={onCountChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </Paper>
  );
}

export default HabitList;
