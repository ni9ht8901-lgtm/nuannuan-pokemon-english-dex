import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROJECT_MARKERS = ["package.json", "manifest.webmanifest", "manifest.json", "index.html"];
const SKIP_DIRS = new Set([
  ".git",
  ".worktrees",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".vercel",
  "coverage"
]);
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".css"]);
const PICTURE_EXTENSIONS = new Set([".pdf", ".png", ".jpg", ".jpeg", ".webp", ".html", ".epub"]);

export function classifyProjectCandidate(candidate) {
  const manifest = candidate.manifest ?? {};
  const packageJson = candidate.packageJson ?? {};
  const projectManifest = candidate.projectManifest ?? {};
  const combinedText = [
    candidate.name,
    packageJson.name,
    packageJson.description,
    manifest.name,
    manifest.short_name,
    manifest.description,
    candidate.readme,
    candidate.sourceText
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();

  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {})
  };
  const dependencyNames = Object.keys(dependencies);
  const technology = dependencyNames.filter((name) =>
    ["react", "next", "vite", "vite-plugin-pwa", "@vitejs/plugin-react", "typescript", "tailwindcss"].includes(name)
  );
  const hasPWA = Boolean(manifest.name || dependencies["vite-plugin-pwa"] || combinedText.includes("pwa"));
  const hasLocalStorage = combinedText.includes("localstorage");
  const hasIndexedDB = combinedText.includes("indexeddb");
  const hasBackend = /supabase|firebase|postgres|mysql|server role|api\/sync/.test(combinedText);
  const hasGrowthSdk = /growthclient|@nuannuan\/growth-sdk|nuannuan-growth-sdk|legacy_data_migrated/.test(combinedText);
  const isNuannuan = /暖暖|nuannuan/.test(combinedText);
  const isChildLearning = /儿童|孩子|拼音|英语|自然拼读|学习|绘本|打卡|习惯|积分|成就|宝可梦|小程序|iphone|ipad/.test(combinedText);

  let confidence = 0;
  if (isNuannuan) confidence += 36;
  if (isChildLearning) confidence += 24;
  if (hasPWA) confidence += 20;
  if (hasLocalStorage || hasIndexedDB) confidence += 14;
  if (technology.length > 0) confidence += 8;
  if (candidate.localPath?.includes("letter-transform") || candidate.localPath?.includes("linnea")) confidence += 8;
  confidence = Math.min(100, confidence);

  const currentStorageParts = [
    hasLocalStorage ? "localStorage" : "",
    hasIndexedDB ? "IndexedDB" : "",
    hasGrowthSdk ? "SDK offline queue" : "",
    hasBackend ? "backend" : ""
  ].filter(Boolean);
  const currentStorage = currentStorageParts.join(" + ") || "unknown";

  const type = hasPWA ? "pwa" : technology.length > 0 ? "web_app" : "unknown";
  const migrationDifficulty = hasBackend ? "high" : hasLocalStorage || hasIndexedDB ? "medium" : "low";

  return {
    repository: candidate.repository ?? "",
    localPath: candidate.localPath,
    projectId: projectManifest.projectId ?? "",
    version: projectManifest.version ?? packageJson.version ?? "",
    name: projectManifest.name ?? manifest.name ?? packageJson.name ?? candidate.name ?? path.basename(candidate.localPath ?? ""),
    type,
    confidence,
    technology,
    deploymentUrl: candidate.deploymentUrl ?? "",
    currentStorage,
    hasLocalStorage,
    hasIndexedDB,
    hasBackend,
    hasPWA,
    hasGrowthSdk,
    migrationDifficulty,
    status: confidence >= 55 ? "discovered" : "pending_confirmation",
    notes: candidate.notes ?? []
  };
}

export function classifyPictureBookFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const fileType = extension === ".pdf" ? "pdf"
    : extension === ".html" ? "html"
      : extension === ".epub" ? "epub"
        : "image";
  const baseName = path.basename(filePath, extension);
  const parent = path.basename(path.dirname(filePath));
  const likelyBook = /book|绘本|linnea|page|cover|story/i.test(`${filePath} ${baseName} ${parent}`);

  return {
    id: slugify(`${parent}-${baseName}`),
    name: titleFromFile(baseName, parent),
    type: "picture_book",
    fileType,
    localPath: filePath,
    cover: fileType === "image" ? filePath : "",
    pageCount: fileType === "image" ? 1 : null,
    confidence: likelyBook ? 80 : 42,
    status: likelyBook ? "discovered" : "pending_confirmation",
    notes: likelyBook ? [] : ["需要人工确认是否属于暖暖绘本"]
  };
}

