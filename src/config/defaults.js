import path from 'path';

export const config = {
  themePath: process.cwd(),
  blocksJsDir: 'resources/scripts/editor/blocks',
  blocksPhpDir: 'app/Blocks',
  viewsDir: 'resources/views/blocks',
  namespace: 'ssm',
  phpNamespace: 'App\\Blocks',
  defaultCategory: 'ssm-templates',
  defaultParentBlock: 'ssm/section-wrapper'
};

export function getBlockJsPath(blockName) {
  return path.join(config.themePath, config.blocksJsDir, blockName);
}

export function getBlockPhpPath(blockName) {
  const className = toClassName(blockName);
  return path.join(config.themePath, config.blocksPhpDir, `${className}.php`);
}

export function getBlockViewPath(blockName) {
  return path.join(config.themePath, config.viewsDir, blockName);
}

export function getEditorJsPath() {
  return path.join(config.themePath, 'resources/scripts/editor/editor.js');
}

export function toClassName(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
