import assert from "node:assert/strict";
import test from "node:test";

import { classifyProjectCandidate, classifyPictureBookFile } from "../scripts/discover-projects/discover.mjs";

test("classifies a Nuannuan PWA with local-only progress as a migration candidate", () => {
  const project = classifyProjectCandidate({
    localPath: "/workspace/pinyin-game",
    name: "字母变身局",
    packageJson: {
      name: "letter-transform-station",
      dependencies: {
        react: "^18.3.1",
        "vite-plugin-pwa": "^0.21.1"
      }
    },
    manifest: {
      name: "字母变身局",
      description: "帮助暖暖学习拼音和 English Mode 的儿童教育 PWA。"
    },
    readme: "暖暖专用，iPhone / iPad PWA，进度保存在 localStorage。",
    sourceText: "localStorage.setItem('letter-transform-station-progress-v1', JSON.stringify(progress)); indexedDB.open('letter-transform-station')"
  });

  assert.equal(project.type, "pwa");
  assert.equal(project.hasPWA, true);
  assert.equal(project.hasLocalStorage, true);
  assert.equal(project.hasIndexedDB, true);
  assert.equal(project.currentStorage, "localStorage + IndexedDB");
  assert.equal(project.status, "discovered");
  assert.equal(project.migrationDifficulty, "medium");
  assert.ok(project.confidence >= 80);
});

test("classifies PDF and image assets as picture book candidates", () => {
  const pdf = classifyPictureBookFile("/workspace/linnea_pet_shop_book/Linnea_Pet_Shop_Where_Is_Dodo.pdf");
  const image = classifyPictureBookFile("/workspace/books/page_01.png");
  const html = classifyPictureBookFile("/workspace/book/index.html");

  assert.equal(pdf.type, "picture_book");
  assert.equal(pdf.fileType, "pdf");
  assert.equal(pdf.status, "discovered");
  assert.equal(image.fileType, "image");
  assert.equal(html.fileType, "html");
});
