export function generateIndexJs(params) {
  const { isDynamic, childBlockName } = params;

  let content = `import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';`;

  // Add save import if not dynamic
  if (!isDynamic) {
    content += `
import { save } from './save.js';`;
  }

  content += `

import blockMetadata from './block.json';`;

  // Add child import if needed
  if (childBlockName) {
    content += `
import './${childBlockName}/index.js';`;
  }

  content += `

registerBlockType(blockMetadata, {
    edit,`;
    
  // Add save export if not dynamic
  if (!isDynamic) {
    content += `
    save,`;
  }

  content += `
});`;

  return content;
}
