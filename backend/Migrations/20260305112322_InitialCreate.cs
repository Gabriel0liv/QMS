using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cargos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cargos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogosDefeito",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogosDefeito", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Familias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ParametrosInspecao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Familias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedores",
                columns: table => new
                {
                    FornecedorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Morada = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedores", x => x.FornecedorCodigo);
                });

            migrationBuilder.CreateTable(
                name: "Maquinas",
                columns: table => new
                {
                    MaquinaCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Estado = table.Column<bool>(type: "boolean", nullable: false),
                    PrecoUsinagem = table.Column<decimal>(type: "numeric", nullable: false),
                    PrecoMaoObra = table.Column<decimal>(type: "numeric", nullable: false),
                    PrecoEnergia = table.Column<decimal>(type: "numeric", nullable: false),
                    Setor = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maquinas", x => x.MaquinaCodigo);
                });

            migrationBuilder.CreateTable(
                name: "Niveis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Niveis", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Servicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustoDecapar = table.Column<decimal>(type: "numeric", nullable: false),
                    Valor = table.Column<decimal>(type: "numeric", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servicos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TiposMovimento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposMovimento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiversosLista",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FamiliaId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiversosLista", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiversosLista_Familias_FamiliaId",
                        column: x => x.FamiliaId,
                        principalTable: "Familias",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FornecedoresClassificacao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnoFiscal = table.Column<int>(type: "integer", nullable: false),
                    Classificacao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FornecedorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FornecedoresClassificacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FornecedoresClassificacao_Fornecedores_FornecedorCodigo",
                        column: x => x.FornecedorCodigo,
                        principalTable: "Fornecedores",
                        principalColumn: "FornecedorCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Utilizadores",
                columns: table => new
                {
                    UtilizadorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CargoId = table.Column<int>(type: "integer", nullable: false),
                    NivelId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilizadores", x => x.UtilizadorCodigo);
                    table.ForeignKey(
                        name: "FK_Utilizadores_Cargos_CargoId",
                        column: x => x.CargoId,
                        principalTable: "Cargos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utilizadores_Niveis_NivelId",
                        column: x => x.NivelId,
                        principalTable: "Niveis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Artigos",
                columns: table => new
                {
                    ArtigoCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Unidade = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Peso = table.Column<decimal>(type: "numeric", nullable: false),
                    Categoria = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FamiliaId = table.Column<int>(type: "integer", nullable: false),
                    DiversosId = table.Column<int>(type: "integer", nullable: false),
                    MaquinaCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artigos", x => x.ArtigoCodigo);
                    table.ForeignKey(
                        name: "FK_Artigos_DiversosLista_DiversosId",
                        column: x => x.DiversosId,
                        principalTable: "DiversosLista",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Artigos_Familias_FamiliaId",
                        column: x => x.FamiliaId,
                        principalTable: "Familias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Artigos_Maquinas_MaquinaCodigo",
                        column: x => x.MaquinaCodigo,
                        principalTable: "Maquinas",
                        principalColumn: "MaquinaCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArtigosCusto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataInicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PriTotal = table.Column<decimal>(type: "numeric", nullable: false),
                    PraMatprim = table.Column<decimal>(type: "numeric", nullable: false),
                    PrecoEnergia = table.Column<decimal>(type: "numeric", nullable: false),
                    PrwiMaoobra = table.Column<decimal>(type: "numeric", nullable: false),
                    PruMaquina = table.Column<decimal>(type: "numeric", nullable: false),
                    CustoPintura = table.Column<decimal>(type: "numeric", nullable: false),
                    ArtigoCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtigosCusto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArtigosCusto_Artigos_ArtigoCodigo",
                        column: x => x.ArtigoCodigo,
                        principalTable: "Artigos",
                        principalColumn: "ArtigoCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentosTecnicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ArtigoCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    TipoDocumento = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CaminhoFicheiro = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsOficial = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentosTecnicos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentosTecnicos_Artigos_ArtigoCodigo",
                        column: x => x.ArtigoCodigo,
                        principalTable: "Artigos",
                        principalColumn: "ArtigoCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Movimentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Estado = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Localizacao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DataMovimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    Descontar = table.Column<bool>(type: "boolean", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    UtilizadorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ArtigoCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    MaquinaCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    TipoMovimentoId = table.Column<int>(type: "integer", nullable: false),
                    ServicoId = table.Column<int>(type: "integer", nullable: true),
                    DefeitoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movimentos_Artigos_ArtigoCodigo",
                        column: x => x.ArtigoCodigo,
                        principalTable: "Artigos",
                        principalColumn: "ArtigoCodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentos_CatalogosDefeito_DefeitoId",
                        column: x => x.DefeitoId,
                        principalTable: "CatalogosDefeito",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Movimentos_Maquinas_MaquinaCodigo",
                        column: x => x.MaquinaCodigo,
                        principalTable: "Maquinas",
                        principalColumn: "MaquinaCodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentos_Servicos_ServicoId",
                        column: x => x.ServicoId,
                        principalTable: "Servicos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Movimentos_TiposMovimento_TipoMovimentoId",
                        column: x => x.TipoMovimentoId,
                        principalTable: "TiposMovimento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Movimentos_Utilizadores_UtilizadorCodigo",
                        column: x => x.UtilizadorCodigo,
                        principalTable: "Utilizadores",
                        principalColumn: "UtilizadorCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RececoesInspecao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SagePedidoId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Linha = table.Column<int>(type: "integer", nullable: false),
                    DataRececao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    QtdTotalRecebida = table.Column<decimal>(type: "numeric", nullable: false),
                    DecisaoFinal = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CustoUnitarioMomento = table.Column<decimal>(type: "numeric", nullable: false),
                    Fatura = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Unidade = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    FornecedorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ArtigoCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UtilizadorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RececoesInspecao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RececoesInspecao_Artigos_ArtigoCodigo",
                        column: x => x.ArtigoCodigo,
                        principalTable: "Artigos",
                        principalColumn: "ArtigoCodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RececoesInspecao_Fornecedores_FornecedorCodigo",
                        column: x => x.FornecedorCodigo,
                        principalTable: "Fornecedores",
                        principalColumn: "FornecedorCodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RececoesInspecao_Utilizadores_UtilizadorCodigo",
                        column: x => x.UtilizadorCodigo,
                        principalTable: "Utilizadores",
                        principalColumn: "UtilizadorCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssinaturasDocumento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DepartamentoAssinatura = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    AssinaturaHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DataAssinatura = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DocumentoId = table.Column<int>(type: "integer", nullable: false),
                    UtilizadorCodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssinaturasDocumento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssinaturasDocumento_DocumentosTecnicos_DocumentoId",
                        column: x => x.DocumentoId,
                        principalTable: "DocumentosTecnicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssinaturasDocumento_Utilizadores_UtilizadorCodigo",
                        column: x => x.UtilizadorCodigo,
                        principalTable: "Utilizadores",
                        principalColumn: "UtilizadorCodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NaoConformes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataRegisto = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    QtdSage = table.Column<decimal>(type: "numeric", nullable: false),
                    IdMovimento = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NaoConformes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NaoConformes_Movimentos_IdMovimento",
                        column: x => x.IdMovimento,
                        principalTable: "Movimentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Retrabalhos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SetorIdentificado = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    AcaoExecutar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DataRetrabalho = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TempoMinutos = table.Column<decimal>(type: "numeric", nullable: false),
                    CustoRetrabalho = table.Column<decimal>(type: "numeric", nullable: true),
                    CustoRejeicao = table.Column<decimal>(type: "numeric", nullable: true),
                    CustoNc = table.Column<decimal>(type: "numeric", nullable: true),
                    MaquinaRejeicao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IdMovimento = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Retrabalhos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Retrabalhos_Maquinas_MaquinaRejeicao",
                        column: x => x.MaquinaRejeicao,
                        principalTable: "Maquinas",
                        principalColumn: "MaquinaCodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Retrabalhos_Movimentos_IdMovimento",
                        column: x => x.IdMovimento,
                        principalTable: "Movimentos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JustificacoesNOK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QtdAfetada = table.Column<decimal>(type: "numeric", nullable: false),
                    Observacoes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    RececaoId = table.Column<int>(type: "integer", nullable: false),
                    DefeitoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JustificacoesNOK", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JustificacoesNOK_CatalogosDefeito_DefeitoId",
                        column: x => x.DefeitoId,
                        principalTable: "CatalogosDefeito",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JustificacoesNOK_RececoesInspecao_RececaoId",
                        column: x => x.RececaoId,
                        principalTable: "RececoesInspecao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Artigos_DiversosId",
                table: "Artigos",
                column: "DiversosId");

            migrationBuilder.CreateIndex(
                name: "IX_Artigos_FamiliaId",
                table: "Artigos",
                column: "FamiliaId");

            migrationBuilder.CreateIndex(
                name: "IX_Artigos_MaquinaCodigo",
                table: "Artigos",
                column: "MaquinaCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_ArtigosCusto_ArtigoCodigo",
                table: "ArtigosCusto",
                column: "ArtigoCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_AssinaturasDocumento_AssinaturaHash",
                table: "AssinaturasDocumento",
                column: "AssinaturaHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssinaturasDocumento_DocumentoId",
                table: "AssinaturasDocumento",
                column: "DocumentoId");

            migrationBuilder.CreateIndex(
                name: "IX_AssinaturasDocumento_UtilizadorCodigo",
                table: "AssinaturasDocumento",
                column: "UtilizadorCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_Cargos_Descricao",
                table: "Cargos",
                column: "Descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CatalogosDefeito_Codigo",
                table: "CatalogosDefeito",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiversosLista_FamiliaId",
                table: "DiversosLista",
                column: "FamiliaId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosTecnicos_ArtigoCodigo",
                table: "DocumentosTecnicos",
                column: "ArtigoCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentosTecnicos_CaminhoFicheiro",
                table: "DocumentosTecnicos",
                column: "CaminhoFicheiro",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Familias_Codigo",
                table: "Familias",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FornecedoresClassificacao_FornecedorCodigo_AnoFiscal",
                table: "FornecedoresClassificacao",
                columns: new[] { "FornecedorCodigo", "AnoFiscal" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JustificacoesNOK_DefeitoId",
                table: "JustificacoesNOK",
                column: "DefeitoId");

            migrationBuilder.CreateIndex(
                name: "IX_JustificacoesNOK_RececaoId",
                table: "JustificacoesNOK",
                column: "RececaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_ArtigoCodigo",
                table: "Movimentos",
                column: "ArtigoCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_DefeitoId",
                table: "Movimentos",
                column: "DefeitoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_MaquinaCodigo",
                table: "Movimentos",
                column: "MaquinaCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_ServicoId",
                table: "Movimentos",
                column: "ServicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_TipoMovimentoId",
                table: "Movimentos",
                column: "TipoMovimentoId");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentos_UtilizadorCodigo",
                table: "Movimentos",
                column: "UtilizadorCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_NaoConformes_IdMovimento",
                table: "NaoConformes",
                column: "IdMovimento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Niveis_Descricao",
                table: "Niveis",
                column: "Descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RececoesInspecao_ArtigoCodigo",
                table: "RececoesInspecao",
                column: "ArtigoCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_RececoesInspecao_FornecedorCodigo",
                table: "RececoesInspecao",
                column: "FornecedorCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_RececoesInspecao_SagePedidoId_Linha",
                table: "RececoesInspecao",
                columns: new[] { "SagePedidoId", "Linha" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RececoesInspecao_UtilizadorCodigo",
                table: "RececoesInspecao",
                column: "UtilizadorCodigo");

            migrationBuilder.CreateIndex(
                name: "IX_Retrabalhos_IdMovimento",
                table: "Retrabalhos",
                column: "IdMovimento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Retrabalhos_MaquinaRejeicao",
                table: "Retrabalhos",
                column: "MaquinaRejeicao");

            migrationBuilder.CreateIndex(
                name: "IX_TiposMovimento_Descricao",
                table: "TiposMovimento",
                column: "Descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilizadores_CargoId",
                table: "Utilizadores",
                column: "CargoId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilizadores_Email",
                table: "Utilizadores",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilizadores_NivelId",
                table: "Utilizadores",
                column: "NivelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArtigosCusto");

            migrationBuilder.DropTable(
                name: "AssinaturasDocumento");

            migrationBuilder.DropTable(
                name: "FornecedoresClassificacao");

            migrationBuilder.DropTable(
                name: "JustificacoesNOK");

            migrationBuilder.DropTable(
                name: "NaoConformes");

            migrationBuilder.DropTable(
                name: "Retrabalhos");

            migrationBuilder.DropTable(
                name: "DocumentosTecnicos");

            migrationBuilder.DropTable(
                name: "RececoesInspecao");

            migrationBuilder.DropTable(
                name: "Movimentos");

            migrationBuilder.DropTable(
                name: "Fornecedores");

            migrationBuilder.DropTable(
                name: "Artigos");

            migrationBuilder.DropTable(
                name: "CatalogosDefeito");

            migrationBuilder.DropTable(
                name: "Servicos");

            migrationBuilder.DropTable(
                name: "TiposMovimento");

            migrationBuilder.DropTable(
                name: "Utilizadores");

            migrationBuilder.DropTable(
                name: "DiversosLista");

            migrationBuilder.DropTable(
                name: "Maquinas");

            migrationBuilder.DropTable(
                name: "Cargos");

            migrationBuilder.DropTable(
                name: "Niveis");

            migrationBuilder.DropTable(
                name: "Familias");
        }
    }
}
