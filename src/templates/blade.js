export function generateBladeTemplate(params) {
  const { blockName, blockTitle } = params;
  
  return `{{--
  Title: ${blockTitle}
  Description: Block template for ${blockName}
--}}`;
}
