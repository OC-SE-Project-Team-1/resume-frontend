import apiClient from "./services";

export default {
  getAllStories() {
    return apiClient.get("story");
  },
  getUserStories(accountId) {
    return apiClient.get("story/account/" + String(accountId));
  },
  getOneStory(storyId) {
    return apiClient.get("story/" + String(storyId));
  },
  createStory(numCharacters, characterName, characterRole, time, genre, location, language, length, accountId, characterName2,
              characterRole2, characterName3, characterRole3, characterName4, characterRole4, characterName5, characterRole5) {
    if (numCharacters == 2){
      return apiClient.post("story", {
        "genres": [
          String(genre)
      ],
      "characters": [
          { "name": String(characterName), "role": String(characterRole) },
          { "name": String(characterName2), "role": String(characterRole2) },
      ],
      "location": String(location),
      "timePeriod": String(time),
      "language": String(language),
      "length": String(length),
      "userId": parseInt(accountId)
    });
  } else if (numCharacters == 3){
      return apiClient.post("story", {
        "genres": [
          String(genre)
      ],
      "characters": [
          { "name": String(characterName), "role": String(characterRole) },
          { "name": String(characterName2), "role": String(characterRole2) },
          { "name": String(characterName3), "role": String(characterRole3) },
      ],
      "location": String(location),
      "timePeriod": String(time),
      "language": String(language),
      "length": String(length),
      "userId": parseInt(accountId)
    });
  } else if (numCharacters == 4){
      return apiClient.post("story", {
        "genres": [
          String(genre)
      ],
      "characters": [
          { "name": String(characterName), "role": String(characterRole) },
          { "name": String(characterName2), "role": String(characterRole2) },
          { "name": String(characterName3), "role": String(characterRole3) },
          { "name": String(characterName4), "role": String(characterRole4) },
      ],
      "location": String(location),
      "timePeriod": String(time),
      "language": String(language),
      "length": String(length),
      "userId": parseInt(accountId)
    });
  } else if (numCharacters == 5){
      return apiClient.post("story", {
        "genres": [
          String(genre)
      ],
      "characters": [
          { "name": String(characterName), "role": String(characterRole) },
          { "name": String(characterName2), "role": String(characterRole2) },
          { "name": String(characterName3), "role": String(characterRole3) },
          { "name": String(characterName4), "role": String(characterRole4) },
          { "name": String(characterName5), "role": String(characterRole5) },
      ],
      "location": String(location),
      "timePeriod": String(time),
      "language": String(language),
      "length": String(length),
      "userId": parseInt(accountId)
    });
  } else {    
    return apiClient.post("story", {
        "genres": [
          String(genre)
      ],
      "characters": [
          { "name": String(characterName), "role": String(characterRole) }
      ],
      "location": String(location),
      "timePeriod": String(time),
      "language": String(language),
      "length": String(length),
      "userId": parseInt(accountId)
    });
  } 
  },
  
  extendStory(storyId) {
    return apiClient.post("/story/update/" + String(storyId));
  },
  saveStory(accountID, title, content) {
    return apiClient.post("story/account/" + accountID,{
      "title" : String(title),
      "story" : String(content),
      "userId" : parseInt(accountID)
    });
  },
  updateStory(storyId, title, content, accountID) {
    return apiClient.put("story/" + storyId, {
      "title": String(title),
      "story": String(content),
      "userId" : parseInt(accountID)
    });
  },
  deleteStory(storyId, accountID) {
    return apiClient.delete("story/" + String(storyId), {
      data: {"userId": parseInt(accountID)}
  });
  },
};