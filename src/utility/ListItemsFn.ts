"use client";
import LocalDb from "@/lib/LocalDb";
import { addItems, deleteItem, markAsRead, setItems, setLoading, store } from "./slice";
import { Item } from "@/components/List";
// import { version } from "@/*";

export function getDb() {
  const vals = { storeName: "Items", key: "keyEntry", dbName: "ListApp", version: 1 };
  const localDb = new LocalDb([{ store: vals.storeName, keyPath: vals.key }], vals.dbName, vals.version);
  return { db: localDb, ...vals };
}

export async function setList() {
  const { db, storeName } = getDb();
  for (let i = 0; i < 2; i++) {
    const findData = await db.findAll(storeName);
    if (findData.success) {
      const data = findData.data as Item[];
      store.dispatch(setItems(data));
      i = 2;
    }
  }
  store.dispatch(setLoading(false));
}

export async function moveItemInList(data: Item[]) {
  const { db, storeName } = getDb();
  store.dispatch(setItems(data));
  const deleteDb = await db.deleteAll(storeName);
  if (deleteDb.success) {
    await getDb().db.putMany({ store: storeName, data });
  }
}

export async function addItemToList(item: Item) {
  const { db, storeName } = getDb();
  const putinDb = await db.putOne({ data: item, store: storeName });
  if (putinDb.success) {
    store.dispatch(addItems(item));
  }
}
export async function deleteItemFromList(key: number) {
  const { db, storeName } = getDb();
  const putinDb = await db.deleteOne({ key, store: storeName });
  if (putinDb.success) {
    store.dispatch(deleteItem(key));
  }
}
export async function markItem(data: Item) {
  const { db, storeName } = getDb();
  const newItem = { ...data };
  newItem.read = !newItem.read;
  const putinDb = await db.putOne({ data: newItem, store: storeName });
  if (putinDb.success) {
    store.dispatch(markAsRead(data.keyEntry));
  }
}
