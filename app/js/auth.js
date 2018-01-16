// - Auth Class - //
class Auth {

  constructor(data) {
    this.$authDisplay = data.$authDisplay
    this.$authModals = data.$authModals

    this.$isAuthDisplay = this.$authDisplay.find('[data-target=is-auth-display]')
    this.$notAuthDisplay = this.$authDisplay.find('[data-target=not-auth-display]')
    this.$loginModalBox = this.$authModals.find('[data-target=login-modal]')
    this.$loginOpenModal = this.$authDisplay.find('[data-action=login-modal-open]')

    this.setupModalForm(this.$loginOpenModal, this.$loginModalBox, '/api/login')
    this.run()
  }

  run() {
    fetch('/api/me', { method: 'get', credentials: 'include' })
    .then(r => r.json().then(data => {
      if (data.status) {
          this.$isAuthDisplay.toggleClass("hidden", false)
          this.$isAuthDisplay.find('[data-target=auth-user-email]').html(data.me.email)
          this.$notAuthDisplay.toggleClass("hidden", true)
      } else {
          this.$notAuthDisplay.toggleClass("hidden", false)
          this.$isAuthDisplay.toggleClass("hidden", true)
      }
    }))
  }

  setupModalForm($OpenModal, $ModalBox, url) {
    const $Modal = $ModalBox.find('[data-target=modal]')
    const $CloseModal = $Modal.find('[data-target=close-modal]')
    const $Form = $Modal.find('#modal-form')
    const $FormAlert = $Modal.find('[data-target=form-alert]')
    const $FormSubmit = $Modal.find('[data-action=submit]')
    const next = (status) => { if (status) this.run() }

    $OpenModal.on("click", () => {
      $Modal.toggleClass("on", true)
      $FormAlert.toggleClass("hidden", true).html('')
    })

    $CloseModal.on("click",() => {
      $Modal.toggleClass("on", false)
      $FormAlert.toggleClass("hidden", true).html('')
    })

    $(window).on( "click", (event) => {
      if ($(event.target)[0] == $Modal[0]) {
      	$Modal.toggleClass("on", false)
      	$FormAlert.toggleClass("hidden", true).html('')
      }
    })

    $FormSubmit.on('click', this.submitForm.bind({
        url,
        $Modal,
        $Form,
        $FormAlert,
        next
    }))
  }

  submitForm(e) {
      e.preventDefault()

      const next = this.next
      const form_data = this.$Form.serialize()
      const $Modal = this.$Modal
      const $FormAlert = this.$FormAlert

      const submitSuccess = () => {
        $Modal.toggleClass("on", false)
        next(true)
      }

      const submitFailed = (message) => {
        $FormAlert.toggleClass("hidden", false).html(message)
        next(false)
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
        if (data.status)
          submitSuccess()
        else
          submitFailed(data.message)
      }))
      .catch(err => {
        submitFailed('Something went wrong.')
      })
  }
}

module.exports = ($el) => {
    const $authDisplay = $el.find('[data-target=auth-display]')
    const $authModals = $el.find('[data-target=auth-modals]')
    return new Auth({ $authDisplay, $authModals })
}
