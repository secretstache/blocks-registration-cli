import fs from 'fs/promises';
import path from 'path';
import { getBlockJsPath, getBlockPhpPath, getBlockViewPath, getEditorJsPath } from '../config/defaults.js';
import { confirmOverwrite } from '../cli/prompt.js';
import { generateBlockJson } from '../templates/block-json.js';
import { generateIndexJs } from '../templates/index-js.js';
import { generateEditJs } from '../templates/edit-js.js';
import { generateSaveJs } from '../templates/save-js.js';
import { generatePhpClass } from '../templates/php-class.js';
import { generateBladeTemplate } from '../templates/blade.js';
import { generateChildBlockJson } from '../templates/child-block/block-json.js';
import { generateChildIndexJs } from '../templates/child-block/index-js.js';
import { generateChildEditJs } from '../templates/child-block/edit-js.js';
import { generateChildSaveJs } from '../templates/child-block/save-js.js';

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
}

export async function writeFile(filePath, content) {
  try {
    const exists = await fileExists(filePath);
    
    if (exists) {
      const shouldOverwrite = await confirmOverwrite([filePath]);
      if (!shouldOverwrite) {
        return { skipped: true, path: filePath };
      }
    }
    
    await createDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    
    return { path: filePath };
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

export async function generateBlockFiles(blockDetails) {
  const {
    blockName,
    isDynamic,
    hasChildBlock,
    childBlockName
  } = blockDetails;

  const blockJsPath = getBlockJsPath(blockName);
  const createdFiles = [];

  // Create block directory
  await createDirectory(blockJsPath);

  // Create block.json
  const blockJsonPath = path.join(blockJsPath, 'block.json');
  const blockJsonContent = generateBlockJson(blockDetails);
  const blockJsonResult = await writeFile(blockJsonPath, blockJsonContent);
  if (!blockJsonResult.skipped) createdFiles.push(blockJsonResult.path);

  // Create index.js
  const indexJsPath = path.join(blockJsPath, 'index.js');
  const indexJsContent = generateIndexJs(blockDetails);
  const indexJsResult = await writeFile(indexJsPath, indexJsContent);
  if (!indexJsResult.skipped) createdFiles.push(indexJsResult.path);

  // Create edit.js
  const editJsPath = path.join(blockJsPath, 'edit.js');
  const editJsContent = generateEditJs(blockDetails);
  const editJsResult = await writeFile(editJsPath, editJsContent);
  if (!editJsResult.skipped) createdFiles.push(editJsResult.path);

  // Create save.js if not dynamic
  if (!isDynamic) {
    const saveJsPath = path.join(blockJsPath, 'save.js');
    const saveJsContent = generateSaveJs(blockDetails);
    const saveJsResult = await writeFile(saveJsPath, saveJsContent);
    if (!saveJsResult.skipped) createdFiles.push(saveJsResult.path);
  }

  // Create PHP class and blade template if dynamic
  if (isDynamic) {
    // Create PHP class
    const phpPath = getBlockPhpPath(blockName);
    const phpContent = generatePhpClass(blockDetails);
    const phpResult = await writeFile(phpPath, phpContent);
    if (!phpResult.skipped) createdFiles.push(phpResult.path);

    // Create view directory
    const viewPath = getBlockViewPath(blockName);
    await createDirectory(viewPath);

    // Create blade template
    const bladePath = path.join(viewPath, 'index.blade.php');
    const bladeContent = generateBladeTemplate(blockDetails);
    const bladeResult = await writeFile(bladePath, bladeContent);
    if (!bladeResult.skipped) createdFiles.push(bladeResult.path);
  }

  // Generate child block files if needed
  let childBlockFiles = [];
  if (hasChildBlock && childBlockName) {
    childBlockFiles = await generateChildBlockFiles(blockDetails);
  }

  // Try to update editor.js
  const editorJsUpdate = await updateEditorJs(blockName);

  return {
    blockFiles: createdFiles,
    childBlockFiles,
    editorJsUpdate
  };
}

export async function generateChildBlockFiles(blockDetails) {
  const { blockName, childBlockName, blockCategory } = blockDetails;
  const childBlockPath = path.join(getBlockJsPath(blockName), childBlockName);
  const createdFiles = [];

  // Create child block directory
  await createDirectory(childBlockPath);

  // Create child block.json
  const childBlockJsonPath = path.join(childBlockPath, 'block.json');
  const childBlockJsonContent = generateChildBlockJson(blockDetails);
  const childBlockJsonResult = await writeFile(childBlockJsonPath, childBlockJsonContent);
  if (!childBlockJsonResult.skipped) createdFiles.push(childBlockJsonResult.path);

  // Create child index.js
  const childIndexJsPath = path.join(childBlockPath, 'index.js');
  const childIndexJsContent = generateChildIndexJs(blockDetails);
  const childIndexJsResult = await writeFile(childIndexJsPath, childIndexJsContent);
  if (!childIndexJsResult.skipped) createdFiles.push(childIndexJsResult.path);

  // Create child edit.js
  const childEditJsPath = path.join(childBlockPath, 'edit.js');
  const childEditJsContent = generateChildEditJs(blockDetails);
  const childEditJsResult = await writeFile(childEditJsPath, childEditJsContent);
  if (!childEditJsResult.skipped) createdFiles.push(childEditJsResult.path);

  // Create child save.js
  const childSaveJsPath = path.join(childBlockPath, 'save.js');
  const childSaveJsContent = generateChildSaveJs(blockDetails);
  const childSaveJsResult = await writeFile(childSaveJsPath, childSaveJsContent);
  if (!childSaveJsResult.skipped) createdFiles.push(childSaveJsResult.path);

  return createdFiles;
}

export async function updateEditorJs(blockName) {
  try {
    const editorJsPath = getEditorJsPath();
    
    if (!await fileExists(editorJsPath)) {
      return false;
    }

    const editorJsContent = await fs.readFile(editorJsPath, 'utf8');
    const importStatement = `import './blocks/${blockName}/index.js';`;
    
    if (editorJsContent.includes(importStatement)) {
      return 'already-imported';
    }

    let updatedEditorJs = editorJsContent;
    
    const blockImportPattern = /import ['"]\.\/blocks\/(.+)\/index\.js['"];/;
    const blockImports = editorJsContent.match(new RegExp(blockImportPattern, 'g'));
    
    if (blockImports && blockImports.length > 0) {
      const lastImport = blockImports[blockImports.length - 1];
      updatedEditorJs = editorJsContent.replace(
        lastImport, 
        `${lastImport}\n${importStatement}`
      );
    } else {
      updatedEditorJs = `${importStatement}\n\n${editorJsContent}`;
    }
    
    await fs.writeFile(editorJsPath, updatedEditorJs);
    return true;
  } catch (error) {
    return error;
  }
}
