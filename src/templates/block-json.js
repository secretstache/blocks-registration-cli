import { config } from '../config/defaults.js';
import { blockIcons } from '../config/icons.js';

export function generateBlockJson(params) {
  const {
    blockName,
    blockTitle,
    blockCategory,
    childBlockName,
    isDynamic
  } = params;

  const keywords = blockName.split('-');

  const blockJson = {
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": `${config.namespace}/${blockName}`,
    "title": blockTitle,
    "description": "",
    "category": blockCategory,
    "icon": blockIcons[blockName] || "admin-generic",
    "keywords": keywords,
    "parent": ["ssm/section-wrapper"],
    "allowedBlocks": childBlockName ? [`${config.namespace}/${childBlockName}`] : undefined,
    "supports": {
      "spacing": {
        "margin": true,
        "padding": true
      }
    },
    "attributes": {}
  };

  if (isDynamic) {
    blockJson.render = "index";
  }

  return JSON.stringify(blockJson, null, 2);
}
