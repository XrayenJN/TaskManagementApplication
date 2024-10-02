export function isExpired(date){
  const givendate = new Date(date)
  const todayDate = new Date();
  if (todayDate > givendate){
    return true
  }
  return false
}

export const addTimeToDate = (dateString, isMeeting) => {
  return isMeeting ? dateString : `${dateString} 08:00`;
};

export const extractDate = (dateTimeString) => {
  if (typeof dateTimeString === 'string') {
    return dateTimeString.split(' ')[0];
  }
  return '';
};