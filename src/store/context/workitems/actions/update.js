export const update = ({ dispatch, payload }) => {
  const { itemToUpdate, propertyName, propertyValue } = payload;
  itemToUpdate[propertyName] = propertyValue;
  const updatedWorkitems = [itemToUpdate];
  dispatch({
    type: "refresh-swarm",
    payload: { updatedWorkitems },
  });
};
