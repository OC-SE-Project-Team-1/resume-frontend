import apiClient from "./services";

export default {
  getLanguages() {
    return apiClient.get("language");
  },
  getlanguage(id) {
    return apiClient.get("language/" + id);
  },
  addlanguage(language) {
    return apiClient.post("language", language);
  },
  updatelanguage(language) {
    return apiClient.put("language/" + language.id, language);
  },
  deletelanguage(languageId) {
    return apiClient.delete("language/" + languageId);
  },
};