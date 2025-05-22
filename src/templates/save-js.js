/**
 * Save.js template generator
 */

export function generateSaveJs(params) {
  const { blockName } = params;

  return `import { useBlockProps } from '@wordpress/block-editor';

export const save = () => {
    const blockProps = useBlockProps.save();
    
    return (
        <div {...blockProps}>
            ${blockName}
        </div>
    );
};`;
}