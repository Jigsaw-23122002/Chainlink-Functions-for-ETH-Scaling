const { Web3Storage, getFilesFromPath } = require("web3.storage");

async function main() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRiMDFCZWY1MUQ1RGRmNjk0RTE0MzA4NzU3NTFhZUMyNDQ3RDU3RDkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Nzk2NjAxODU0NjQsIm5hbWUiOiJTb2ZUb2tlbiJ9.f0QRzC8vzbvh-1heNy-KLm2CEyP2YSuaO-o-bF_bJbM";

  if (!token) {
    return console.error(
      "A token is needed. You can create one on https://web3.storage"
    );
  }

  const storage = new Web3Storage({ token });
  const files = [];
  const pathFiles = await getFilesFromPath("./jsons");
  files.push(...pathFiles);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  console.log("Content added with CID:", cid);
}

main();
