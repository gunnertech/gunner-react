//TODO: gunner-react

const withoutBlanks = obj =>
  Object.entries(obj).reduce((currentValue, [key, value]) => ({
    ...currentValue,
    ...(
      value === '' || value === null ? {} : {[key]: value}
    )
  }), {})


export default withoutBlanks;