export function discoverWorkspace(options) {
  const workspaceRoot = path.resolve(options.workspaceRoot);
  const outputRoot = path.resolve(options.outputRoot ?? path.join(workspaceRoot, "nuannuan-growth-center"));
  const projectRoots = findProjectRoots(workspaceRoot, outputRoot);
  const projects = projectRoots.map((projectRoot) => classifyProjectAt(projectRoot, outputRoot));
  const pictureBooks = findPictureBookFiles(workspaceRoot, outputRoot).map(classifyPictureBookFile);
  const pictureBookProjects = groupPictureBooks(pictureBooks);
  const allProjects = dedupeProjects([...projects, ...pictureBookProjects]);
  const usedProjectIds = new Set();
  const migrationStatus = allProjects.map((project) => ({
    projectId: uniqueSlug(slugify(project.name), usedProjectIds),
    name: project.name,
    status: project.type === "picture_book" ? "archive_indexed" : "discovered",
    steps: {
      discovered: true,
      analyzed: project.type !== "unknown",
      backedUp: false,
      integrated: false,
      deployed: false
    },
    blockers: project.type === "pwa" ? ["Supabase credentials are required for full cloud sync."] : []
  }));

  mkdirSync(path.join(outputRoot, "registry"), { recursive: true });
  writeJson(path.join(outputRoot, "registry/discovered-projects.json"), allProjects);
  writeJson(path.join(outputRoot, "registry/picture-books.json"), pictureBooks);
  writeJson(path.join(outputRoot, "registry/migration-status.json"), migrationStatus);

  return {
    projects: allProjects,
    pictureBooks,
    migrationStatus
  };
}

function classifyProjectAt(projectRoot, outputRoot) {
  const packageJson = readJsonIfExists(path.join(projectRoot, "package.json"));
  const manifest = readJsonIfExists(path.join(projectRoot, "public/manifest.webmanifest"))
    ?? readJsonIfExists(path.join(projectRoot, "manifest.webmanifest"))
    ?? readJsonIfExists(path.join(projectRoot, "public/manifest.json"))
    ?? readJsonIfExists(path.join(projectRoot, "manifest.json"));
  const readme = readTextIfExists(path.join(projectRoot, "README.md"));
  const projectManifest = readJsonIfExists(path.join(projectRoot, "nuannuan.project.json"));
  const sourceText = [
    readTextIfExists(path.join(projectRoot, "src/lib/growthClient.ts")),
    collectSourceSignals(projectRoot, outputRoot)
  ].join("\n");
  const candidate = classifyProjectCandidate({
    localPath: projectRoot,
    name: packageJson?.name ?? path.basename(projectRoot),
    packageJson,
    projectManifest,
    manifest,
    readme,
    sourceText
  });

  if (projectRoot === process.cwd() && readme.includes("宝可梦") && manifest?.name === "字母变身局") {
    candidate.notes.push("README 与 manifest 指向不同项目，迁移前需要人工确认当前根目录归属。");
  }

  return candidate;
}

function findProjectRoots(workspaceRoot, outputRoot) {
  const roots = new Set();

  walk(workspaceRoot, (itemPath, stats) => {
    if (!stats.isDirectory()) return;
    if (itemPath === outputRoot || isInside(itemPath, outputRoot)) return "skip";
    if (SKIP_DIRS.has(path.basename(itemPath))) return "skip";
    if (PROJECT_MARKERS.some((marker) => existsSync(path.join(itemPath, marker)))) {
      if (existsSync(path.join(itemPath, "package.json")) || existsSync(path.join(itemPath, "public/manifest.webmanifest"))) {
        roots.add(itemPath);
      }
    }
    return undefined;
  });

  return Array.from(roots).sort();
}

function findPictureBookFiles(workspaceRoot, outputRoot) {
  const files = [];

  walk(workspaceRoot, (itemPath, stats) => {
    const baseName = path.basename(itemPath);
    if (stats.isDirectory()) {
      if (isInside(itemPath, outputRoot) && itemPath !== outputRoot) return "skip";
      if (SKIP_DIRS.has(baseName) || itemPath.includes(`${path.sep}public${path.sep}pokemon`)) return "skip";
      if (itemPath.includes(`${path.sep}codex_requirements${path.sep}`)) return "skip";
      return undefined;
    }

    const extension = path.extname(itemPath).toLowerCase();
    if (!PICTURE_EXTENSIONS.has(extension)) return undefined;
    const pathText = itemPath.toLowerCase();
    if (!/book|绘本|linnea|page_|cover|story/.test(pathText) && extension !== ".pdf") return undefined;
    files.push(itemPath);
    return undefined;
  });

  return files.sort();
}

