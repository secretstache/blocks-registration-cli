import { config, toTitleCase } from '../../config/defaults.js';

export function generateChildBlockJson(params) {
  const { blockName, childBlockName, blockCategory } = params;
  const childBlockTitle = toTitleCase(childBlockName.replace(/-/g, ' '));
  
  const childBlockJson = {
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": `${config.namespace}/${childBlockName}`,
    "title": childBlockTitle,
    "description": "",
    "category": blockCategory,
    "parent": [`${config.namespace}/${blockName}`],
    "icon": "admin-generic",
    "supports": {
      "spacing": {
        "margin": true,
        "padding": true
      },
      "reusable": false
    },
    "attributes": {}
  };
  
  return JSON.stringify(childBlockJson, null, 2);
}
