class FormPage {
  // formId       - ID
  // formInputIds - [ID]
  constructor(formId, formInputIds) {
    this.formId = formId;
    this.formInputIds = formInputIds;
  }

  showHideForm(method = 'hide') {
    if (method === 'show') {
      $(`#${this.formId}`).removeClass('coreHidenForm');
    } else {
      $(`#${this.formId}`).addClass('coreHidenForm');
    }
  }

  getFieldsValue() {
    let fields = this.formInputIds;
    let result = {};
    for (let i = 0; i < fields.length; i++) {
      result[`${fields[i]}`] = $(`#${fields[i]}`).val();
    }

    return result;
  }

  setStyle() {
    //TODO
  }

  clearFields() {
    let fields = this.formInputIds;
    for (let i = 0; i < fields.length; i++) {
      $(`#${fields[i]}`).val('');
    }

    return true;
  }
}
