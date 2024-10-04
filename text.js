const getTime = (secs) => {
  const secInHour = 3600;
  const secInMin = 60;
  let seconds;
  //   get hour
  const hour = Math.floor(secs / secInHour);
  secs %= secInHour;

  //   get min
  const min = Math.floor(secs / secInMin);
  secs %= secInMin;

  return `${hour}h ${min}min ${secs}sec ago`;
};
getTime(24330);
getTime(342342);
