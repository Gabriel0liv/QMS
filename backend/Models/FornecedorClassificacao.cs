using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Fornecedor_classificacao" na base de dados
    public class FornecedorClassificacao
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Ano fiscal referente à classificação
        // O índice UNIQUE (FornecedorCodigo + AnoFiscal) será configurado no AppDbContext
        [Required]
        public int AnoFiscal { get; set; }

        // Classificação atribuída ao fornecedor (Ex: "Normal", "Reduzido")
        [Required]
        [MaxLength(255)]
        public string Classificacao { get; set; } = string.Empty;

        // Chave Estrangeira (FK) para o Fornecedor
        [Required]
        [MaxLength(255)]
        public string FornecedorCodigo { get; set; } = string.Empty;

        // Propriedade de Navegação: Diz ao EF para carregar os dados do Fornecedor associado
        [ForeignKey("FornecedorCodigo")]
        public Fornecedor? Fornecedor { get; set; }
    }
}
