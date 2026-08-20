export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const DEVICE_ID_KEY = "spotmessage:deviceId";
const DEVICE_NAME_KEY = "spotmessage:deviceName";

const ADJECTIVES = ["Rapide", "Discret", "Curieux", "Solaire", "Errant", "Vif", "Nomade", "Serein"];
const ANIMALS = ["Renard", "Faucon", "Loutre", "Lynx", "Corbeau", "Heron", "Cerf", "Colibri"];

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceName(): string {
  let name = localStorage.getItem(DEVICE_NAME_KEY);
  if (!name) {
    const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const b = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    name = `${a} ${b}`;
    localStorage.setItem(DEVICE_NAME_KEY, name);
  }
  return name;
}

export function setDeviceName(name: string): void {
  localStorage.setItem(DEVICE_NAME_KEY, name);
}
