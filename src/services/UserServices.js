import apiClient from "./services";

export default {
  getUser(accountID) {
    return apiClient.get("account/" + accountID);
  },
  getUsers() {
    return apiClient.get("account/");
  },
  addUser(account) {
    return apiClient.post("account", account);
  },
  loginUser(account) {
    console.log(account);
    return apiClient.post("login", account.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(account.value.userName + ":" + account.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },

  updateAccount(accountID, username, email, firstName, lastName, address, phoneNumber) {
    return apiClient.put("account/" + accountID, {
      "userName": String(username),
      "email": String(email),
      "firstName": String(firstName),
      "lastName": String(lastName),
      "address": String(address),
      "phoneNumber": String(phoneNumber),
      "userId": parseInt(accountID)
    });
  },
  updateDarkMode(accountID, isDark) {
    return apiClient.put("account/" + accountID, {
      "darkMode": String(isDark),
      "userId": accountID
    });
  },

  updatePassword(accountID, password) {
    return apiClient.put("account/" + accountID, {
      "password": String(password),
      "userId": parseInt(accountID)
    });
  },

  updateAccountRole(accountID, userId, role) {
    return apiClient.put("account/" + userId, {
      "roleId": parseInt(role),
      "userId": parseInt(userId)
    });
  },
  deleteAccount(userId, accountID) {
    return apiClient.delete("account/" + userId, {
      data: {"userId": parseInt(accountID)}
    });
  },
};
