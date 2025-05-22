import { config, toClassName } from '../config/defaults.js';

export function generatePhpClass(params) {
  const { blockName } = params;
  const blockClass = toClassName(blockName);
  
  return `<?php

namespace ${config.phpNamespace};

class ${blockClass} extends Block
{
    protected function prepareData($attributes, $content): array
    {
        return [
            "wrapper_attributes" => get_block_wrapper_attributes(),
            "content" => $content
        ];
    }
}`;
}
