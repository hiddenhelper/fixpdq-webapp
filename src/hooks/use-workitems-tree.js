/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { WorkitemsContext, WorkitemsFilterContext } from "../store/context";
import { splitDots } from "../utils/workitems";
import neighbor from "../utils/workitems/get-neighbor";

export const useWorkitemsTree = () => {
  const {
    tree,
    _setTree,
    setTree,
    nodeMapWorkitemId,
    nodeMap,
    getMap,
    swarmActions,
  } = useContext(WorkitemsContext);
  const { filter } = useContext(WorkitemsFilterContext);

  const getTree = () => tree.slice();

  const getMaxId = () => {
    return Math.max(tree.map((t) => splitDots(t.id)[0]));
  };

  const getAncestorId = (idWithDots, level = 1) => {
    const nodeTreeIds = splitDots(idWithDots);
    const sliced = nodeTreeIds.slice(0, nodeTreeIds.length - level);
    const parentDotsId = sliced.length > 0 ? sliced.join(".") : "0";
    return parentDotsId === "0" ? "0" : nodeMap[parentDotsId].workitemid;
  };

  const getChildren = (node) => {
    const childrenIds = [];
    const getChildrenIds = (tree) => {
      if (tree._children) {
        tree._children.forEach((child) => {
          childrenIds.push(child.workitemid);
          if (child._children) {
            getChildrenIds(child);
          }
        });
      }
    };

    if (tree) {
      getChildrenIds(node);
    }

    return childrenIds;
  };

  const updateTitle = (id, title) => {
    if (nodeMap && nodeMap[id]) {
      swarmActions.dispatchUpdate({
        itemToUpdate: nodeMap[id],
        propertyName: "name",
        propertyValue: title,
      });
    }
  };

  const getPredecessor = (workitemid) => {
    return neighbor.getPredecessor(workitemid, nodeMapWorkitemId);
  };

  const getPredecessorByWorkitemId = (workitemid) => {
    return neighbor.getPredecessor(workitemid, nodeMapWorkitemId);
  };

  const getSuccessor = (workitemid) => {
    return neighbor.getSuccessor(workitemid, nodeMapWorkitemId);
  };

  const getSuccessorByWorkitemId = (workitemid) => {
    return neighbor.getSuccessor(workitemid, nodeMapWorkitemId);
  };

  const getLastChild = (workitemid) => {
    if (
      nodeMapWorkitemId[workitemid] &&
      nodeMapWorkitemId[workitemid]._children.length > 0
    ) {
      const length = nodeMapWorkitemId[workitemid]._children.length;
      const lastChild = nodeMapWorkitemId[workitemid]._children[length - 1];
      return lastChild.workitemid;
    } else {
      return "0";
    }
  };

  const getDescendants = (workitemid) => {
    const descendants = [];
    const iterateThroughChildren = (wid) => {
      const node = nodeMapWorkitemId[wid];
      if (node._children.length > 0) {
        for (let child of node._children) {
          descendants.push(child.workitemid);
          iterateThroughChildren(child.workitemid);
        }
      }
    };
    iterateThroughChildren(workitemid);
    return descendants;
  };

  const getNeighbors = (workitemid) => {
    if (nodeMapWorkitemId && nodeMapWorkitemId[workitemid]) {
      const parentId = nodeMapWorkitemId[workitemid].parentid;
      const predecessorId = getPredecessorByWorkitemId(workitemid);
      const successorId = getSuccessorByWorkitemId(workitemid);
      const descendantIds = getDescendants(workitemid);
      const lastChildOfPredecessorId = getLastChild(predecessorId);
      const successorOfParentId = getSuccessorByWorkitemId(parentId);
      return {
        parentId,
        parent: nodeMapWorkitemId[parentId],
        predecessorId,
        predecessor: nodeMapWorkitemId[predecessorId],
        successorId,
        successor: nodeMapWorkitemId[successorId],
        descendantIds,
        descendants: descendantIds.map((desc) => {
          return nodeMapWorkitemId[desc];
        }),
        lastChildOfPredecessorId,
        lastChildOfPredecessor: nodeMapWorkitemId[lastChildOfPredecessorId],
        successorOfParentId,
      };
    } else {
      return {};
    }
  };

  return {
    getTree,
    setTree,
    _setTree,
    getMaxId,
    getAncestorId,
    getChildren,
    updateTitle,
    getPredecessor,
    getSuccessor,
    getLastChild,
    getDescendants,
    filter,
    nodeMap,
    nodeMapWorkitemId,
    getMap,
    getNeighbors,
  };
};
