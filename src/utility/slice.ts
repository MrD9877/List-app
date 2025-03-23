import {} from "@/app/settings/page";
import { Item } from "@/components/List";
import { createSlice, configureStore } from "@reduxjs/toolkit";

type SettingGroupType = {
  [key: string]: string;
  inputsType: "radio" | "checkbox";
};

export const Setting_GROUPS = {
  NETWORK_MODE_GROUP: "Network Settings",
  NOTIFICATION_GROUP: "Notification Settings",
};
export const NETWORK_MODE_GROUP: SettingGroupType = {
  ONLINE_MODE: "Online mode",
  SEMI_OFFLINE: "Semi-offline",
  OFFLINE_MODE: "Offline Mode",
  inputsType: "radio",
};
export const NOTIFICATION_GROUP: SettingGroupType = {
  ALLOW_NOTIFICATIONS: "notication permission",
  Save_NOTIFICATIONS: "save notification",
  inputsType: "checkbox",
};

export type Setting = {
  groupName: string;
  settingsName: string[];
  inputsType: "radio" | "checkbox";
};

export const defaultSettings: AppSettingsType = {
  [Setting_GROUPS.NETWORK_MODE_GROUP]: {
    [NETWORK_MODE_GROUP.ONLINE_MODE]: true,
  },
  [Setting_GROUPS.NOTIFICATION_GROUP]: {
    [NOTIFICATION_GROUP.ALLOW_NOTIFICATIONS]: false,
    [NOTIFICATION_GROUP.Save_NOTIFICATIONS]: false,
  },
};

export type AppSettingsType = {
  [key: string]: {
    [key: string]: boolean;
  };
};
// setFilesUrls,
export type StoreState = {
  isOnline: boolean | undefined | "checking";
  listItems: Item[];
  loading: boolean;
  appSettings: AppSettingsType;
};

const initialState: StoreState = {
  isOnline: undefined,
  listItems: [],
  loading: false,
  appSettings: defaultSettings,
};

const userSlice = createSlice({
  name: "pwa",
  initialState,
  reducers: {
    setOnline: (state, action: { type: string; payload: "checking" | boolean }) => {
      state.isOnline = action.payload;
    },
    setItems: (state, action: { type: string; payload: Item[] }) => {
      state.listItems = action.payload;
    },
    addItems: (state, action: { type: string; payload: Item }) => {
      state.listItems.push(action.payload);
    },
    deleteItem: (state, action: { type: string; payload: number }) => {
      state.listItems = state.listItems.filter((item) => item.keyEntry !== action.payload);
    },
    setLoading: (state, action: { type: string; payload: boolean }) => {
      state.loading = action.payload;
    },
    markAsRead: (state, action: { type: string; payload: number }) => {
      state.listItems = state.listItems.map((item) => {
        if (item.keyEntry === action.payload) {
          const temp = { ...item };
          temp.read = !temp.read;
          return temp;
        } else return item;
      });
    },
    upDateAppSettings: (state, action: { type: string; payload: { group: ALLGroups; id: AllSettings; value: boolean } }) => {
      let selctedGroup = state.appSettings[action.payload.group];
      selctedGroup = { ...selctedGroup, [action.payload.id]: action.payload.value };
      state.appSettings = { ...state.appSettings, ...selctedGroup };
    },
    setAppSettings: (state, action: { type: string; payload: AppSettingsType }) => {
      state.appSettings = action.payload;
    },
  },
});

export const { setOnline, setItems, addItems, deleteItem, setLoading, markAsRead, upDateAppSettings, setAppSettings } = userSlice.actions;

export const store = configureStore({
  reducer: userSlice.reducer,
});
