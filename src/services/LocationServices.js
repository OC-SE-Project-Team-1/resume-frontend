import apiClient from "./services";

export default {
  getLocations() {
    return apiClient.get("location");
  },
  getlocation(id) {
    return apiClient.get("location/" + id);
  },
  getlocationForUser(userID){
    return apiClient.get("location/account/" + userID);
  },
  addlocation(location, accountID) {
    return apiClient.post("location", {
      "location": String(location),
      "userId": accountID
    });
  },
  updatelocation(locationID, location, accountID) {
    return apiClient.put("location/" + locationID, {
      "location": String(location),
      "userId": accountID
    });
  },
  deletelocation(locationId, accountID) {
    return apiClient.delete("location/" + locationId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};