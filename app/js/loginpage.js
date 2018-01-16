// - Login Page Form Class - //
class LoginPageForm {

  constructor($el) {
    this.url = '/api/login'
    this.$FormBox = $el.find('[data-target=login-page-form]')
    this.$Form = this.$FormBox.find('#login-form')
    this.$FormAlert = this.$FormBox.find('[data-target=form-alert]')
    this.$FormSubmit = this.$FormBox.find('[data-action=submit]')
    // bind event
    this.$FormSubmit.on('click', this.submitForm.bind(this))
  }

  submitForm(e) {
      e.preventDefault()
      const form_data = this.$Form.serialize()
      const $FormAlert = this.$FormAlert

      const submitFailed = (message) => {
        $FormAlert.toggleClass("hidden", false).html(message)
      }

      fetch(this.url, {
        method: 'post',
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        credentials: 'include',
        body: form_data
      })
      .then(r => r.json().then(data => {
        if (!data.status)
          submitFailed(data.message)
        else
          window.location.href = this.getQueryVariable('ret')
      }))
      .catch(err => {
        submitFailed('Something went wrong.')
      })
  }

  getQueryVariable(key) {
    const query = window.location.search.substring(1)
    const vars = query.split("&")
    for (let i=0;i<vars.length;i++) {
      const pair = vars[i].split("=")
      if(pair[0] == key) return pair[1]
    }
    return "/"
  }
}

module.exports = ($el) => new LoginPageForm($el)
