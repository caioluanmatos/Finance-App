import './Login.css'
import { FaUser , FaLock } from 'react-icons/fa'
import logo from '../../assets/images/Logo/logoapp.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function Login (){

        const [email, setEmail] = useState("")
        const [senha, setSenha] = useState("")


                    function handleSubmit(event) {

                         event.preventDefault()

                            console.log(email)
                            console.log(senha)


                          
}

    return (

        <main>
            <section>

                
                    <div className="logo-area">
                         <img src={logo} alt="Logo Finance App" />

                            <h1>Finance App</h1>

                            <p>Organize hoje. Conquiste amanhã.</p>
                    </div>

                

            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>E-mail</label>
                
                <div className='input-group'>
                    <FaUser />

                    <input
                        type='email'
                        id='email'
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChange={(e) => setEmail (e.target.value)}
                        />
                </div>


                <label htmlFor='password'>Senha</label>
                
                <div className='input-group'>
                    <FaLock />

                    <input
                        type='password'
                        id='password'
                        placeholder='Digite sua senha'
                        value={senha}
                        onChangeCapture={(e) => setSenha (e.target.value)}
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