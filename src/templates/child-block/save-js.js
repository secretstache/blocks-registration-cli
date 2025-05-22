export function generateChildSaveJs(params) {
  const { childBlockName } = params;
  
  return `import { useBlockProps } from '@wordpress/block-editor';

export const save = () => {
    const blockProps = useBlockProps.save();
    
    return (
        <div {...blockProps}>
            ${childBlockName}
        </div>
    );
};`;
}
