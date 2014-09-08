// credit: http://jsfiddle.net/joaocolombo/wWk4x/

// return the caret position of the textarea
HTMLTextAreaElement.prototype.getCaret = function () {
    return this.selectionStart
}

// change the caret position of the textarea
HTMLTextAreaElement.prototype.setCaret = function (position) {
    this.selectionStart = position
    this.selectionEnd = position
    this.focus()
}

module.exports = function (content) {

  var textarea = document.createElement('textarea')
  textarea.value = content || ''
  textarea.className = 'input'

  // support tab on textarea
  textarea.onkeydown = function (event) {

    // tab was pressed
    if (event.keyCode == 9) { 
      var newCaretPosition
      newCaretPosition = textarea.getCaret() + "  ".length
      textarea.value = textarea.value.substring(0, textarea.getCaret()) + "  " + textarea.value.substring(textarea.getCaret(), textarea.value.length)
      textarea.setCaret(newCaretPosition)
      return false
    }

    // backspace
    if (event.keyCode == 8) {
      // it's a tab space
      if (textarea.value.substring(textarea.getCaret() - 4, textarea.getCaret()) == "  ") {
        var newCaretPosition
        newCaretPosition = textarea.getCaret() - 3
        textarea.value = textarea.value.substring(0, textarea.getCaret() - 3) + textarea.value.substring(textarea.getCaret(), textarea.value.length)
        textarea.setCaret(newCaretPosition)
      }
    }

    // left arrow
    if (event.keyCode == 37) {
      var newCaretPosition;
      // it's a tab space
      if (textarea.value.substring(textarea.getCaret() - 4, textarea.getCaret()) == "  ") {
        newCaretPosition = textarea.getCaret() - 3
        textarea.setCaret(newCaretPosition)
      }
    }

    if (event.keyCode == 39) { //right arrow
      var newCaretPosition
      // it's a tab space
      if (textarea.value.substring(textarea.getCaret() + 4, textarea.getCaret()) == "    ") { 
        newCaretPosition = textarea.getCaret() + 3
        textarea.setCaret(newCaretPosition)
      }
    }
  }

  return textarea
}
