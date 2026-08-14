
import { response } from "express";
import "./Transacoes.css";
import { useState } from "react";

function Transacoes() {
    const [descricao,setDescricao]= useState("");
    const [valor, setValor] = useState ("");
    const [tipo, setTipo] =useState ("receita");
    const [data,setData] = useState ("");


         function handleSubmit(event){
            event.preventDefault();

                fetch("http://localhost:3000/transacoes",{
                    method: "POST",
                    headers:{
                        "content-type": "application/json",
                        Authorization: "Bearer "+ localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        descricao,valor,tipo,data
                    })
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao cadastrar transação");
                    }

                    return response.json();
})


                .then((data)=>{
                    console.log("Resposta:", data);
                        alert("Transação adicionada com sucesso!");
                        setDescricao("");
                        setValor("");
                        setTipo("despesa");
                        setData("");

                })
                .catch((error)=> {
                    console.error("Erro:",error);

                    alert("Erro ao cadastrar transação");
                });

         }

    return (
        <div className="transacoes-page">
            <h1>Transação</h1>
            <p>Gerencie suas receitas e desepesas</p>

            <form className="transacoes-form" onSubmit={handleSubmit}>

                <>
                    <label>Descrição</label>
                    <input type="text" placeholder=" Ex: Mercado" value={descricao} onChange={(e)=> setDescricao (e.target.value)}>
                    </input>

                    <>
                        <label>Valor</label>
                        <input type="number" placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(e.target.value)}>
                        </input>
                    </>

                    <>
                        <label>Data</label>
                        <input 
                            type="date"
                            value={data}
                            onChange={(e)=> setData(e.target.value)}>
                            </input>
                    
                    </>

                        <button type="submit">
                            Adicionar transação
                        </button>
                    
                
                </>
            </form>
        </div>
    );
}

export default Transacoes;