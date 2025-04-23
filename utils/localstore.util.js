const localStoreUtil = {
  store_data: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },

  get_data: (key) => {
    const item = localStorage.getItem(key);

    if (!item) return;
    return JSON.parse(item);
  },

  get_MusicPurchased: (key) => {
    const music = JSON.parse(localStorage.getItem(key)).user?.musicPurchased;
    if (!music) return;
    return music;
  },

  set_MusicPurchased: (key, data) => {
    const item = JSON.parse(localStorage.getItem(key));
    item.user.musicPurchased.push(data);
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  },

  remove_data: (key) => {
    localStorage.removeItem(key);
    return true;
  },

  remove_all: () => {
    localStorage.clear();
    return true;
  },
};

export default localStoreUtil;
