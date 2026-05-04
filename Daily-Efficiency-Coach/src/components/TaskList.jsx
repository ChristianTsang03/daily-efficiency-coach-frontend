import {
  Box, Chip, CircularProgress, Divider, IconButton,
  Paper, Typography, Checkbox, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import UpdateIcon from '@mui/icons-material/Update';
import { priorityColor, formatDeadline, isOverdue, isToday } from './dashboardUtils';

function TaskRow({ task, onToggle, onEdit, onDelete, onSkip, onPostpone }) {
  const isSkipped    = task.status === 'skipped';
  const isPostponed  = task.status === 'postponed';
  const isDone       = task.status === 'done';
  const isInactive   = isDone || isSkipped;

  return (
    <Box key={task.id}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>

        <Checkbox
          checked={isDone}
          onChange={() => onToggle(task)}
          // Disable checkbox if task is skipped
          disabled={isSkipped}
          sx={{ color: '#1a1a2e', '&.Mui-checked': { color: '#1a1a2e' } }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: isInactive ? 'line-through' : 'none',
              color: isInactive ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>

          {/* Category label if present */}
          {task.category && (
            <Typography variant="caption" sx={{ color: '#1a1a2e', fontWeight: 'bold', mr: 1 }}>
              {task.category}
            </Typography>
          )}

          {task.dueAt && (
            <Typography
              variant="caption"
              //sx={{
                //color: isOverdue(task.dueAt, task.status)
                 //</Box> ? 'error.main'
                //  : isToday(task.dueAt)
                //</Box>  ? 'warning.main'
                //  : 'text.secondary',
             // }}
            >
              {isOverdue(task.dueAt, task.status)
                ? `Overdue · ${formatDeadline(task.dueAt)}`
                //: isToday(task.dueAt)
                //? `Due today · ${formatDeadline(task.dueAt)}`
                : `Due ${formatDeadline(task.dueAt)}`}
            </Typography>
          )}
        </Box>

        {/* Priority chip — shows status label if skipped/postponed/done */}
        <Chip
          label={
            isDone       ? 'Done'
            : isSkipped  ? 'Skipped'
            : isPostponed ? 'Postponed'
            : task.priority
          }
          color={
            isDone        ? 'success'
            : isSkipped   ? 'default'
            : isPostponed ? 'warning'
            : priorityColor[task.priority] || 'default'
          }
          size="small"
          sx={{ mr: 1, textTransform: 'capitalize' }}
        />

        {/* Skip button — only show for active todo/in_progress tasks */}
        {!isInactive && (
          <Tooltip title="Skip task">
            <IconButton onClick={() => onSkip(task)} size="small" sx={{ mr: 0.5 }}>
              <SkipNextIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Postpone button — only show for active todo/in_progress tasks */}
        {!isInactive && (
          <Tooltip title="Postpone by 1 day">
            <IconButton onClick={() => onPostpone(task)} size="small" sx={{ mr: 0.5 }}>
              <UpdateIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

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


function TaskList({ tasks, loading, onToggle, onEdit, onDelete, onSkip, onPostpone }) {
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
            onSkip={onSkip}
            onPostpone={onPostpone}
          />
        ))
      )}
    </Paper>
  );
}

export default TaskList;
