export const fetchSets = () => {
  return fetch("http://0.0.0.0:8080/v0/sets").then((res) => res.json())
}

export const removeDocument = (id) => {
  const params = new URLSearchParams({ document_id: id })
  const url = `http://0.0.0.0:8080/v0/sets/docs?${params}`
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
}
