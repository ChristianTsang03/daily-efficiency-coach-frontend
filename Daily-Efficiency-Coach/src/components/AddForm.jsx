import {
  Box, Button, Paper, TextField, Typography, Alert,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddForm({
  // Shared
  newTitle, setNewTitle,
  newType, setNewType,
  feedback,
  onAdd,
  // Task fields
  newPriority, setNewPriority,
  newDeadline, setNewDeadline,
  newCategory, setNewCategory,
  // Habit fields
  habitScheduleType, setHabitScheduleType,
  habitTimesPerWeek, setHabitTimesPerWeek,
  habitTargetType, setHabitTargetType,
  habitTargetValue, setHabitTargetValue,
  habitTargetUnit, setHabitTargetUnit,
}) {
  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Add New</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* 1. Title — always first */}
        <TextField
          label={newType === 'task' ? 'Title' : 'Habit Name'}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          sx={{ flex: 2, minWidth: 200 }}
        />

        
        {/* Type switcher */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select value={newType} label="Type" onChange={(e) => setNewType(e.target.value)}>
            <MenuItem value="task">Task</MenuItem>
            <MenuItem value="habit">Habit</MenuItem>
          </Select>
        </FormControl>

        {/* 2. Category — second for tasks */}
        {newType === 'task' && (
          <FormControl sx={{ minWidth: 130 }}>
            <InputLabel>Category</InputLabel>
            <Select value={newCategory} label="Category" onChange={(e) => setNewCategory(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Task: deadline */}
        {newType === 'task' && (
          <TextField
            label="Deadline"
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
        )}

        {/* Task: priority */}
        {newType === 'task' && (
          <FormControl sx={{ minWidth: 130 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={newPriority} label="Priority" onChange={(e) => setNewPriority(e.target.value)}>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Habit: schedule */}
        {newType === 'habit' && (
          <FormControl sx={{ minWidth: 130 }}>
            <InputLabel>Schedule</InputLabel>
            <Select value={habitScheduleType} label="Schedule" onChange={(e) => setHabitScheduleType(e.target.value)}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Habit: times per week */}
        {newType === 'habit' && habitScheduleType === 'weekly' && (
          <TextField
            label="Times/week"
            type="number"
            value={habitTimesPerWeek}
            onChange={(e) => setHabitTimesPerWeek(Number(e.target.value))}
            slotProps={{ input: { inputProps: { min: 1, max: 7 } } }}
            sx={{ minWidth: 120 }}
          />
        )}

        {/* Habit: target type */}
        {newType === 'habit' && (
          <FormControl sx={{ minWidth: 130 }}>
            <InputLabel>Target</InputLabel>
            <Select value={habitTargetType} label="Target" onChange={(e) => setHabitTargetType(e.target.value)}>
              <MenuItem value="binary">Yes / No</MenuItem>
              <MenuItem value="count">Count</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Habit: count amount */}
        {newType === 'habit' && habitTargetType === 'count' && (
          <TextField
            label="Amount"
            type="number"
            value={habitTargetValue}
            onChange={(e) => setHabitTargetValue(Number(e.target.value))}
            slotProps={{ input: { inputProps: { min: 1 } } }}
            sx={{ minWidth: 100 }}
          />
        )}

        {/* Habit: unit label */}
        {newType === 'habit' && habitTargetType === 'count' && (
          <TextField
            label="Unit (e.g. glasses)"
            value={habitTargetUnit}
            onChange={(e) => setHabitTargetUnit(e.target.value)}
            sx={{ minWidth: 150 }}
          />
        )}

        <Button variant="contained" onClick={onAdd} startIcon={<AddIcon />}>Add</Button>
      </Box>
      {feedback && <Alert severity="error" sx={{ mt: 2 }}>{feedback}</Alert>}
    </Paper>
  );
}

export default AddForm;
