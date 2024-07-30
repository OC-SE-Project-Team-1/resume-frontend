import apiClient from "./services";

export default {
  getLinks() {
    return apiClient.get("link");
  },
  getLink(id) {
    return apiClient.get("link/" + id);
  },
  getLinksForUser(userID){
    return apiClient.get("link/user/" + userID);
  },
  addLink(link, linkDescription, accountID) {
    return apiClient.post("/link/", {
      "url": String(link),
      "type": String(linkDescription),
      "userId": accountID
    });
  },
  updateLink(linkId,type, link, accountID) {
    return apiClient.put("link/" + linkId, {
      "type" : String(type),
      "url": String(link),
      "userId": accountID
    });
  },
  deleteLink(linkId, accountID) {
    return apiClient.delete("link/" + linkId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};