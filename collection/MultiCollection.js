class MultiCollection extends AbstractDBCollection {
  // name   - String
  // fields - [String]
  constructor(name, fields) {
    super();
    this.name = name;
    this.fields = fields;
  }

  // add :: Object -> Boolean
  add(data) {
    let newData = {
      id: this.generateId()
    };
    for (let i = 0; i < this.fields.length; i++) {
      newData[this.fields[i]] = data[this.fields[i]];
    }

    let existingData = (this.localStorageGet() !== null) ? this.localStorageGet() : [];
    existingData.push(newData);
    this.localStorageSet(existingData);

    return true;
  }

  // getAll :: () -> [Object]|[]
  getAll() {
    return (this.localStorageGet() !== null) ? this.localStorageGet() : [];
  }

  // getByKeyValue :: String -> Value -> Object
  // returns first found element
  getByKeyValue(key, value) {
    let savedData = (this.localStorageGet() !== null) ? this.localStorageGet() : [];
    let result = false;

    for (let i = 0; i < savedData.length; i++) {
      if (savedData[i][key] === value) {
        result = savedData[i];
        break;
      }
    }

    return result;
  }

  // getAllByKeyValue :: String -> Value -> [Object]
  getAllByKeyValue(key, value) {
    let savedData = (this.localStorageGet() !== null) ? this.localStorageGet() : [];
    let result = [];

    for (let i = 0; i < savedData.length; i++) {
      if (savedData[i][key] === value) {
        result.push(savedData[i]);
      }
    }

    return result;
  }

  // getById :: Value -> Object
  getById(id) {
    return this.getByKeyValue('id', id);
  }

  // updateById :: ID -> Object -> Boolean
  updateById(id, data) {
    let savedData = this.getAll();

    if (savedData === null || savedData.length === 0) {
      return false;
    }

    for (let i = 0; i < savedData.length; i++) {
      if (savedData[i].id === id) {
        for (let j = 0; j < this.fields.length; j++) {
          let field = this.fields[j];
          if (data.hasOwnProperty(field)) {
            savedData[i][field] = data[field];
          }
        }
      }
    }

    this.localStorageSet(savedData);

    return true;
  }

  // deleteById :: Value -> Boolean
  deleteById(id) {
    let oldData = this.getAll();
    let newData = [];

    if (oldData === null) {
      return false;
    }

    for (let i = 0; i < oldData.length; i++) {
      if (oldData[i].id !== id) {
        newData.push(oldData[i]);
      }
    }

    this.localStorageSet(newData);

    if (newData.length + 1 === oldData.length) {
      console.log(`Deleted one record (${id}) from collection "${this.name}"`);
    }

    return true;
  }

  // deleteById :: () -> Boolean
  deleteAll() {
    localStorage.removeItem(this.name);
    return true;
  }
}
