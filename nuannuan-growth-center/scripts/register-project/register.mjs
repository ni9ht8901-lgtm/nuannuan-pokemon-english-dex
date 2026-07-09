import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function readProjectManifest(projectRoot) {
  const manifestPath = path.join(projectRoot, "nuannuan.project.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing nuannuan.project.json at ${projectRoot}`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function upsertProjectManifest(registryPath, manifest, localPath) {
  const current = existsSync(registryPath)
    ? JSON.parse(readFileSync(registryPath, "utf8"))
    : [];
  const nextEntry = {
    repository: manifest.repository ?? "",
    localPath,
    name: manifest.name,
    type: manifest.type,
    confidence: manifest.status === "pending_confirmation" ? 60 : 100,
    technology: manifest.type === "pwa" ? ["registered", "pwa"] : ["registered", "file"],
    deploymentUrl: manifest.url ?? "",
    currentStorage: manifest.type === "pwa" ? "SDK offline queue pending Supabase" : "local files",
    hasLocalStorage: manifest.type === "pwa",
    hasIndexedDB: manifest.type === "pwa",
    hasBackend: false,
    hasPWA: manifest.type === "pwa",
    migrationDifficulty: manifest.type === "pwa" ? "medium" : "low",
    status: manifest.status === "pending_confirmation" ? "pending_confirmation" : "discovered",
    projectId: manifest.projectId,
    version: manifest.version
  };
  const withoutExisting = current.filter((item) => item.projectId !== manifest.projectId && item.localPath !== localPath);
  const updated = [...withoutExisting, nextEntry].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  writeFileSync(registryPath, `${JSON.stringify(updated, null, 2)}\n`);
  return nextEntry;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const projectRoot = path.resolve(process.argv[2] ?? ".");
  const registryPath = path.resolve(process.argv[3] ?? "registry/discovered-projects.json");
  const manifest = readProjectManifest(projectRoot);
  const entry = upsertProjectManifest(registryPath, manifest, projectRoot);
  console.log(JSON.stringify(entry, null, 2));
}
