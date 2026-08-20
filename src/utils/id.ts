export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const DEVICE_NAME_KEY = "spotmessage:deviceName";

const ADJECTIVES = ["Rapide", "Discret", "Curieux", "Solaire", "Errant", "Vif", "Nomade", "Serein"];
const ANIMALS = ["Renard", "Faucon", "Loutre", "Lynx", "Corbeau", "Heron", "Cerf", "Colibri"];

// The chosen name IS the identity (like OpenFront): no password, no email.
// Typing the same name on any device gives access to that name's messages.
export function getDeviceId(): string {
  return getDeviceName().trim().toLowerCase();
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
