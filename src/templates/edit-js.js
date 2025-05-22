/**
 * Generate the edit.js content
 */
export function generateEditJs(params) {
  const { blockName } = params;

  return `import { useBlockProps } from '@wordpress/block-editor';

export const edit = () => {
    const blockProps = useBlockProps();
    
    return (
        <div {...blockProps}>
            ${blockName}
        </div>
    );
};`;
}