import moment from 'moment';

// Accepts the lookahead range, list of tasks and returns all tasks within that date range
export function filterLookAheadDate(numDays, taskList){
    const startRangeDate = moment()
    const endRangeDate = moment().add(numDays, 'days');
    const filteredTaskDates = taskList.filter(task => (task.startDate && task.endDate && 
         (moment(task.endDate).isSameOrAfter(startRangeDate, 'day') && moment(task.endDate).isSameOrBefore(endRangeDate, 'day'))));
    return filteredTaskDates
}