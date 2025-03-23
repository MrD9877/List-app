import { setAppSettings, store } from "./slice";

export async function setSettings() {
  const rawData = localStorage.getItem("appSettings");
  if (rawData) {
    const settings = await JSON.parse(rawData);
    store.dispatch(setAppSettings(settings));
  }
}
// export async function setSettings() {
//   store.dispatch(setAppSettings(defaultSettings));
// }
