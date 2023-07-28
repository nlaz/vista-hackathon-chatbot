export const fetchSets = () => {
  return fetch("http://0.0.0.0:8080/v0/sets").then((res) => res.json())
}
