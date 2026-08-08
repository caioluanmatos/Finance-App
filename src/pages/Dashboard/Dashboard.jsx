import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Bem-vindo ao Finance App</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h2>Saldo atual</h2>
                    <span>R$ 0,00</span>
                </div>

                <div className="card">
                    <h2>Receitas</h2>
                    <span>R$ 0,00</span>
                </div>

                <div className="card">
                    <h2>Despesas</h2>
                    <span>R$ 0,00</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;