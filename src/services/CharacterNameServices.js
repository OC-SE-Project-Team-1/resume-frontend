import apiClient from "./services";

export default {
  getCharacterNames() {
    return apiClient.get("characterName");
  },
  getcharacterName(id) {
    return apiClient.get("characterName/" + id);
  },
  getcharacterNameForUser(userID){
    return apiClient.get("characterName/account/" + userID);
  },
  addcharacterName(characterName, accountID) {
    return apiClient.post("characterName", {
        "name": String(characterName),
        "userId": accountID
    });
  },
  updatecharacterName(characterNameId, characterName, accountID) {
    return apiClient.put("characterName/" + characterNameId, {
      "name": String(characterName),
      "userId": accountID
  });
  },
  deletecharacterName(characterNameId, accountID) {
    return apiClient.delete("characterName/" + characterNameId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};