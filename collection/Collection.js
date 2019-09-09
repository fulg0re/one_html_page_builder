class Collection extends AbstractDBCollection {
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

    this.localStorageSet(newData);

    return true;
  }

  // getAll :: () -> Object
  get() {
    return this.localStorageGet();
  }

  // update :: Object -> Boolean
  update(data) {
    let savedData = this.get();

    if (savedData === null) {
      return false;
    }

    for (let i = 0; i < this.fields.length; i++) {
      let field = this.fields[i];
      if (data.hasOwnProperty(field)) {
        savedData[field] = data[field];
      }
    }

    this.localStorageSet(savedData);
    return true;
  }

  // delete :: () -> Boolean
  delete() {
    localStorage.removeItem(this.name);
    return true;
  }
}
