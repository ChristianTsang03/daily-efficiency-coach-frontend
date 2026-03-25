export const priorityColor = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

// Priority sort order: high first, then medium, then low
export const priorityOrder = { high: 0, medium: 1, low: 2 };

// YYYY-MM-DD string for today, used for habit logging and deadline comparisons
export const today = new Date().toISOString().split('T')[0];


/*
 Maps the /today habit response into component state shape.
 Reads loggedValue returned by the backend so count habits
 persist their progress across page reloads.
 */
export const mapHabits = (habitList) =>
  habitList.map((h) => ({
    ...h,
    currentValue: h.loggedValue ?? 0,
  }));

/*
 Sorts tasks by priority: high → medium → low.
 Done tasks are pushed to the bottom regardless of priority.
 */
export const sortByPriority = (taskList) =>
  [...taskList].sort((a, b) => { //creates copy before sorting, so original data isnt changed
    
    //If either task is done but the other one isn't, the done one is placed last regardless of priority
    if (a.status === 'done' && b.status !== 'done') return 1; //a goes after b
    if (b.status === 'done' && a.status !== 'done') return -1; //b goes after a
    // Sort by priority order within each group
    const pa = priorityOrder[a.priority] ?? 3; 
    const pb = priorityOrder[b.priority] ?? 3;
    return pa - pb; //Subtract priorities to sort in ascending order
                    //Ex: pa = 0, pb = 2 -> 0-2
                    //a comes first = High priority  before low priority
  });

/*
  Extracts the YYYY-MM-DD portion from a full datetime string.
  dueAt is stored as a datetime on the backend.
 */
export const getDueDateStr = (dueAt) => {
  if (!dueAt) return null;
  return new Date(dueAt).toISOString().split('T')[0];
};

/*
 Formats a datetime string into a readable label like "Mar 11, 2026".
 */
export const formatDeadline = (dueAt) => {
  if (!dueAt) return null;
  return new Date(dueAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isToday = (dueAt) => getDueDateStr(dueAt) === today;

export const isOverdue = (dueAt, status) => {
  if (!dueAt || status === 'done') return false;
  return getDueDateStr(dueAt) < today;
};

/*
 Converts the backend schedule type into a human-readable label.
 Backend valid values: 'daily' | 'weekdays' | 'weekly_x' | 'custom'
 */
export const scheduleLabel = (schedule) => {
  if (!schedule) return '';
  switch (schedule.type) {
    case 'daily':    return 'Daily';
    case 'weekdays': return 'Weekdays';
    case 'weekly_x': return `${schedule.timesPerWeek}x / week`;
    case 'custom':   return 'Custom';
    default:         return schedule.type;
  }
};
