import apiClient from "./services";

export default {
  getGenres() {
    return apiClient.get("genre");
  },
  getgenre(id) {
    return apiClient.get("genre/" + id);
  },
  getgenreForUser(userID){
    return apiClient.get("genre/account/" + userID);
  },
  addgenre(genres, accountID) {
    return apiClient.post("genre", {
      "name": String(genres),
      "userId": accountID
    });
  },
  updategenre(genresId, genres, accountID) {
    return apiClient.put("genre/" + genresId, {
      "name": String(genres),
      "userId": accountID
   });
  },
  deletegenre(genresId, accountID) {
    return apiClient.delete("genre/" + genresId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};