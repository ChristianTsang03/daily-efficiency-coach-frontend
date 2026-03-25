import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, MenuItem, Select, TextField,
} from '@mui/material';

export function EditTaskDialog({
  open,
  onClose,
  onSave,
  title, setTitle,
  priority, setPriority,
  deadline, setDeadline,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}


export function EditHabitDialog({
  open,
  onClose,
  onSave,
  name, setName,
  schedule, setSchedule,
  timesPerWeek, setTimesPerWeek,
  targetType, setTargetType,
  targetValue, setTargetValue,
  targetUnit, setTargetUnit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">Edit Habit</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Habit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Schedule</InputLabel>
            <Select value={schedule} label="Schedule" onChange={(e) => setSchedule(e.target.value)}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
          {schedule === 'weekly' && (
            <TextField
              label="Times/week"
              type="number"
              value={timesPerWeek}
              onChange={(e) => setTimesPerWeek(Number(e.target.value))}
              slotProps={{ input: { inputProps: { min: 1, max: 7 } } }}
              fullWidth
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Target</InputLabel>
            <Select value={targetType} label="Target" onChange={(e) => setTargetType(e.target.value)}>
              <MenuItem value="binary">Yes / No</MenuItem>
              <MenuItem value="count">Count</MenuItem>
            </Select>
          </FormControl>
          {targetType === 'count' && (
            <TextField
              label="Amount"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              slotProps={{ input: { inputProps: { min: 1 } } }}
              fullWidth
            />
          )}
          {targetType === 'count' && (
            <TextField
              label="Unit (e.g. glasses)"
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
