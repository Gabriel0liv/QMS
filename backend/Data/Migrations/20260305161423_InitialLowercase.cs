using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialLowercase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cargos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cargos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "catalogosdefeito",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    codigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_catalogosdefeito", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "familias",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    codigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    parametrosinspecao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_familias", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fornecedores",
                columns: table => new
                {
                    fornecedorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    morada = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fornecedores", x => x.fornecedorcodigo);
                });

            migrationBuilder.CreateTable(
                name: "maquinas",
                columns: table => new
                {
                    maquinacodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    estado = table.Column<bool>(type: "boolean", nullable: false),
                    precousinagem = table.Column<decimal>(type: "numeric", nullable: false),
                    precomaoobra = table.Column<decimal>(type: "numeric", nullable: false),
                    precoenergia = table.Column<decimal>(type: "numeric", nullable: false),
                    setor = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_maquinas", x => x.maquinacodigo);
                });

            migrationBuilder.CreateTable(
                name: "niveis",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_niveis", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "servicos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    custodecapar = table.Column<decimal>(type: "numeric", nullable: false),
                    valor = table.Column<decimal>(type: "numeric", nullable: false),
                    datainicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    datafim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_servicos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tiposmovimento",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tiposmovimento", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fornecedoresclassificacao",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    anofiscal = table.Column<int>(type: "integer", nullable: false),
                    classificacao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    fornecedorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fornecedoresclassificacao", x => x.id);
                    table.ForeignKey(
                        name: "fk_fornecedoresclassificacao_fornecedores_fornecedorcodigo",
                        column: x => x.fornecedorcodigo,
                        principalTable: "fornecedores",
                        principalColumn: "fornecedorcodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "artigos",
                columns: table => new
                {
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    descricao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    unidade = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    peso = table.Column<decimal>(type: "numeric", nullable: false),
                    categoria = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    familiaid = table.Column<int>(type: "integer", nullable: false),
                    maquinacodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_artigos", x => x.artigocodigo);
                    table.ForeignKey(
                        name: "fk_artigos_familias_familiaid",
                        column: x => x.familiaid,
                        principalTable: "familias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_artigos_maquinas_maquinacodigo",
                        column: x => x.maquinacodigo,
                        principalTable: "maquinas",
                        principalColumn: "maquinacodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "utilizadores",
                columns: table => new
                {
                    utilizadorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    nome = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    active = table.Column<bool>(type: "boolean", nullable: false),
                    cargoid = table.Column<int>(type: "integer", nullable: false),
                    nivelid = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_utilizadores", x => x.utilizadorcodigo);
                    table.ForeignKey(
                        name: "fk_utilizadores_cargos_cargoid",
                        column: x => x.cargoid,
                        principalTable: "cargos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_utilizadores_niveis_nivelid",
                        column: x => x.nivelid,
                        principalTable: "niveis",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "artigoscusto",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    datainicio = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    datafim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    pritotal = table.Column<decimal>(type: "numeric", nullable: false),
                    pramatprim = table.Column<decimal>(type: "numeric", nullable: false),
                    precoenergia = table.Column<decimal>(type: "numeric", nullable: false),
                    prwimaoobra = table.Column<decimal>(type: "numeric", nullable: false),
                    prumaquina = table.Column<decimal>(type: "numeric", nullable: false),
                    custopintura = table.Column<decimal>(type: "numeric", nullable: false),
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_artigoscusto", x => x.id);
                    table.ForeignKey(
                        name: "fk_artigoscusto_artigos_artigocodigo",
                        column: x => x.artigocodigo,
                        principalTable: "artigos",
                        principalColumn: "artigocodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "diversoslista",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    propriedade = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    valor = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    familiaid = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_diversoslista", x => x.id);
                    table.ForeignKey(
                        name: "fk_diversoslista_artigos_artigocodigo",
                        column: x => x.artigocodigo,
                        principalTable: "artigos",
                        principalColumn: "artigocodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_diversoslista_familias_familiaid",
                        column: x => x.familiaid,
                        principalTable: "familias",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "documentostecnicos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    tipodocumento = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    caminhoficheiro = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    isoficial = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_documentostecnicos", x => x.id);
                    table.ForeignKey(
                        name: "fk_documentostecnicos_artigos_artigocodigo",
                        column: x => x.artigocodigo,
                        principalTable: "artigos",
                        principalColumn: "artigocodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "movimentos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    estado = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    localizacao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    datamovimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    descontar = table.Column<bool>(type: "boolean", nullable: false),
                    observacoes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    utilizadorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    maquinacodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    tipomovimentoid = table.Column<int>(type: "integer", nullable: false),
                    servicoid = table.Column<int>(type: "integer", nullable: true),
                    defeitoid = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_movimentos", x => x.id);
                    table.ForeignKey(
                        name: "fk_movimentos_artigos_artigocodigo",
                        column: x => x.artigocodigo,
                        principalTable: "artigos",
                        principalColumn: "artigocodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_movimentos_catalogosdefeito_defeitoid",
                        column: x => x.defeitoid,
                        principalTable: "catalogosdefeito",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_movimentos_maquinas_maquinacodigo",
                        column: x => x.maquinacodigo,
                        principalTable: "maquinas",
                        principalColumn: "maquinacodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_movimentos_servicos_servicoid",
                        column: x => x.servicoid,
                        principalTable: "servicos",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_movimentos_tiposmovimento_tipomovimentoid",
                        column: x => x.tipomovimentoid,
                        principalTable: "tiposmovimento",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_movimentos_utilizadores_utilizadorcodigo",
                        column: x => x.utilizadorcodigo,
                        principalTable: "utilizadores",
                        principalColumn: "utilizadorcodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rececoesinspecao",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sagepedidoid = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    linha = table.Column<int>(type: "integer", nullable: false),
                    datarececao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    qtdtotalrecebida = table.Column<decimal>(type: "numeric", nullable: false),
                    estado = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    decisaofinal = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    custounitariomomento = table.Column<decimal>(type: "numeric", nullable: false),
                    fatura = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    unidade = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    quantidade = table.Column<decimal>(type: "numeric", nullable: false),
                    fornecedorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    artigocodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    utilizadorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rececoesinspecao", x => x.id);
                    table.ForeignKey(
                        name: "fk_rececoesinspecao_artigos_artigocodigo",
                        column: x => x.artigocodigo,
                        principalTable: "artigos",
                        principalColumn: "artigocodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_rececoesinspecao_fornecedores_fornecedorcodigo",
                        column: x => x.fornecedorcodigo,
                        principalTable: "fornecedores",
                        principalColumn: "fornecedorcodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_rececoesinspecao_utilizadores_utilizadorcodigo",
                        column: x => x.utilizadorcodigo,
                        principalTable: "utilizadores",
                        principalColumn: "utilizadorcodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "assinaturasdocumento",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    departamentoassinatura = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    assinaturahash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    dataassinatura = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    documentoid = table.Column<int>(type: "integer", nullable: false),
                    utilizadorcodigo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_assinaturasdocumento", x => x.id);
                    table.ForeignKey(
                        name: "fk_assinaturasdocumento_documentostecnicos_documentoid",
                        column: x => x.documentoid,
                        principalTable: "documentostecnicos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_assinaturasdocumento_utilizadores_utilizadorcodigo",
                        column: x => x.utilizadorcodigo,
                        principalTable: "utilizadores",
                        principalColumn: "utilizadorcodigo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "naoconformes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    dataregisto = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    qtdsage = table.Column<decimal>(type: "numeric", nullable: false),
                    idmovimento = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_naoconformes", x => x.id);
                    table.ForeignKey(
                        name: "fk_naoconformes_movimentos_idmovimento",
                        column: x => x.idmovimento,
                        principalTable: "movimentos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "retrabalhos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    setoridentificado = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    acaoexecutar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    dataretrabalho = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    tempominutos = table.Column<decimal>(type: "numeric", nullable: false),
                    custoretrabalho = table.Column<decimal>(type: "numeric", nullable: true),
                    custorejeicao = table.Column<decimal>(type: "numeric", nullable: true),
                    custonc = table.Column<decimal>(type: "numeric", nullable: true),
                    maquinarejeicao = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    idmovimento = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_retrabalhos", x => x.id);
                    table.ForeignKey(
                        name: "fk_retrabalhos_maquinas_maquinarejeicao",
                        column: x => x.maquinarejeicao,
                        principalTable: "maquinas",
                        principalColumn: "maquinacodigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_retrabalhos_movimentos_idmovimento",
                        column: x => x.idmovimento,
                        principalTable: "movimentos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "justificacoesnok",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    qtdafetada = table.Column<decimal>(type: "numeric", nullable: false),
                    observacoes = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    rececaoid = table.Column<int>(type: "integer", nullable: false),
                    defeitoid = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_justificacoesnok", x => x.id);
                    table.ForeignKey(
                        name: "fk_justificacoesnok_catalogosdefeito_defeitoid",
                        column: x => x.defeitoid,
                        principalTable: "catalogosdefeito",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_justificacoesnok_rececoesinspecao_rececaoid",
                        column: x => x.rececaoid,
                        principalTable: "rececoesinspecao",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_artigos_familiaid",
                table: "artigos",
                column: "familiaid");

            migrationBuilder.CreateIndex(
                name: "ix_artigos_maquinacodigo",
                table: "artigos",
                column: "maquinacodigo");

            migrationBuilder.CreateIndex(
                name: "ix_artigoscusto_artigocodigo",
                table: "artigoscusto",
                column: "artigocodigo");

            migrationBuilder.CreateIndex(
                name: "ix_assinaturasdocumento_assinaturahash",
                table: "assinaturasdocumento",
                column: "assinaturahash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_assinaturasdocumento_documentoid",
                table: "assinaturasdocumento",
                column: "documentoid");

            migrationBuilder.CreateIndex(
                name: "ix_assinaturasdocumento_utilizadorcodigo",
                table: "assinaturasdocumento",
                column: "utilizadorcodigo");

            migrationBuilder.CreateIndex(
                name: "ix_cargos_descricao",
                table: "cargos",
                column: "descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_catalogosdefeito_codigo",
                table: "catalogosdefeito",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_diversoslista_artigocodigo_propriedade",
                table: "diversoslista",
                columns: new[] { "artigocodigo", "propriedade" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_diversoslista_familiaid",
                table: "diversoslista",
                column: "familiaid");

            migrationBuilder.CreateIndex(
                name: "ix_documentostecnicos_artigocodigo",
                table: "documentostecnicos",
                column: "artigocodigo");

            migrationBuilder.CreateIndex(
                name: "ix_documentostecnicos_caminhoficheiro",
                table: "documentostecnicos",
                column: "caminhoficheiro",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_familias_codigo",
                table: "familias",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_fornecedoresclassificacao_fornecedorcodigo_anofiscal",
                table: "fornecedoresclassificacao",
                columns: new[] { "fornecedorcodigo", "anofiscal" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_justificacoesnok_defeitoid",
                table: "justificacoesnok",
                column: "defeitoid");

            migrationBuilder.CreateIndex(
                name: "ix_justificacoesnok_rececaoid",
                table: "justificacoesnok",
                column: "rececaoid");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_artigocodigo",
                table: "movimentos",
                column: "artigocodigo");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_defeitoid",
                table: "movimentos",
                column: "defeitoid");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_maquinacodigo",
                table: "movimentos",
                column: "maquinacodigo");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_servicoid",
                table: "movimentos",
                column: "servicoid");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_tipomovimentoid",
                table: "movimentos",
                column: "tipomovimentoid");

            migrationBuilder.CreateIndex(
                name: "ix_movimentos_utilizadorcodigo",
                table: "movimentos",
                column: "utilizadorcodigo");

            migrationBuilder.CreateIndex(
                name: "ix_naoconformes_idmovimento",
                table: "naoconformes",
                column: "idmovimento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_niveis_descricao",
                table: "niveis",
                column: "descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_rececoesinspecao_artigocodigo",
                table: "rececoesinspecao",
                column: "artigocodigo");

            migrationBuilder.CreateIndex(
                name: "ix_rececoesinspecao_fornecedorcodigo",
                table: "rececoesinspecao",
                column: "fornecedorcodigo");

            migrationBuilder.CreateIndex(
                name: "ix_rececoesinspecao_sagepedidoid_linha",
                table: "rececoesinspecao",
                columns: new[] { "sagepedidoid", "linha" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_rececoesinspecao_utilizadorcodigo",
                table: "rececoesinspecao",
                column: "utilizadorcodigo");

            migrationBuilder.CreateIndex(
                name: "ix_retrabalhos_idmovimento",
                table: "retrabalhos",
                column: "idmovimento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_retrabalhos_maquinarejeicao",
                table: "retrabalhos",
                column: "maquinarejeicao");

            migrationBuilder.CreateIndex(
                name: "ix_tiposmovimento_descricao",
                table: "tiposmovimento",
                column: "descricao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_utilizadores_cargoid",
                table: "utilizadores",
                column: "cargoid");

            migrationBuilder.CreateIndex(
                name: "ix_utilizadores_email",
                table: "utilizadores",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_utilizadores_nivelid",
                table: "utilizadores",
                column: "nivelid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "artigoscusto");

            migrationBuilder.DropTable(
                name: "assinaturasdocumento");

            migrationBuilder.DropTable(
                name: "diversoslista");

            migrationBuilder.DropTable(
                name: "fornecedoresclassificacao");

            migrationBuilder.DropTable(
                name: "justificacoesnok");

            migrationBuilder.DropTable(
                name: "naoconformes");

            migrationBuilder.DropTable(
                name: "retrabalhos");

            migrationBuilder.DropTable(
                name: "documentostecnicos");

            migrationBuilder.DropTable(
                name: "rececoesinspecao");

            migrationBuilder.DropTable(
                name: "movimentos");

            migrationBuilder.DropTable(
                name: "fornecedores");

            migrationBuilder.DropTable(
                name: "artigos");

            migrationBuilder.DropTable(
                name: "catalogosdefeito");

            migrationBuilder.DropTable(
                name: "servicos");

            migrationBuilder.DropTable(
                name: "tiposmovimento");

            migrationBuilder.DropTable(
                name: "utilizadores");

            migrationBuilder.DropTable(
                name: "familias");

            migrationBuilder.DropTable(
                name: "maquinas");

            migrationBuilder.DropTable(
                name: "cargos");

            migrationBuilder.DropTable(
                name: "niveis");
        }
    }
}
