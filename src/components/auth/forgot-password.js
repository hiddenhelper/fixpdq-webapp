import React from 'react'
import { css } from 'glamor'
import { Auth } from 'aws-amplify'
import UserContext from '../user/context'

class ForgotPassword extends React.Component {
  state = {
    email: '',
    confirmationCode: '',
    password: '',
    showConfirmation: false
  }
  static contextType = UserContext
  onChange = (key, value) => {
    this.props.updateErrorMessage(null)
    this.setState({
      [key]: value
    })
  }
  forgotPassword = () => {
    Auth.forgotPassword(this.state.email)
      .then(() => {
        this.setState({ showConfirmation: true })
      })
      .catch(err => console.log('[forgotPassword]: ', err))
  }
  forgotPasswordSubmit = () => {
    const { email, password, confirmationCode } = this.state
    Auth.forgotPasswordSubmit(email, confirmationCode, password)
      .then(() => {
        alert('successfully changed password!')
        this.props.switchState('showSignIn')
      })
      .catch(err => console.log('[forgotPasswordSubmit] error resetting password:', err))
  }
  render() {
    return (
      <div {...css(styles.container)}>
        {
          !this.state.showConfirmation && (
            <div {...css(styles.formContainer)}>
              <div {...css(styles.signInHeader)} className="fix_menu_12">Reset password</div>
              <div className="fix_paragraph_body_12">Enter your email address below and we will send link you password reset</div>
              <input data-cy="forgot-password-input-34532" 
                onChange={evt => this.onChange('email', evt.target.value)}
                {...css(styles.input)}
                placeholder='example@mail.com'
                className="fix_background_grey1 fix_paragraph_body_12"
              />
              <div {...css(styles.buttonPrimary)} className="fix_background_yellow_shadow" onClick={this.forgotPassword}>
                <div className="fix_menu_12">Get Authentication Code</div>
              </div>
            </div>
          )
        }
        {
          this.state.showConfirmation && (
            <div {...css(styles.formContainer)}>
              <input data-cy="forgot-password-input-45696" 
                onChange={evt => this.onChange('confirmationCode', evt.target.value)}
                {...css(styles.input)}
                placeholder='Confirmation Code'
                className="fix_background_grey1 fix_paragraph_body_12"
              />
              <input data-cy="forgot-password-input-24484" 
                onChange={evt => this.onChange('password', evt.target.value)}
                {...css(styles.input)}
                type='password'
                placeholder='New Password'
                className="fix_background_grey1 fix_paragraph_body_12"
              />
              <div {...css(styles.buttonPrimary)} className="fix_background_yellow_shadow" onClick={this.forgotPasswordSubmit}>
                <div className="fix_menu_12">Reset Password</div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

const styles = {
  signInHeader: {
    textAlign: 'left',
    margin: '0px 0px 20px'
  },
  buttonPrimary: {
    padding: '10px 60px',
    marginTop: 10,
    marginBottom: 10,
    cursor: 'pointer',
    borderRadius: '8px',
  },
  button: {
    padding: '10px 60px',
    backgroundColor: '#ffb102',
    marginTop: 10,
    marginBottom: 10,
    cursor: 'pointer',
    borderRadius: '30px',
    ':hover': {
      backgroundColor: '#ffbb22'
    }
  },
  buttonText: {
    margin: 0,
    color: 'white'
  },
  input: {
    height: 40,
    marginBottom: '10px',
    border: '1px solid #c9c9c9',
    borderRadius: '6px',
  },
  container: {
    flex: 1,
    paddingTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formContainer: {
    padding: 20,
    width: 400,
    display: 'flex',
    flexDirection: 'column',
  }
}

export default ForgotPassword
