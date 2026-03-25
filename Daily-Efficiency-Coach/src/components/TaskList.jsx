import {
  Box, Chip, CircularProgress, Divider, IconButton,
  Paper, Typography, Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { priorityColor, formatDeadline, isOverdue, isToday, sortByPriority } from './dashboardUtils';

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  return (
    <Box key={task.id}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
        <Checkbox
          checked={task.status === 'done'}
          onChange={() => onToggle(task)}
          sx={{ color: '#1a1a2e', '&.Mui-checked': { color: '#1a1a2e' } }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              color: task.status === 'done' ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
          {task.dueAt && (
            <Typography
              variant="caption"
              sx={{
                color: isOverdue(task.dueAt, task.status)
                  ? 'error.main'
                  : isToday(task.dueAt)
                  ? 'warning.main'
                  : 'text.secondary',
              }}
            >
              {isOverdue(task.dueAt, task.status)
                ? `Overdue · ${formatDeadline(task.dueAt)}`
                : isToday(task.dueAt)
                ? `Due today · ${formatDeadline(task.dueAt)}`
                : `Due ${formatDeadline(task.dueAt)}`}
            </Typography>
          )}
        </Box>
        <Chip
          label={task.priority}
          color={priorityColor[task.priority] || 'default'}
          size="small"
          sx={{ mr: 1, textTransform: 'capitalize' }}
        />
        <IconButton onClick={() => onEdit(task)} size="small" sx={{ mr: 0.5 }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(task)} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
    </Box>
  );
}


function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Tasks</Typography>
      {loading ? (
        <CircularProgress size={24} />
      ) : tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No tasks yet.</Typography>
      ) : (
        tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </Paper>
  );
}

export default TaskList;
