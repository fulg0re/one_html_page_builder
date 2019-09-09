class AbstractDBCollection {
  constructor() {
    this.idLength = 15;
    this.idCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  // localStorageGet :: () -> Object|[Object]
  localStorageGet() {
    return JSON.parse(localStorage.getItem(this.name));
  }

  // localStorageSet :: Object -> Boolean
  localStorageSet(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
    return true;
  }
  
  // generateId :: () -> String
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
}
