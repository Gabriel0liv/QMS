using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    // O DbContext é o "maestro" que gere a ligação entre as classes C# e as tabelas reais no PostgreSQL
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Definimos aqui um DbSet para cada Tabela que criámos. Isto diz ao Entity Framework para mapear as lógicas.
        public DbSet<Utilizador> Utilizadores { get; set; }
        public DbSet<Cargo> Cargos { get; set; }
        public DbSet<Nivel> Niveis { get; set; }
        public DbSet<DocumentoTecnico> DocumentosTecnicos { get; set; }
        public DbSet<AssinaturaDocumento> AssinaturasDocumento { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<FornecedorClassificacao> FornecedoresClassificacao { get; set; }
        public DbSet<Familia> Familias { get; set; }
        public DbSet<Diversos> DiversosLista { get; set; }
        public DbSet<Maquina> Maquinas { get; set; }
        public DbSet<Artigo> Artigos { get; set; }
        public DbSet<ArtigoCusto> ArtigosCusto { get; set; }
        public DbSet<CatalogoDefeito> CatalogosDefeito { get; set; }
        public DbSet<Servico> Servicos { get; set; }
        public DbSet<TipoMovimento> TiposMovimento { get; set; }
        public DbSet<Movimento> Movimentos { get; set; }
        public DbSet<Retrabalho> Retrabalhos { get; set; }
        public DbSet<NaoConforme> NaoConformes { get; set; }
        public DbSet<RececaoInspecao> RececoesInspecao { get; set; }
        public DbSet<JustificacaoNOK> JustificacoesNOK { get; set; }

        // Mapeamento Avançado de Constraints (Restrições)
        // É aqui que dizemos ao banco de dados regras estritas como "esta coluna não pode ter valores repetidos" (UNIQUE).
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Garantir que certos campos são UNIQUE
            modelBuilder.Entity<Utilizador>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Cargo>().HasIndex(c => c.Descricao).IsUnique();
            modelBuilder.Entity<Nivel>().HasIndex(n => n.Descricao).IsUnique();
            modelBuilder.Entity<DocumentoTecnico>().HasIndex(d => d.CaminhoFicheiro).IsUnique();
            modelBuilder.Entity<AssinaturaDocumento>().HasIndex(a => a.AssinaturaHash).IsUnique();
            
            // Garantir que um fornecedor só tem UMA classificação por ano fiscal (Índice Composto)
            modelBuilder.Entity<FornecedorClassificacao>()
                .HasIndex(f => new { f.FornecedorCodigo, f.AnoFiscal })
                .IsUnique();

            modelBuilder.Entity<Familia>().HasIndex(f => f.Codigo).IsUnique();
            modelBuilder.Entity<CatalogoDefeito>().HasIndex(c => c.Codigo).IsUnique();
            modelBuilder.Entity<TipoMovimento>().HasIndex(t => t.Descricao).IsUnique();

            // Garantir que a mesma linha da mesma guia não é inserida duas vezes
            modelBuilder.Entity<RececaoInspecao>()
                .HasIndex(r => new { r.SagePedidoId, r.Linha })
                .IsUnique();

            // Relações Específicas 1:1
            // Garantir a nível do schema que 1 Retrabalho pertence só e apenas a 1 Movimento
            modelBuilder.Entity<Retrabalho>()
                .HasIndex(r => r.IdMovimento).IsUnique();
            
            modelBuilder.Entity<NaoConforme>()
                .HasIndex(n => n.IdMovimento).IsUnique();
        }
    }
}
