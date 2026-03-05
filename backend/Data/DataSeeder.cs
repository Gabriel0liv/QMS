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
                await SeedArtigosAsync(context, Path.Combine(dataFolder, "artigos_QMS_20260304.csv"));
                await SeedCustosArtigoAsync(context, Path.Combine(dataFolder, "ARTIGOS_CUSTO_QMS_20260304.csv"));
                await SeedRececoesAsync(context, Path.Combine(dataFolder, "RECEPCOES_qms_20260304.csv"));
            }
            catch (Exception ex)
            {
                var fullError = GetFullErrorMessage(ex);
                Console.WriteLine("************************************************************");
                Console.WriteLine($"ERRO CRÍTICO NO SEED: {fullError}");
                Console.WriteLine("************************************************************");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }

        private static string GetFullErrorMessage(Exception ex)
        {
            if (ex.InnerException == null) return ex.Message;
            return GetFullErrorMessage(ex.InnerException);
        }

        private static async Task SeedMaquinasAsync(AppDbContext context, string filePath)
        {
            if (!File.Exists(filePath)) return;

            Console.WriteLine("Verificando Máquinas...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) 
            { 
                Delimiter = ";", 
                HasHeaderRecord = false, 
                BadDataFound = null 
            };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            var existingMaqs = await context.Maquinas.Select(m => m.MaquinaCodigo).ToListAsync();
            var maquinasParaInserir = new List<Maquina>();

            while (csv.Read())
            {
                var cod = csv.GetField<string>(0) ?? string.Empty;
                if (existingMaqs.Contains(cod) || maquinasParaInserir.Any(m => m.MaquinaCodigo == cod)) continue;

                var estadoStr = csv.GetField<string>(2)?.Trim().ToLower(); 
                bool isEstadoAtivo = estadoStr != "ina";

                var setorStr = csv.GetField<string>(3)?.Trim(); 
                int? setorId = null;
                if (int.TryParse(setorStr, out int parsedSetor)) setorId = parsedSetor;

                maquinasParaInserir.Add(new Maquina
                {
                    MaquinaCodigo = cod,
                    Descricao = csv.GetField<string>(1) ?? string.Empty,
                    Estado = isEstadoAtivo,
                    Setor = setorId
                });
            }

            if (maquinasParaInserir.Any())
            {
                Console.WriteLine($"Inserindo {maquinasParaInserir.Count} novas Máquinas...");
                await context.Maquinas.AddRangeAsync(maquinasParaInserir);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedFornecedoresAsync(AppDbContext context, string filePath)
        {
            if (!File.Exists(filePath)) return;

            Console.WriteLine("Verificando Fornecedores...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) 
            { 
                Delimiter = ";", 
                HasHeaderRecord = false, 
                BadDataFound = null 
            };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            var existingCodes = await context.Fornecedores.Select(f => f.FornecedorCodigo).ToListAsync();
            var fornecedoresParaInserir = new List<Fornecedor>();
            var anoAtual = DateTime.Now.Year;

            while (csv.Read())
            {
                var cod = csv.GetField<string>(0) ?? string.Empty; 
                if (existingCodes.Contains(cod) || fornecedoresParaInserir.Any(f => f.FornecedorCodigo == cod)) continue;

                var tipoRaw = csv.GetField<string>(2) ?? "Normal";
                var tipoLimpo = tipoRaw.Replace("NormalNormal", "Normal").Replace("ReduzidoReduzido", "Reduzido");

                var fornecedor = new Fornecedor
                {
                    FornecedorCodigo = cod,
                    Nome = csv.GetField<string>(1) ?? "Desconhecido",
                    Morada = null
                };

                fornecedor.Classificacoes.Add(new FornecedorClassificacao
                {
                    AnoFiscal = anoAtual,
                    Classificacao = tipoLimpo
                });

                fornecedoresParaInserir.Add(fornecedor);
            }

            if (fornecedoresParaInserir.Any())
            {
                Console.WriteLine($"Inserindo {fornecedoresParaInserir.Count} novos Fornecedores...");
                await context.Fornecedores.AddRangeAsync(fornecedoresParaInserir);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedArtigosAsync(AppDbContext context, string filePath)
        {
            if (!File.Exists(filePath)) return;

            Console.WriteLine("Verificando Artigos (Processo de longa duração)...");
            var config = new CsvConfiguration(CultureInfo.InvariantCulture) 
            { 
                Delimiter = ";", 
                HasHeaderRecord = false, 
                BadDataFound = null 
            };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            var existingArtigos = (await context.Artigos.Select(a => a.ArtigoCodigo).ToListAsync()).ToHashSet();
            
            // Fix: Handle potential duplicates in DB when loading cache (e.g. from previous interrupted seeds)
            var cacheFamilias = (await context.Familias.ToListAsync())
                                .GroupBy(f => f.Codigo)
                                .ToDictionary(g => g.Key, g => g.First());
                                

            var cacheMaquinas = (await context.Maquinas.Select(m => m.MaquinaCodigo).ToListAsync()).ToHashSet();
            
            var batch = new List<Artigo>();
            int processados = 0;

            while (csv.Read())
            {
                var cod = csv.GetField<string>(0) ?? string.Empty; 
                if (existingArtigos.Contains(cod) || batch.Any(a => a.ArtigoCodigo == cod)) continue;

                var codFamilia = csv.GetField<string>(3) ?? "DIV";
                if (!cacheFamilias.TryGetValue(codFamilia, out var familiaObj))
                {
                    familiaObj = new Familia { Codigo = codFamilia, Descricao = csv.GetField<string>(5) ?? "Família Desconhecida" };
                    cacheFamilias[codFamilia] = familiaObj;
                    context.Familias.Add(familiaObj);
                }


                var maquinaCod = csv.GetField<string>(4) ?? string.Empty;
                if (string.IsNullOrWhiteSpace(maquinaCod)) maquinaCod = "ND";

                if (!cacheMaquinas.Contains(maquinaCod))
                {
                    context.Maquinas.Add(new Maquina { 
                        MaquinaCodigo = maquinaCod, 
                        Descricao = $"Máquina {maquinaCod} (Auto-Gerada)", 
                        Estado = true 
                    });
                    cacheMaquinas.Add(maquinaCod);
                }

                decimal.TryParse(csv.GetField<string>(6)?.Replace(".", ","), out decimal pesoDecimal);

                batch.Add(new Artigo
                {
                    ArtigoCodigo = cod,
                    Descricao = csv.GetField<string>(1) ?? string.Empty,
                    Categoria = csv.GetField<string>(2),
                    Unidade = csv.GetField<string>(8) ?? "UN",
                    Peso = pesoDecimal,
                    Familia = familiaObj,
                    MaquinaCodigo = maquinaCod
                });

                if (batch.Count >= 500)
                {
                    await context.Artigos.AddRangeAsync(batch);
                    await context.SaveChangesAsync();
                    processados += batch.Count;
                    Console.WriteLine($"Importados {processados} artigos...");
                    batch.Clear();
                }
            }

            if (batch.Any())
            {
                await context.Artigos.AddRangeAsync(batch);
                await context.SaveChangesAsync();
                Console.WriteLine("Concluída a importação de Artigos.");
            }
        }

        private static async Task SeedCustosArtigoAsync(AppDbContext context, string filePath)
        {
            if (!File.Exists(filePath)) return;

            Console.WriteLine("Iniciando importação de Custos...");
            if (await context.ArtigosCusto.AnyAsync()) 
            {
                Console.WriteLine("Histórico de Custos já existe. Ignorando...");
                return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture) 
            { 
                Delimiter = ";", 
                HasHeaderRecord = false, 
                BadDataFound = null 
            };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            var batch = new List<ArtigoCusto>();
            var existingArtigos = (await context.Artigos.Select(a => a.ArtigoCodigo).ToListAsync()).ToHashSet();

            while (csv.Read())
            {
                var artigoCod = csv.GetField<string>(0) ?? string.Empty;
                if (!existingArtigos.Contains(artigoCod)) continue; // Skip if article doesn't exist

                decimal.TryParse(csv.GetField<string>(8)?.Replace(".", ","), out decimal preTotal); 
                decimal.TryParse(csv.GetField<string>(3)?.Replace(".", ","), out decimal matPrima); 
                decimal.TryParse(csv.GetField<string>(7)?.Replace(".", ","), out decimal energia); 
                decimal.TryParse(csv.GetField<string>(5)?.Replace(".", ","), out decimal mobra);   
                decimal.TryParse(csv.GetField<string>(4)?.Replace(".", ","), out decimal mqna);    
                
                DateTime.TryParse(csv.GetField<string>(1), out DateTime dtInicio);
                DateTime? dtFim = null;
                var dtFimStr = csv.GetField<string>(2);
                if (!string.IsNullOrEmpty(dtFimStr) && DateTime.TryParse(dtFimStr, out DateTime pFim)) dtFim = pFim;

                batch.Add(new ArtigoCusto
                {
                    ArtigoCodigo = artigoCod,
                    DataInicio = DateTime.SpecifyKind(dtInicio, DateTimeKind.Utc),
                    DataFim = dtFim.HasValue ? DateTime.SpecifyKind(dtFim.Value, DateTimeKind.Utc) : null,
                    PriTotal = preTotal,
                    PraMatprim = matPrima,
                    PrecoEnergia = energia,
                    PrwiMaoobra = mobra,
                    PruMaquina = mqna,
                    CustoPintura = 0
                });

                if (batch.Count >= 1000)
                {
                    await context.ArtigosCusto.AddRangeAsync(batch);
                    await context.SaveChangesAsync();
                    batch.Clear();
                }
            }
            if (batch.Any())
            {
                await context.ArtigosCusto.AddRangeAsync(batch);
                await context.SaveChangesAsync();
            }
            Console.WriteLine("Concluída a importação de Custos.");
        }

        private static async Task SeedRececoesAsync(AppDbContext context, string filePath)
        {
            if (!File.Exists(filePath)) return;

            Console.WriteLine("Iniciando importação de Receções...");
            if (await context.RececoesInspecao.AnyAsync()) 
            {
                 Console.WriteLine("Receções já existem. Ignorando...");
                 return;
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture) 
            { 
                Delimiter = ";", 
                HasHeaderRecord = false, 
                BadDataFound = null 
            };
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            
            var utilAdmin = await context.Utilizadores.FirstOrDefaultAsync(u => u.UtilizadorCodigo == "ADMIN_SYS");
            if (utilAdmin == null)
            {
                utilAdmin = new Utilizador
                {
                    UtilizadorCodigo = "ADMIN_SYS",
                    Nome = "Sistema Importação SAGE",
                    Email = "sistema@empresa.com",
                    Cargo = await context.Cargos.FirstOrDefaultAsync() ?? new Cargo { Descricao = "Sistema" },
                    Nivel = await context.Niveis.FirstOrDefaultAsync() ?? new Nivel { Descricao = "Admin" }
                };
                context.Utilizadores.Add(utilAdmin);
                await context.SaveChangesAsync();
            }

            var existingArtigos = (await context.Artigos.Select(a => a.ArtigoCodigo).ToListAsync()).ToHashSet();
            var existingFornecedores = (await context.Fornecedores.Select(f => f.FornecedorCodigo).ToListAsync()).ToHashSet();
            
            // Carregar receções existentes na BD indexadas por (SagePedidoId, Linha)
            var existingRececoes = await context.RececoesInspecao
                .ToDictionaryAsync(r => (r.SagePedidoId, r.Linha));

            // Chaves que vieram neste export do SAGE (para detetar cancelamentos)
            var sageKeys = new HashSet<(string, int)>();

            bool isFirstImport = !existingRececoes.Any();
            var toAdd = new List<RececaoInspecao>();
            
            while (csv.Read())
            {
                var artigoCod = csv.GetField<string>(3) ?? string.Empty;
                var fornecedorCod = csv.GetField<string>(2) ?? string.Empty;

                if (!existingArtigos.Contains(artigoCod)) continue;
                if (!existingFornecedores.Contains(fornecedorCod)) continue;

                var idPedido = csv.GetField<string>(0) ?? string.Empty;
                var linhaStr = csv.GetField<string>(9);
                int.TryParse(linhaStr, out int linha);
                var key = (idPedido, linha);
                sageKeys.Add(key);

                decimal.TryParse(csv.GetField<string>(5)?.Replace(".", ","), out decimal qt); 
                decimal.TryParse(csv.GetField<string>(4)?.Replace(".", ","), out decimal preco);   
                DateTime.TryParse(csv.GetField<string>(8), out DateTime dt);
                var dtUtc = DateTime.SpecifyKind(dt, DateTimeKind.Utc);

                if (existingRececoes.TryGetValue(key, out var existing))
                {
                    // Já existe — só atualizar se ainda Pendente (não tocar em Inspecionado/Cancelado)
                    if (existing.Estado == "Pendente")
                    {
                        existing.QtdTotalRecebida = qt;
                        existing.Quantidade = qt;
                        existing.CustoUnitarioMomento = preco;
                        existing.DataRececao = dtUtc;
                    }
                }
                else
                {
                    // Novo registo — primeiro import = Inspecionado (histórico), restantes = Pendente
                    toAdd.Add(new RececaoInspecao
                    {
                        SagePedidoId = idPedido, 
                        Linha = linha,
                        DataRececao = dtUtc,
                        QtdTotalRecebida = qt,
                        Quantidade = qt,
                        Estado = isFirstImport ? "Inspecionado" : "Pendente",
                        DecisaoFinal = isFirstImport ? "Aprovado" : null,
                        CustoUnitarioMomento = preco,
                        Unidade = "UN",
                        FornecedorCodigo = fornecedorCod, 
                        ArtigoCodigo = artigoCod,    
                        UtilizadorCodigo = utilAdmin.UtilizadorCodigo
                    });
                }
            }

            // Detetar cancelamentos: receções Pendentes que já não aparecem no SAGE
            int canceladas = 0;
            foreach (var (key, rececao) in existingRececoes)
            {
                if (rececao.Estado == "Pendente" && !sageKeys.Contains(key))
                {
                    rececao.Estado = "Cancelado";
                    canceladas++;
                }
            }

            // Guardar tudo em batches
            for (int i = 0; i < toAdd.Count; i += 500)
            {
                var batch = toAdd.Skip(i).Take(500).ToList();
                await context.RececoesInspecao.AddRangeAsync(batch);
                await context.SaveChangesAsync();
            }
            await context.SaveChangesAsync(); // guardar updates e cancelamentos

            Console.WriteLine($"Receções importadas: {toAdd.Count} novas, {canceladas} canceladas.");
        }
    }
}
