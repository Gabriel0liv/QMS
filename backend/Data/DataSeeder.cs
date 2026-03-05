using System.Globalization;
using backend.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(AppDbContext context, string dataFolder)
        {
            // Tenta aplicar as migrações e criar as tabelas se não existirem
            await context.Database.MigrateAsync();

            try
            {
                await SeedMaquinasAsync(context, Path.Combine(dataFolder, "MAQUINAS_qms_20260304.csv"));
                await SeedFornecedoresAsync(context, Path.Combine(dataFolder, "FORNECEDORES_qms_20260304.csv"));
                // O ficheiro de artigos irá criar também as Famílias e os "Diversos" em cascata
                await SeedArtigosAsync(context, Path.Combine(dataFolder, "artigos_QMS_20260304.csv"));
                await SeedCustosArtigoAsync(context, Path.Combine(dataFolder, "ARTIGOS_CUSTO_QMS_20260304.csv"));
                await SeedRececoesAsync(context, Path.Combine(dataFolder, "RECEPCOES_qms_20260304.csv"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro crítico durante a importação de dados (Seed): {ex.Message}");
            }
        }

        private static async Task SeedMaquinasAsync(AppDbContext context, string filePath)
        {
            if (await context.Maquinas.AnyAsync() || !File.Exists(filePath)) return;

            Console.WriteLine("Importando Máquinas...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";", BadDataFound = null };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            csv.Read();
            csv.ReadHeader();

            var maquinas = new List<Maquina>();
            while (csv.Read())
            {
                var estadoStr = csv.GetField<string>("ESTADO")?.Trim().ToLower();
                // Estado: Se for "ina" é false (inativo), se for vazio ou outro assume ativo
                bool isEstadoAtivo = estadoStr != "ina";

                var setorStr = csv.GetField<string>("SETOR")?.Trim();
                // O Setor vindo do SAGE (ex "15APA") seria texto no CSV mas int no bd.md - Se não for conversível para INT, guardamos null
                int? setorId = null;
                if (int.TryParse(setorStr, out int parsedSetor)) setorId = parsedSetor;

                maquinas.Add(new Maquina
                {
                    MaquinaCodigo = csv.GetField<string>("MAQ") ?? string.Empty,
                    Descricao = csv.GetField<string>("DESCRICAMAQ") ?? string.Empty,
                    Estado = isEstadoAtivo,
                    Setor = setorId
                });
            }

            await context.Maquinas.AddRangeAsync(maquinas);
            await context.SaveChangesAsync();
        }

        private static async Task SeedFornecedoresAsync(AppDbContext context, string filePath)
        {
            if (await context.Fornecedores.AnyAsync() || !File.Exists(filePath)) return;

            Console.WriteLine("Importando Fornecedores...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";", BadDataFound = null };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            csv.Read();
            csv.ReadHeader();

            var fornecedores = new List<Fornecedor>();
            var anoAtual = DateTime.Now.Year;

            while (csv.Read())
            {
                var codigo = csv.GetField<string>("BPSNUM_0") ?? string.Empty;
                var tipoRaw = csv.GetField<string>("TIPO_0") ?? "Normal";
                
                // Limpeza de Tipos Duplicados do SAGE (Ex: "NormalNormal")
                var tipoLimpo = tipoRaw.Replace("NormalNormal", "Normal").Replace("ReduzidoReduzido", "Reduzido");

                var fornecedor = new Fornecedor
                {
                    FornecedorCodigo = codigo,
                    Nome = csv.GetField<string>("BPSNAM_0") ?? "Desconhecido",
                    Morada = null
                };

                // Adiciona imediatamente uma classificação inicial para este Fornecedor
                fornecedor.Classificacoes.Add(new FornecedorClassificacao
                {
                    AnoFiscal = anoAtual,
                    Classificacao = tipoLimpo
                });

                fornecedores.Add(fornecedor);
            }

            await context.Fornecedores.AddRangeAsync(fornecedores);
            await context.SaveChangesAsync();
        }

        private static async Task SeedArtigosAsync(AppDbContext context, string filePath)
        {
            if (await context.Artigos.AnyAsync() || !File.Exists(filePath)) return;

            Console.WriteLine("Importando Artigos, Famílias e Diversos...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";", BadDataFound = null };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            csv.Read();
            csv.ReadHeader();

            var cacheFamilias = new Dictionary<string, Familia>();
            var cacheDiversos = new Dictionary<string, Diversos>();
            var listaArtigos = new List<Artigo>();

            while (csv.Read())
            {
                var codFamilia = csv.GetField<string>("Familia_cod") ?? "DIV";
                var descFamilia = csv.GetField<string>("Familia_desc") ?? "Família Desconhecida";
                
                // 1. Garante que a Família Existe
                if (!cacheFamilias.TryGetValue(codFamilia, out var familiaObj))
                {
                    familiaObj = new Familia { Codigo = codFamilia, Descricao = descFamilia };
                    cacheFamilias[codFamilia] = familiaObj;
                    context.Familias.Add(familiaObj);
                }

                // 2. Garante que um item "Diversos" existe (agora independente da Família)
                var diversosKey = "GERAL"; // Como já não depende da família, crio um default geral ou baseado nalgum logic
                if (!cacheDiversos.TryGetValue(diversosKey, out var diversoObj))
                {
                    diversoObj = new Diversos { Descricao = "Diverso Padrão GERAL" };
                    cacheDiversos[diversosKey] = diversoObj;
                    context.DiversosLista.Add(diversoObj);
                }

                // 3. Lê o Peso (Lidar com conversões numéricas)
                var pesoStr = csv.GetField<string>("peso");
                decimal.TryParse(pesoStr?.Replace(".", ","), out decimal pesoDecimal);

                listaArtigos.Add(new Artigo
                {
                    ArtigoCodigo = csv.GetField<string>("cod") ?? string.Empty,
                    Descricao = csv.GetField<string>("descriccao") ?? string.Empty,
                    Categoria = csv.GetField<string>("categoria"),
                    Unidade = csv.GetField<string>("Unidade") ?? "UN",
                    Peso = pesoDecimal,
                    Familia = familiaObj,  // Relaciona com a Família diretamente
                    Diversos = diversoObj, // Relaciona com Diversos
                    MaquinaCodigo = csv.GetField<string>("maq") ?? string.Empty
                });
            }

            await context.Artigos.AddRangeAsync(listaArtigos);
            await context.SaveChangesAsync();
        }

        private static async Task SeedCustosArtigoAsync(AppDbContext context, string filePath)
        {
            if (await context.ArtigosCusto.AnyAsync() || !File.Exists(filePath)) return;

            Console.WriteLine("Importando Histórico de Custos...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";", BadDataFound = null };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            csv.Read();
            csv.ReadHeader();

            var listaCustos = new List<ArtigoCusto>();

            while (csv.Read())
            {
                // Se falhar o parse numérico, default é 0
                decimal.TryParse(csv.GetField<string>("precototal")?.Replace(".", ","), out decimal preTotal);
                decimal.TryParse(csv.GetField<string>("matprima")?.Replace(".", ","), out decimal matPrima);
                decimal.TryParse(csv.GetField<string>("energia")?.Replace(".", ","), out decimal energia);
                decimal.TryParse(csv.GetField<string>("mobra")?.Replace(".", ","), out decimal mobra);
                decimal.TryParse(csv.GetField<string>("maquina")?.Replace(".", ","), out decimal mqna);
                
                var dataInicioStr = csv.GetField<string>("DATAINICIO_0");
                DateTime dtInicio = DateTime.MinValue;
                if (!string.IsNullOrEmpty(dataInicioStr)) DateTime.TryParse(dataInicioStr, out dtInicio);

                var dataFimStr = csv.GetField<string>("DATAFIM_0");
                DateTime? dtFim = null;
                if (!string.IsNullOrEmpty(dataFimStr))
                {
                    if (DateTime.TryParse(dataFimStr, out DateTime pFim)) dtFim = pFim;
                }

                listaCustos.Add(new ArtigoCusto
                {
                    ArtigoCodigo = csv.GetField<string>("cod") ?? string.Empty,
                    DataInicio = dtInicio,
                    DataFim = dtFim,
                    PriTotal = preTotal,
                    PraMatprim = matPrima,
                    PrecoEnergia = energia,
                    PrwiMaoobra = mobra,
                    PruMaquina = mqna,
                    CustoPintura = 0 // O CSV não disponibiliza este campo isolado
                });
            }

            await context.ArtigosCusto.AddRangeAsync(listaCustos);
            await context.SaveChangesAsync();
        }

        private static async Task SeedRececoesAsync(AppDbContext context, string filePath)
        {
            if (await context.RececoesInspecao.AnyAsync() || !File.Exists(filePath)) return;

            Console.WriteLine("Importando Receções/Guias de Entrada...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) { Delimiter = ";", BadDataFound = null };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            csv.Read();
            csv.ReadHeader();

            // Precisamos garantir que existe um Utilizador por defeito só para associar estas importações Históricas
            var utilAdmin = await context.Utilizadores.FirstOrDefaultAsync(u => u.UtilizadorCodigo == "ADMIN_SYS");
            if (utilAdmin == null)
            {
                var cargo = await context.Cargos.FirstOrDefaultAsync() ?? new Cargo { Descricao = "Importação Sistema" };
                var nivel = await context.Niveis.FirstOrDefaultAsync() ?? new Nivel { Descricao = "Admin" };
                utilAdmin = new Utilizador
                {
                    UtilizadorCodigo = "ADMIN_SYS",
                    Nome = "Sistema Importação SAGE",
                    Email = "sistema@empresa.com",
                    Cargo = cargo,
                    Nivel = nivel
                };
                context.Utilizadores.Add(utilAdmin);
                await context.SaveChangesAsync();
            }

            var listaRececoes = new List<RececaoInspecao>();

            while (csv.Read())
            {
                decimal.TryParse(csv.GetField<string>("QT")?.Replace(".", ","), out decimal qtdRecebida);
                decimal.TryParse(csv.GetField<string>("PRECO")?.Replace(".", ","), out decimal precoUni);
                int.TryParse(csv.GetField<string>("LINHA"), out int linha);

                var dataMovStr = csv.GetField<string>("DATAMOV");
                DateTime dtMovimento = DateTime.Now;
                if (!string.IsNullOrEmpty(dataMovStr)) DateTime.TryParse(dataMovStr, out dtMovimento);

                // Regra do Utilizador: Entram todas com Estado Aprovado (Inspecionadas)
                listaRececoes.Add(new RececaoInspecao
                {
                    SagePedidoId = csv.GetField<string>("RECEPRION") ?? string.Empty,
                    Linha = linha,
                    DataRececao = dtMovimento,
                    QtdTotalRecebida = qtdRecebida,
                    Quantidade = qtdRecebida, // Na primeira carga assume-se quantidade inspecionada igual à recebida
                    DecisaoFinal = "Aprovado", // Por ordem do utilizador
                    CustoUnitarioMomento = precoUni,
                    Unidade = "UN", // Fallback (já que não há campo unidade no CSV de receções)
                    FornecedorCodigo = csv.GetField<string>("TERCEIRO") ?? string.Empty,
                    ArtigoCodigo = csv.GetField<string>("COD") ?? string.Empty,
                    UtilizadorCodigo = utilAdmin.UtilizadorCodigo
                });
            }

            await context.RececoesInspecao.AddRangeAsync(listaRececoes);
            await context.SaveChangesAsync();
        }
    }
}
