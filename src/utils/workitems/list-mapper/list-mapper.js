import _ from "lodash";

export const buildMap = (list, allChildren) => {
  const idToNodeMap = {};
  // Build a map first
  for (let i = 0; i < list.length; i++) {
    let node = list[i];
    if (node.children) {
      node.children.forEach((c) => {
        allChildren.add(c);
      });
    }
    node._children = [];
    idToNodeMap[node.workitemid] = node;
  }
  return idToNodeMap;
};

export class ListMapper {
  constructor({ list }) {
    // console.log(JSON.stringify(list));
    this.allChildren = new Set();
    this.idToNodeMap = {};
    this.root = [];
    this.setList(list);
    this.buildMap();
    this.defineParentId();
    this.populateChildren();
  }

  setList(list) {
    this.list = list.slice();
  }

  getList() {
    return this.list.slice();
  }

  setRoot(root) {
    this.root = _.cloneDeep(root);
  }

  getRoot() {
    return _.cloneDeep(this.root);
  }

  buildMap() {
    this.idToNodeMap = { ...buildMap(this.list, this.allChildren) };
  }

  defineParentId() {
    const list = this.getList();
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      if (node.isRoot) {
        delete node.isRoot;
      }
      const isRoot = !this.allChildren.has(node.workitemid);
      if (isRoot) {
        node.parentid = "0";
      }
      if (node.children) {
        node.children.forEach((c) => {
          if (this.idToNodeMap[c]) {
            this.idToNodeMap[c].parentid = node.workitemid;
          }
        });
      }
    }
  }

  populateChildren() {
    const list = this.getList();
    const root = [];
    // Populate children
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const isRoot = node.parentid === "0";
      node.title = node.name;
      node.display = true;
      if (isRoot) {
        node.isRoot = true;
        root.push({ ...{}, ...node });
      } else {
        node.isRoot = false;
        const parentNode = this.idToNodeMap[node.parentid];
        if (!isRoot && parentNode) {
          parentNode._children.push(node);
        }
      }
    }
    this.setRoot(root);
  }
}
