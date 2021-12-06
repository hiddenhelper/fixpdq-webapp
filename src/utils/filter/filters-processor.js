import { cloneDeep } from "lodash";
import { traverseFromRoot } from "../workitems";
import {
  getFilters,
  shouldBeVisible,
  areChildrenIsDisplay,
  areChildrenVisible,
  checkChildrenIds,
} from "./filter-utils";

export class FiltersProcessor {
  constructor({ tree, filter }) {
    this.nodeMap = convertToNodeMap(tree);
    this.setTree(cleanUpTree(tree));
    this.setFilters(filter);
    this.nodesToHide = [];
    this.nodesToDisplay = this.applyAllFilters();
    // console.log("this.nodesToDisplay ", this.nodesToDisplay );
  }

  setTree(data) {
    this.tree = cloneDeep(data);
  }

  setFilters(filter) {
    this.filter = cloneDeep(filter);
  }

  getTree() {
    return this.tree;
  }

  defineNodesToDisplay() {
    const result = cloneDeep(this.tree);

    this.setTree(result);
    return this;
  }

  defineHelperAttributes() {
    const root = cloneDeep(this.tree);
    traverseFromRoot({
      root,
      cb: (node) => {
        node.filterCondition = shouldBeVisible(node, this.filter);
        node.isAllChildrenDispaly = areChildrenIsDisplay(node);
        node.areChildrenVisible = areChildrenVisible(node, this.nodesToDisplay);
        node.inIds = this.nodesToDisplay.includes(node.workitemid);
        node.checkIds = checkChildrenIds(node);
      },
    });
    this.setTree(root);
    return this;
  }

  defineFilteredOutNodes() {
    const root = cloneDeep(this.tree);
    traverseFromRoot({
      root,
      cb: (node) => {
        const nodes = this.decideIfDisplay(node);
        nodes.forEach((n) => {
          this.nodesToHide.push(n);
        });
      },
    });
    return this;
  }

  defineVisibleNodes() {
    const root = cloneDeep(this.tree);
    traverseFromRoot({
      root,
      cb: (node) => {
        if (this.nodesToHide.includes(node.workitemid)) {
          node.display = false;
        } else {
          node.display = true;
        }
        if (!node.workitemid) {
          // So that newly added nodes are visible
          node.display = true;
        }
      },
    });
    this.setTree(root);
    return this;
  }

  applyFilters(slice) {
    const root = cloneDeep(this.tree);
    const idsToDisplay = [];
    traverseFromRoot({
      root,
      cb: (node) => {
        const filterSlice = this.filter[slice].values;
        const nodeField = node[slice];
        if (filterSlice.length > 0 && filterSlice.includes(nodeField)) {
          idsToDisplay.push(node.workitemid);
          this.getAllAncestors(node.workitemid).forEach((id) => {
            idsToDisplay.push(id);
          });
        }
        if (filterSlice.length === 0) {
          idsToDisplay.push(node.workitemid);
        }
        if (!node.workitemid) {
          idsToDisplay.push(node.workitemid);
        }
      },
    });

    return [...new Set([...idsToDisplay])];
  }

  applyAllFilters() {
    const idsBySlice = getFilters(this.filter).map((slice) =>
      this.applyFilters(slice)
    );
    // console.log("idsBySlice", idsBySlice);
    const allIds = idsBySlice.reduce((acc, val) => {
      acc = [...acc, ...val];
      return acc;
    });
    const allUniqueIds = [...new Set([...allIds])];
    const intersect = allUniqueIds.filter((id) =>
      idsBySlice.every((list) => list.includes(id))
    );
    // console.log("intersect", intersect);
    return intersect;
  }

  decideIfDisplay(node) {
    // ci: false f: false ad:true cv: false id: false
    const nodesToHide = [];
    if (node.workitemid) {
      if (!node.filterCondition && !node.inIds && !node.checkIds) {
        nodesToHide.push(node.workitemid);
      }
      if (!node.filterCondition && !node.isAllChildrenDispaly) {
        // leaf nodes
        nodesToHide.push(node.workitemid);
      }
      if (!node.filterCondition && node.checkIds && node.inIds) {
        // hide ancestors of this node.
        const ancestors = this.getAllAncestors(node.workitemid);
        ancestors.forEach((n) => {
          nodesToHide.push(n);
        });
      }
    }
    return [...new Set([...nodesToHide])];
  }

  getAllAncestors(workitemid) {
    const ancestors = [];
    const getParent = (workitemid) => {
      const parent = this.nodeMap[workitemid].parentid;
      if (parent && parent !== "0") {
        ancestors.push(parent);
        getParent(parent);
      }
    };
  
    if (this.nodeMap && this.nodeMap[workitemid]) {
      getParent(workitemid);
    }
    return ancestors;
  };
}

export const convertToNodeMap = (root) => {
  const nodeMap = {};
  traverseFromRoot({
    root,
    cb: (node) => {
      nodeMap[node.workitemid] = node;
    }
  });

  return nodeMap;
};

const cleanUpTree = (root) => {
  const tree = cloneDeep(root);
  traverseFromRoot({
    root: tree,
    cb: (node) => {
      node.display = true;
      delete node.filterCondition;
      delete node.isAllChildrenDispaly;
      delete node.inIds;
      delete node.checkIds;
      delete node.areChildrenVisible;
    }
  });
  return tree;
}

export const processFilters = ({ tree, filter }) => {
  return new FiltersProcessor({ tree, filter })
    .defineHelperAttributes()
    .defineFilteredOutNodes()
    .defineVisibleNodes()
    .getTree();
};