function groupPictureBooks(pictureBooks) {
  const groups = new Map();
  for (const book of pictureBooks) {
    const dir = getPictureBookGroupDir(book.localPath);
    const group = groups.get(dir) ?? [];
    group.push(book);
    groups.set(dir, group);
  }

  return Array.from(groups.entries()).map(([dir, items]) => {
    const first = items.find((item) => item.fileType === "pdf") ?? items[0];
    return {
      repository: "",
      localPath: dir,
      name: titleFromFile(path.basename(dir), path.basename(path.dirname(dir))),
      type: "picture_book",
      confidence: Math.max(...items.map((item) => item.confidence)),
      technology: ["file"],
      deploymentUrl: "",
      currentStorage: "local files",
      hasLocalStorage: false,
      hasIndexedDB: false,
      hasBackend: false,
      hasPWA: false,
      migrationDifficulty: "low",
      status: first.status,
      cover: items.find((item) => /cover/i.test(item.localPath))?.localPath ?? "",
      sourceFiles: items.map((item) => item.localPath)
    };
  });
}

function dedupeProjects(projects) {
  const seen = new Set();
  return projects.filter((project) => {
    const key = `${project.type}:${project.localPath}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectSourceSignals(projectRoot, outputRoot) {
  const chunks = [];
  walk(projectRoot, (itemPath, stats) => {
    if (stats.isDirectory()) {
      if (SKIP_DIRS.has(path.basename(itemPath))) return "skip";
      if (itemPath === outputRoot || isInside(itemPath, outputRoot)) return "skip";
      if (itemPath.includes(`${path.sep}codex_requirements${path.sep}`)) return "skip";
      return undefined;
    }
    if (chunks.join("\n").length > 50000) return undefined;
    if (!TEXT_EXTENSIONS.has(path.extname(itemPath).toLowerCase())) return undefined;
    const relative = path.relative(projectRoot, itemPath);
    if (!/src|public|README|package|manifest|index/.test(relative)) return undefined;
    chunks.push(readTextIfExists(itemPath).slice(0, 12000));
    return undefined;
  });
  return chunks.join("\n");
}

function walk(root, visitor) {
  if (!existsSync(root)) return;
  const stats = statSync(root);
  const decision = visitor(root, stats);
  if (decision === "skip" || !stats.isDirectory()) return;

  for (const child of readdirSync(root)) {
    walk(path.join(root, child), visitor);
  }
}

function readJsonIfExists(filePath) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function readTextIfExists(filePath) {
  try {
    return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
  } catch {
    return "";
  }
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function titleFromFile(baseName, parentName) {
  const cleaned = baseName
    .replace(/[_-]+/g, " ")
    .replace(/\bpage\s*\d+\b/i, "")
    .trim();
  const fallback = parentName.replace(/[_-]+/g, " ");
  return cleaned || fallback;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueSlug(baseSlug, used) {
  const fallback = baseSlug || "project";
  let candidate = fallback;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${fallback}-${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function getPictureBookGroupDir(filePath) {
  const dir = path.dirname(filePath);
  const folder = path.basename(dir).toLowerCase();
  if (["assets", "rendered_pages", "pages", "images", "img"].includes(folder)) {
    return path.dirname(dir);
  }
  return dir;
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? fileURLToPath(pathToFileURL(process.argv[1])) : "";

if (currentFile === invokedFile) {
  const workspaceFlag = process.argv.indexOf("--workspace");
  const outputFlag = process.argv.indexOf("--output");
  const workspaceRoot = workspaceFlag >= 0 ? process.argv[workspaceFlag + 1] : process.cwd();
  const outputRoot = outputFlag >= 0 ? process.argv[outputFlag + 1] : path.join(workspaceRoot, "nuannuan-growth-center");
  const result = discoverWorkspace({ workspaceRoot, outputRoot });
  console.log(JSON.stringify({
    projects: result.projects.length,
    pictureBooks: result.pictureBooks.length,
    outputRoot: path.resolve(outputRoot)
  }, null, 2));
}
