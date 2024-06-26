import apiClient from "./services";

export default {
  getUser(accountID) {
    return apiClient.get("account/" + accountID);
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
  updateUsername(accountID, username) {
    return apiClient.put("account/" + accountID, {
      "userName": String(username),
      "userId": parseInt(accountID)
    });
  },
  updateEmail(accountID, email) {
    return apiClient.put("account/" + accountID, {
      "email": String(email),
      "userId": parseInt(accountID)
    });
  },
  updateAccount(accountID, username, email) {
    return apiClient.put("account/" + accountID, {
      "userName": String(username),
      "email": String(email),
      "userId": parseInt(accountID)
    });
  },
};
