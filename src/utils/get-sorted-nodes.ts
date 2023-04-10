import { addComments, removeComments } from '@babel/types';
import { clone, isEqual } from 'lodash';

import { THIRD_PARTY_MODULES_SPECIAL_WORD, newLineNode, TYPES_DECLARATION_SPECIAL_WORD } from '../constants';
import { naturalSort } from '../natural-sort';
import { GetSortedNodes, ImportGroups, ImportOrLine } from '../types';
import { getImportNodesMatchedGroup } from './get-import-nodes-matched-group';
import { getSortedImportSpecifiers } from './get-sorted-import-specifiers';
import { getSortedNodesGroup } from './get-sorted-nodes-group';

/**
 * This function returns all the nodes which are in the importOrder array.
 * The plugin considered these import nodes as local import declarations.
 * @param nodes all import nodes
 * @param options
 */
export const getSortedNodes: GetSortedNodes = (nodes, options) => {
    naturalSort.insensitive = options.importOrderCaseInsensitive;

    const {
        importOrder,
        importOrderSeparation,
        importOrderSortSpecifiers,
        importOrderGroupNamespaceSpecifiers,
    } = options;
    if (!importOrder.includes(THIRD_PARTY_MODULES_SPECIAL_WORD)) {
        importOrder.unshift(THIRD_PARTY_MODULES_SPECIAL_WORD)
    }
    if (!importOrder.includes(TYPES_DECLARATION_SPECIAL_WORD)) {
        importOrder.unshift(TYPES_DECLARATION_SPECIAL_WORD)
    }

    const originalNodes = nodes.map(clone);
    const finalNodes: ImportOrLine[] = [];

    const importOrderGroups = importOrder.reduce<ImportGroups>(
        (groups, regexp) => ({
            ...groups,
            [regexp]: [],
        }),
        {},
    );

    const importOrderWithOuttTypesDeclarations = importOrder.filter(
        (group) => ![TYPES_DECLARATION_SPECIAL_WORD, THIRD_PARTY_MODULES_SPECIAL_WORD].includes(group),
    );

    for (const node of originalNodes) {
        const matchedGroup = getImportNodesMatchedGroup(
            node,
            importOrderWithOuttTypesDeclarations,
        );
        // 分类, 将对应的节点push到对应的规则组中
        importOrderGroups[matchedGroup].push(node);
    }

    for (const group of importOrder) {
        const groupNodes = importOrderGroups[group];

        if (groupNodes.length === 0) continue;

        // 对内部分组进行排序
        const sortedInsideGroup = getSortedNodesGroup(groupNodes, {
            importOrderGroupNamespaceSpecifiers,
        });

        // Sort the import specifiers
        if (importOrderSortSpecifiers) {
            sortedInsideGroup.forEach((node) =>
                getSortedImportSpecifiers(node),
            );
        }

        finalNodes.push(...sortedInsideGroup);

        if (importOrderSeparation) {
            finalNodes.push(newLineNode);
        }
    }

    if (finalNodes.length > 0 && !importOrderSeparation) {
        // a newline after all imports
        finalNodes.push(newLineNode);
    }

    // maintain a copy of the nodes to extract comments from
    const finalNodesClone = finalNodes.map(clone);

    const firstNodesComments = nodes[0].leadingComments;

    // Remove all comments from sorted nodes
    finalNodes.forEach(removeComments);

    // insert comments other than the first comments
    finalNodes.forEach((node, index) => {
        if (isEqual(nodes[0].loc, node.loc)) return;

        addComments(
            node,
            'leading',
            finalNodesClone[index].leadingComments || [],
        );
    });

    if (firstNodesComments) {
        addComments(finalNodes[0], 'leading', firstNodesComments);
    }

    return finalNodes;
};
