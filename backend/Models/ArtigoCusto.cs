using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "artigo_Custo" na base de dados
    // Mantém o histórico snapshot de preços de um artigo ao longo do tempo.
    public class ArtigoCusto
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Data de início da validade deste preço
        [Required]
        public DateTime DataInicio { get; set; }

        // Data de fim da validade. Se for nulo, significa que é o custo atual!
        public DateTime? DataFim { get; set; }

        // Preço Total (Soma de todos os custos)
        [Required]
        public decimal PriTotal { get; set; } = 0;

        // Custo exato da Matéria-Prima
        [Required]
        public decimal PraMatprim { get; set; } = 0;

        // Custo imputado da Energia (rateio)
        [Required]
        public decimal PrecoEnergia { get; set; } = 0;

        // Custo imputado da Mão-de-Obra (rateio)
        [Required]
        public decimal PrwiMaoobra { get; set; } = 0;

        // Custo imputado da Máquina-Ferramenta
        [Required]
        public decimal PruMaquina { get; set; } = 0;

        // Custo imputado do serviço externo ou processamento superficial (Pintura/Tratamento)
        [Required]
        public decimal CustoPintura { get; set; } = 0;

        // Chave Estrangeira (FK) indicando a que artigo este custo pertence
        [Required]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        // Propriedade de Navegação para podermos carregar o Artigo facilmente
        [ForeignKey("ArtigoCodigo")]
        public Artigo? Artigo { get; set; }
    }
}
