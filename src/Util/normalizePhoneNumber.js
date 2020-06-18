const normalizePhoneNumber = phoneNumber => {
  let newPhoneNumber = (phoneNumber||"").replace(/\D/g,"");

  if(newPhoneNumber.length === 10) {
    newPhoneNumber = `+1${newPhoneNumber}`
  } else if(newPhoneNumber.length > 10) {
    newPhoneNumber = `+${newPhoneNumber}`
  } else {
    newPhoneNumber = null;
  }

  return newPhoneNumber

}
  
  export default normalizePhoneNumber;