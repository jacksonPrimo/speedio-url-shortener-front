import { defineStore } from "pinia";
interface IUrl {
  id: string;
  originalUrl: string;
  userId?: string;
  views: number;
}
export const UrlStore = defineStore("urls", {
  state: () => ({
    urls: localStorage.getItem("urls")
      ? JSON.parse(localStorage.getItem("urls") as string)
      : [],
  }),
  getters: {
    getUrls: (state) => state.urls,
  },
  actions: {
    reset() {
      this.urls = localStorage.getItem("urls")
        ? JSON.parse(localStorage.getItem("urls") as string)
        : [];
    },
    add(url: Array<IUrl> | IUrl, setLocalStorage: boolean) {
      if (url instanceof Array) {
        const urls = localStorage.getItem("urls")
          ? JSON.parse(localStorage.getItem("urls") as string)
          : [];
        urls.push(url);
        this.urls = url;
      } else {
        this.urls.push(url);
      }
      if (setLocalStorage) {
        localStorage.setItem("urls", JSON.stringify(this.urls));
      }
    },
    remove(index: number, setLocalStorage: boolean) {
      this.urls.splice(index, 1);
      if (setLocalStorage) {
        localStorage.setItem("urls", JSON.stringify(this.urls));
      }
    },
  },
});
