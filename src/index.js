import { promptForBlockDetails, askToContinue } from './cli/prompt.js';
import { generateBlockFiles } from './utils/file.js';

export async function run() {
  try {
    console.log('\n🧩 WordPress Block Scaffolder\n');
    
    let shouldContinue = true;
    
    while (shouldContinue) {
      // Get block details from user
      const blockDetails = await promptForBlockDetails();
      
      // Generate block files
      const results = await generateBlockFiles(blockDetails);
      
      // Display results
      const { blockName, childBlockName, isDynamic } = blockDetails;
      const { blockFiles, childBlockFiles, editorJsUpdate } = results;

      console.log(`\n✅ Block "${blockName}" created successfully!`);
      
      console.log('\nFiles created:');
      blockFiles.forEach(file => {
        console.log(`- ${file}`);
      });
      
      if (childBlockFiles && childBlockFiles.length > 0) {
        console.log(`\nChild block "${childBlockName}" files:`);
        childBlockFiles.forEach(file => {
          console.log(`- ${file}`);
        });
      }
      
      if (editorJsUpdate === true) {
        console.log(`\n✅ Block "${blockName}" was automatically imported in editor.js`);
      } else if (editorJsUpdate === 'already-imported') {
        console.log(`\nℹ️ Block "${blockName}" was already imported in editor.js`);
      } else {
        console.log('\nManual next steps:');
        console.log('1. Import the block in editor.js:');
        console.log(`   import './blocks/${blockName}/index.js';`);
      }
      
      if (isDynamic) {
        console.log('2. Register the PHP class in your service provider (if not automatically loaded)');
      }

      // Ask if user wants to continue
      shouldContinue = await askToContinue();
    }
  } catch (err) {
    console.error(`\n❌ ${err.message}`);
    throw err;
  }
}
