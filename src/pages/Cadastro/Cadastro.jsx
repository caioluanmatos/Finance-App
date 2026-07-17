import { useState } from 'react'
import './Cadastro.css'
import { Link } from 'react-router-dom'

function Cadastro() {

            const [nome, setNome] = useState('')
            const [email, setEmail] = useState('')
            const [senha, setSenha] = useState('')
            const [confirmarSenha, setConfirmarSenha] = useState('')


    function handleSubmit(event) {

                event.preventDefault()

                if ( senha !== confirmarSenha) {
                     alert ('As senhas não coincidem!')
                } else {
                    alert ('As senhas sim coincidem!')
                }
                        
                    
                

                console.log(nome)
                console.log(email)
                console.log(senha)
                console.log(confirmarSenha)
}
            

  return (
    <main>
      <section>
            <div className='cadastro'>
                <h1>Cadastre-se</h1>
                <p>Preencha seus dados para criar sua conta.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={(event) => setNome (event.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">E-mail</label>
                     <input
                        type="email"
                        id="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e)=> setEmail (e.target.value)}
                        required
                        />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                         placeholder="Digite sua senha"
                         value={senha}
                         onChange={(e) => setSenha (e.target.value)}
                         required
                        />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmar senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Digite sua senha novamente"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                        />
                 </div>

                    <button type="submit">Criar conta</button>
            </form>
                        <div className="login-link">
                                <p>Já possui uma conta?</p>
                                <Link to="/">Entrar</Link>
                        </div>
            
            </div>
      </section>
    </main>
  )
}

export default Cadastro