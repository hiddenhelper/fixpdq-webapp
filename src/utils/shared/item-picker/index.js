class ItemPicker {
  constructor({ id, list, idPropName }) {
    this.item = list.find((item) => item[idPropName] === id);
  }

  pickProp(prop) {
    try {
      if (this.item) {
        return this.item[prop];
      }
      return null;
    } catch {
      return null;
    }
  }
}

export default ItemPicker;
