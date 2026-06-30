export const STORAGE_KEY = "quote-generator-data";

export function saveData(data: unknown) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
};

export function loadData() {

    const data = localStorage.getItem(
        STORAGE_KEY
    );

    if (!data) {
        return null;
    }

    return JSON.parse(data);
};
