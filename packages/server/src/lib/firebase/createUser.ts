const createUser = async (admin, userData) => {
  //create the new user
  const defaultUserData = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
  }
  
  const result = await admin.firestore().collection("admin").doc("gameData").collection("userData").doc(userData.uid).set(defaultUserData)
  console.log("Account creation Results: ", result)

  return defaultUserData
}

export default createUser
