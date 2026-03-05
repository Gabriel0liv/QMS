using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Movimentos" na base de dados (Entradas/Saídas de stock, etc)
    public class Movimento
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Estado do Movimento
        [Required]
        [MaxLength(255)]
        public string Estado { get; set; } = string.Empty;

        // Localização física (Armazém/Prateleira)
        [Required]
        [MaxLength(255)]
        public string Localizacao { get; set; } = string.Empty;

        // Data em que o movimento ocorreu
        [Required]
        public DateTime DataMovimento { get; set; }

        // Quantidade movimentada (pode ser decimal para KGs ou metragens)
        [Required]
        public decimal Quantidade { get; set; }

        // Flag indicando se este movimento deve descontar do stock principal
        [Required]
        public bool Descontar { get; set; }

        // Observações opcionais
        [MaxLength(255)]
        public string? Observacoes { get; set; }

        // Chave Estrangeira (FK) -> Utilizador
        [Required]
        [MaxLength(255)]
        public string UtilizadorCodigo { get; set; } = string.Empty;

        [ForeignKey("UtilizadorCodigo")]
        public Utilizador? Utilizador { get; set; }

        // Chave Estrangeira (FK) -> Artigo
        [Required]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        [ForeignKey("ArtigoCodigo")]
        public Artigo? Artigo { get; set; }

        // Chave Estrangeira (FK) -> Maquina
        [Required]
        [MaxLength(255)]
        public string MaquinaCodigo { get; set; } = string.Empty;

        [ForeignKey("MaquinaCodigo")]
        public Maquina? Maquina { get; set; }

        // Chave Estrangeira (FK) -> TipoMovimento (No BD.md chamava-se 'tipo')
        [Required]
        public int TipoMovimentoId { get; set; }

        [ForeignKey("TipoMovimentoId")]
        public TipoMovimento? Tipo { get; set; }

        // Chave Estrangeira Opcional (FK) -> Servicos
        public int? ServicoId { get; set; }

        [ForeignKey("ServicoId")]
        public Servico? Servico { get; set; }

        // Chave Estrangeira Opcional (FK) -> Catalogo_Defeito
        public int? DefeitoId { get; set; }

        [ForeignKey("DefeitoId")]
        public CatalogoDefeito? Defeito { get; set; }

        // Relações 1:1 com outras tabelas (Definidas no AppDbContext)
        public Retrabalho? Retrabalho { get; set; }
        public NaoConforme? NaoConforme { get; set; }
    }
}
