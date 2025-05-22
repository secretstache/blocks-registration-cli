export function generateChildEditJs(params) {
  const { childBlockName } = params;
  
  return `import { useBlockProps } from '@wordpress/block-editor';

export const edit = () => {
    const blockProps = useBlockProps();
    
    return (
        <div {...blockProps}>
            ${childBlockName}
        </div>
    );
};`;
}
