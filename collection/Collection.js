class Collection {
  // name   - String
  // fields - [String]
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
    this.idLength = 15;
    this.idCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  localStorageGet() {
    return JSON.parse(localStorage.getItem(this.name));
  }

  localStorageSet(data) {
    return localStorage.setItem(this.name, JSON.stringify(data));
  }

  generateId() {
    let result = '';
    let charactersLength = this.idCharacters.length;
    for (let i = 0; i < this.idLength; i++) {
      result += this.idCharacters.charAt(Math.floor(Math.random() * charactersLength));
    }

    let generatedIds = JSON.parse(localStorage.getItem('ids'));

    if (generatedIds === null) {
      localStorage.setItem('ids', JSON.stringify([result]));

      return result;
    } else {
      for (let i = 0; i < generatedIds.length; i++) {
        if (generatedIds[i] === result) {
          return this.generateId();
        }
      }

      generatedIds.push(result);
      localStorage.setItem('ids', JSON.stringify(generatedIds));

      return result;
    }
  }

  // TODO modify method so it can not save same data(users)
  add(data, append = false) {
    let newData = {
      id: this.generateId()
    };
    for (let i = 0; i < this.fields.length; i++) {
      newData[this.fields[i]] = data[this.fields[i]];
    }

    if (append) {
      let existingData = (this.localStorageGet(this.name) !== null) ? this.localStorageGet(this.name) : [];
      existingData.push(newData);
      this.localStorageSet(existingData);
    } else {
      this.localStorageSet(newData);
    }

    return true;
  }

  getAll() {
    return this.localStorageGet();
  }

  getByKeyValue(key, value) {
    let collection = this.localStorageGet();
    let result = null;

    for (let i = 0; i < collection.length; i++) {
      if (collection[i][key] === value) {
        result = collection[i];
      }
    }

    return result;
  }

  getByKeyValueArr(key, value) {
    let collection = this.localStorageGet();

    let result = [];
    for (let i = 0; i < collection.length; i++) {
      if (collection[i][key] === value) {
        result.push(collection[i]);
      }
    }

    return result;
  }

  getById(id) {
    return this.getByKeyValue('id', id);
  }

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

    localStorage.setItem(this.name, JSON.stringify(newData));

    if (newData.length < oldData.length) {
      console.log(`Deleted one record (${id}) from collection "${this.name}"`);
    }

    return true;
  }

  deleteAll() {

  }
}
