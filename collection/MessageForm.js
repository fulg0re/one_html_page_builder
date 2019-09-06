class MessageForm {
  // formId       - ID
  // messageFieldP - ID
  constructor(formId, messageFieldP) {
    this.formId = formId;
    this.messageFieldP = messageFieldP;
  }

  showHideForm(method = 'hide') {
    if (method === 'show') {
      $(`#${this.formId}`).removeClass('coreHidenForm');
    } else {
      $(`#${this.formId}`).addClass('coreHidenForm');
    }
  }

  setMessage(message) {
    $(`#${this.messageFieldP}`).html(message);

    return true;
  }

  setStyle() {
    //TODO
  }
}
