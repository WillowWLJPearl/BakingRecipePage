
let datamap = {}

function readData() {
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

for (const p of searchParams) {
  datamap[p[0]] = p[1];
}
console.log(datamap);
if (datamap.text != undefined) downloadJson(datamap.text, datamap);
}

readData();

function downloadJson(filename, obj) {
  const json = JSON.stringify(obj, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

async function loadJsonFolder({ owner, repo, folder, ref = "main" }) {
  // 1) list directory
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${encodeURIComponent(ref)}`;
  const listRes = await fetch(listUrl);
  if (!listRes.ok) throw new Error(`List failed: ${listRes.status} ${await listRes.text()}`);
  const items = await listRes.json();

  // 2) pick only .json files
  const jsonFiles = items.filter(x => x.type === "file" && x.name.toLowerCase().endsWith(".json"));

  // 3) fetch + parse each file (download_url points to raw content)
  const results = await Promise.all(
    jsonFiles.map(async (f) => {
      const res = await fetch(f.download_url);
      if (!res.ok) throw new Error(`Fetch failed for ${f.path}: ${res.status}`);
      const text = await res.text();
      return [f.name, JSON.parse(text)];
    })
  );

  // return as an object: { "file.json": parsedObject, ... }
  return Object.fromEntries(results);
}

// usage:
loadJsonFolder({ owner: "WillowWLJPearl", repo: "BakingRecipePage", folder: "json", ref: "main" })
  .then(data => console.log("Loaded JSONs:", data))
  .catch(console.error);
