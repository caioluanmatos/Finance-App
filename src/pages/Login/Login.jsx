import './Login.css'
import { FaUser , FaLock } from 'react-icons/fa'
import logo from '../../assets/images/Logo/logoapp.png'
import { Link } from 'react-router-dom'

function Login (){
    return (

        <main>
            <section>

                
                    <div className="logo-area">
                         <img src={logo} alt="Logo Finance App" />

                            <h1>Finance App</h1>

                            <p>Organize hoje. Conquiste amanhã.</p>
                    </div>

                

            <form>
                <label htmlFor='email'>E-mail</label>
                
                <div className='input-group'>
                    <FaUser />

                    <input
                        type='email'
                        id='email'
                        placeholder='Digite seu e-mail'
                        />
                </div>


                <label htmlFor='password'>Senha</label>
                
                <div className='input-group'>
                    <FaLock />

                    <input
                        type='password'
                        id='password'
                        placeholder='Digite sua senha'
                        />
                </div>


                   <div className="remember-me">
                         <label>
                             <input type="checkbox" />
                             Lembrar-me
                            </label>
                    </div>

                    <button type='submit'>
                        Entrar
                    </button>

                    <div className="register-link">
                        <p>Não possui uma conta?</p>

                            <Link to="/cadastro">Criar conta</Link>
                    </div>

                    <hr />
            </form>

            </section>


        </main>
    )
}

export default Login