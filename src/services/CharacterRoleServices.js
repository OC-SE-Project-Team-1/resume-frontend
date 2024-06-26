import apiClient from "./services";

export default {
  getCharacterRoles() {
    return apiClient.get("characterRoles");
  },
  getcharacterRole(id) {
    return apiClient.get("characterRoles/" + id);
  },
  getcharacterRoleForUser(userID){
    return apiClient.get("characterRoles/account/" + userID);
  },
  addcharacterRole(characterRoles, accountID) {
    return apiClient.post("characterRoles", {
      "name": String(characterRoles),
      "userId": accountID
    });
  },
  updatecharacterRole(characterRolesId, characterRoles, accountID) {
    return apiClient.put("characterRoles/" + characterRolesId, {
      "name": String(characterRoles),
      "userId": parseInt(accountID)
    });
  },
  deletecharacterRole(characterRoleId, accountID) {
    return apiClient.delete("characterRoles/" + characterRoleId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};