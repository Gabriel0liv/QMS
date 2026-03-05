using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Rececao_inspecao" (Inspeção Qualidade na Receção de Fornecedores)
    public class RececaoInspecao
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Guia gerada no ERP SAGE (Ex: "PTH-G01-25...")
        [Required]
        [MaxLength(255)]
        public string SagePedidoId { get; set; } = string.Empty;

        // Número da linha no SAGE (útil para diferenciar múltiplos artigos na mesma guia)
        [Required]
        public int Linha { get; set; }

        // Data em que o material entrou na fábrica
        [Required]
        public DateTime DataRececao { get; set; }

        // Quantidade total admitida na guia
        [Required]
        public decimal QtdTotalRecebida { get; set; }

        // Estado da inspeção no ciclo de vida do QMS:
        // "Pendente" = nova do SAGE, ainda por inspecionar
        // "Inspecionado" = já inspecionada pelo controlo de qualidade
        // "Cancelado" = existia mas deixou de aparecer no SAGE
        [Required]
        [MaxLength(50)]
        public string Estado { get; set; } = "Pendente";

        // Decisão do Inspetor de Qualidade — só preenchida quando Estado = "Inspecionado"
        [MaxLength(255)]
        public string? DecisaoFinal { get; set; }

        // Preço unitário da peça no momento da receção
        [Required]
        public decimal CustoUnitarioMomento { get; set; }

        // Nº de fatura (opcional)
        [MaxLength(255)]
        public string? Fatura { get; set; }

        // Unidade de medida gerida na receção
        [Required]
        [MaxLength(50)]
        public string Unidade { get; set; } = string.Empty;

        // Quantidade inspecionada
        [Required]
        public decimal Quantidade { get; set; }

        // Chaves Estrangeiras (FKs)
        [Required]
        [MaxLength(255)]
        public string FornecedorCodigo { get; set; } = string.Empty;

        [ForeignKey("FornecedorCodigo")]
        public Fornecedor? Fornecedor { get; set; }

        [Required]
        [MaxLength(255)]
        public string ArtigoCodigo { get; set; } = string.Empty;

        [ForeignKey("ArtigoCodigo")]
        public Artigo? Artigo { get; set; }

        [Required]
        [MaxLength(255)]
        public string UtilizadorCodigo { get; set; } = string.Empty;

        [ForeignKey("UtilizadorCodigo")]
        public Utilizador? Utilizador { get; set; }

        // Relação 1 para Muitos -> Várias justificações de erro por inspeção
        public ICollection<JustificacaoNOK> Justificacoes { get; set; } = new List<JustificacaoNOK>();
    }
}
