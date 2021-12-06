import { ListMapper } from "../workitems";

const getNexts = (list) => {
  return list.reduce((acc, val) => {
    if (val.next) {
      acc.push(val.next);
    }

    return acc;
  }, []);
};

const getHeads = (root, idToNodeMap) => {
  const heads = [];
  // Scan children of each node
  Object.entries(idToNodeMap).forEach(([key]) => {
    const list = idToNodeMap[key]._children;
    if (list) {
      list.forEach((c) => {
        if (c.next && !getNexts(list).includes(c.workitemid)) {
          heads.push(c.workitemid);
        }
      });
    }
  });

  // Scan root
  root.forEach((r) => {
    if (r.next && !getNexts(root).includes(r.workitemid)) {
      heads.push(r.workitemid);
    }
  });

  return heads;
};

export class SortList extends ListMapper {
  constructor({ list }) {
    // console.log("SORT", JSON.stringify(list));
    super({ list });
    // apply sorting by date_created
    this.applySorting("date_created");

    // apply sorting by sort
    this.updateSortAttribute();
    this.applySorting("sort");
  }

  getNodeMap() {
    return this.idToNodeMap;
  }

  getUpdatedList() {
    return Object.entries(this.idToNodeMap).map(([, value]) => {
      return value;
    });
  }

  applySorting(field) {
    const root = this.getRoot();
    // 1. Sort children of each node
    Object.entries(this.idToNodeMap).forEach(([key]) => {
      if (this.idToNodeMap[key]._children) {
        this.idToNodeMap[key]._children.sort((c1, c2) => c1[field] - c2[field]);
      }
    });
    // 2. Sort tree root
    this.setRoot(root.sort((r1, r2) => r1[field] - r2[field]));
  }

  updateSortAttribute() {
    const root = this.getRoot();
    const SORT_START_INDEX = 10000000;
    const heads = getHeads(root, this.idToNodeMap);

    const areOnSameLevel = (id, next) => {
      return this.idToNodeMap[id].parentid === this.idToNodeMap[next].parentid;
    };

    const idNextPairs = [];

    const isLoop = (id, next) => {
      const index = idNextPairs.findIndex(
        (pair) =>
          (pair.id === id && pair.next === next) ||
          (pair.next === id && pair.id === next)
      );
      if (index > -1) {
        return true;
      }
      idNextPairs.push({ id, next });
      return false;
    };

    const traverseNexts = (id, start) => {
      if (this.idToNodeMap[id].next) {
        const nextId = this.idToNodeMap[id].next;
        if (
          this.idToNodeMap[nextId] &&
          areOnSameLevel(id, nextId) &&
          !isLoop(id, nextId)
        ) {
          const node = this.idToNodeMap[nextId];
          const increment = start + 5;
          node.sort = increment;
          traverseNexts(nextId, increment);
        }
      }
    };
    for (let i = 0; i < heads.length; i++) {
      this.idToNodeMap[heads[i]].sort = SORT_START_INDEX * (i + 1);
      traverseNexts(heads[i], SORT_START_INDEX * (i + 1));
    }
  }
}

export const sortList = (list) => {
  return new SortList({ list }).getUpdatedList();
};
