exports.validateIncomingData = ({ name, age, date }) => {
  return (
    typeof name === 'string' &&
    typeof age === 'number' &&
    !!Date.parse(date)
  );
};
