import _ from "lodash";
import { ListMapper } from "../list-mapper";
import { traverseFromRoot } from "../tree-traverse";

export class ListConvertor extends ListMapper {
  constructor({ list }) {
    // console.log(JSON.stringify(list));
    super({ list });
  }

  sortNodes() {
    const root = this.getRoot();
    const applySorting = () => {
      traverseFromRoot({
        root,
        cb: (node) => {
          if (node._children.length > 0) {
            node._children.sort((c1, c2) => c1.date_created - c2.date_created);
            node._children.sort((c1, c2) => c1.sort - c2.sort);
          }
        },
      });
    };

    applySorting();
    const sortedRoot = _.orderBy(
      root,
      ["swarm", "sort", "date_created"],
      ["asc", "asc", "asc"]
    );

    this.setRoot(sortedRoot);
    return this;
  }
}
