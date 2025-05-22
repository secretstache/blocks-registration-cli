import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { config, toTitleCase, getBlockJsPath } from '../config/defaults.js';

export async function promptForBlockDetails() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'blockName',
      message: 'Block name (e.g., team-members):',
      validate: async (input) => {
        if (!input) return 'Block name is required';
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Block name must be in kebab-case (lowercase with hyphens)';
        }
        
        const blockPath = getBlockJsPath(input);
        try {
          await fs.access(blockPath);
          return `Block "${input}" already exists at ${path.relative(process.cwd(), blockPath)}`;
        } catch {
          return true;
        }
      }
    },
    {
      type: 'input',
      name: 'blockCategory',
      message: 'Block category (ssm-templates):',
      default: config.defaultCategory
    },
    {
      type: 'confirm',
      name: 'isDynamic',
      message: 'Is this block dynamic (server-side rendered)? (y/n)',
      default: false
    },
    {
      type: 'confirm',
      name: 'hasChildBlock',
      message: 'Should this block have a child block? (y/n)',
      default: false
    }
  ]);

  const blockTitle = toTitleCase(answers.blockName.replace(/-/g, ' '));
  
  // Set parent block automatically
  const parentBlock = answers.hasChildBlock ? `ssm/${answers.blockName}` : 'ssm/section-wrapper';
  
  // Auto-generate child block name
  const childBlockName = answers.hasChildBlock ? `${answers.blockName}-item` : null;

  return {
    ...answers,
    blockTitle,
    parentBlock,
    hasParent: true,
    childBlockName
  };
}

export async function confirmOverwrite(filePaths) {
  const { shouldOverwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldOverwrite',
      message: 'Some files already exist. Do you want to overwrite them?',
      default: false
    }
  ]);

  return shouldOverwrite;
}

export async function askToContinue() {
  const { shouldContinue } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldContinue',
      message: 'Would you like to create another block? (y/n)',
      default: true
    }
  ]);

  return shouldContinue;
}