// src/pages/Home/Home.jsx

import { Link } from "react-router-dom";
import {
    FaChartLine,
    FaWallet,
    FaBullseye,
    FaShieldAlt
} from "react-icons/fa";

import "./Home.css";

function Home() {
    return (
        <div className="home-page">

            {/* HEADER */}
            <header className="home-header">

                <div className="home-logo">
                    Finance App
                </div>

                <nav className="home-nav">

                    <a href="#recursos">
                        Recursos
                    </a>

                    <a href="#sobre">
                        Sobre
                    </a>

                    <Link
                        to="/login"
                        className="home-login"
                    >
                        Entrar
                    </Link>

                    <Link
                        to="/cadastro"
                        className="home-cadastro"
                    >
                        Criar conta
                    </Link>

                </nav>

            </header>


            <main className="home-main">

                {/* HERO */}
                <section className="home-hero">

                    <div className="home-hero-content">

                        <span className="home-badge">
                            Controle financeiro simples e inteligente
                        </span>

                        <h1>
                            Organize suas finanças.
                            <span>
                                Conquiste seus objetivos.
                            </span>
                        </h1>

                        <p>
                            Tenha controle das suas receitas,
                            despesas e metas financeiras em um
                            único lugar.
                        </p>

                        <div className="home-actions">

                            <Link
                                to="/cadastro"
                                className="home-primary-button"
                            >
                                Começar agora
                            </Link>

                            <Link
                                to="/login"
                                className="home-secondary-button"
                            >
                                Já tenho uma conta
                            </Link>

                        </div>

                    </div>


                    <div className="home-preview">

                        <div className="preview-header">

                            <span>
                                Resumo financeiro
                            </span>

                            <FaChartLine />

                        </div>


                        <div className="preview-balance">

                            <small>
                                Saldo atual
                            </small>

                            <strong>
                                R$ 8.450,00
                            </strong>

                        </div>


                        <div className="preview-values">

                            <div>

                                <span>
                                    Receitas
                                </span>

                                <strong className="preview-receita">
                                    + R$ 12.500
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Despesas
                                </span>

                                <strong className="preview-despesa">
                                    - R$ 4.050
                                </strong>

                            </div>

                        </div>


                        <div className="preview-chart">

                            <div className="chart-bar bar-1"></div>
                            <div className="chart-bar bar-2"></div>
                            <div className="chart-bar bar-3"></div>
                            <div className="chart-bar bar-4"></div>
                            <div className="chart-bar bar-5"></div>
                            <div className="chart-bar bar-6"></div>

                        </div>

                    </div>

                </section>


                {/* RECURSOS */}
                <section
                    className="home-features"
                    id="recursos"
                >

                    <div className="home-section-title">

                        <span>
                            RECURSOS
                        </span>

                        <h2>
                            Tudo que você precisa para organizar sua vida financeira
                        </h2>

                        <p>
                            Ferramentas simples para acompanhar
                            seu dinheiro e alcançar suas metas.
                        </p>

                    </div>


                    <div className="home-features-grid">

                        <article className="home-feature-card">

                            <div className="feature-icon">
                                <FaWallet />
                            </div>

                            <h3>
                                Receitas e despesas
                            </h3>

                            <p>
                                Registre suas movimentações e acompanhe
                                para onde seu dinheiro está indo.
                            </p>

                        </article>


                        <article className="home-feature-card">

                            <div className="feature-icon">
                                <FaChartLine />
                            </div>

                            <h3>
                                Dashboard financeiro
                            </h3>

                            <p>
                                Visualize saldo, receitas,
                                despesas e evolução financeira.
                            </p>

                        </article>


                        <article className="home-feature-card">

                            <div className="feature-icon">
                                <FaBullseye />
                            </div>

                            <h3>
                                Metas financeiras
                            </h3>

                            <p>
                                Crie objetivos e acompanhe
                                o progresso das suas metas.
                            </p>

                        </article>


                        <article className="home-feature-card">

                            <div className="feature-icon">
                                <FaShieldAlt />
                            </div>

                            <h3>
                                Conta segura
                            </h3>

                            <p>
                                Autenticação protegida e recuperação
                                de senha através de código por e-mail.
                            </p>

                        </article>

                    </div>

                </section>


                {/* SOBRE */}
                <section
                    className="home-about"
                    id="sobre"
                >

                    <div className="home-about-content">

                        <span>
                            FINANCE APP
                        </span>

                        <h2>
                            Suas finanças sob controle.
                        </h2>

                        <p>
                            O Finance App foi criado para tornar
                            o gerenciamento financeiro mais simples,
                            organizado e visual.
                        </p>

                        <p>
                            Acompanhe suas movimentações, analise
                            seus resultados e estabeleça metas
                            para construir uma vida financeira
                            mais organizada.
                        </p>

                        <Link
                            to="/cadastro"
                            className="home-primary-button"
                        >
                            Criar minha conta
                        </Link>

                    </div>

                </section>

            </main>


            {/* FOOTER */}
            <footer className="home-footer">

                <div>

                    <strong>
                        Finance App
                    </strong>

                    <p>
                        Organize hoje. Conquiste amanhã.
                    </p>

                </div>

                <span>
                    © 2026 Finance App
                </span>

            </footer>

        </div>
    );
}

export default Home;