import './Login.css'
import { FaUser , FaLock } from 'react-icons/fa'

function Login (){
    return (

        <main>
            <section>
                <h1>Finance App</h1>
                <p>Bem-Vindo de Volta</p>

            <form>
                <label htmlFor='email'>E-mail</label>
                
                <div className='input-group'>
                    <FaUser />

                    <input
                        type='email'
                        id='email'
                        placeholder='Digita seu e-mail'
                        />
                </div>


                <label htmlFor='password'>Senha</label>
                
                <div className='input-group'>
                    <FaLock />

                    <input
                        type='password'
                        id='password'
                        placeholder='Digita sua senha'
                        />
                </div>


                    <label>
                        <input type="checkbox"/>
                        Lembrar-me
                    </label>

                    <button type='submit'>
                        Entrar
                    </button>

                    <p>Não possui uma conta?</p>

                    <a href='#'>Criar conta</a>

                    <hr />
            </form>

            </section>


        </main>
    )
}

export default Login