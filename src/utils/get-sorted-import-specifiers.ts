import { ImportDeclaration } from '@babel/types';

import { naturalSort } from '../natural-sort';

/**
 * This function returns import nodes with alphabetically sorted module
 * specifiers
 * @param node Import declaration node
 */
export const getSortedImportSpecifiers = (node: ImportDeclaration) => {
    node.specifiers.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
        }

        const { start, end } = a
        const { start: bStart = 0, end: bEnd = 0 } = b

        return naturalSort(Number(end) - Number(start), Number(bEnd) - Number(bStart));
    });
    return node;
};
