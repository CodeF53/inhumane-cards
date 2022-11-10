const pRand = seed=>(((seed * 15485863)**3) % 2038074743) / 2038074743
const pRandFromStr = str => pRand([...str].map(c=>c.charCodeAt(0)).reduce((a,b)=>a+b))

// TODO: make random rotation optional
// returns random rotation transform using the first 3 letters of a card
export const cardRotation = card => `rotate(${pRandFromStr(card.slice(0,3))*10-5}deg)`


export const fetchPatch  = url => fetch(url, { method:"PATCH" })
export const fetchPost   = url => fetch(url, { method:"POST" })
export const fetchDelete = url => fetch(url, { method:"DELETE" })

export const fetchPatch_data = (url, data) => fetch(url, { method:"PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
export const fetchPost_data  = (url, data) => fetch(url, { method:"POST",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })

export const rand = (a, b) => Math.random() * (b - a) + a
