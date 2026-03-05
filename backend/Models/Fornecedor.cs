using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "fornecedor" na base de dados
    public class Fornecedor
    {
        // Chave Primária (PK) - Código único do fornecedor vindo do SAGE (Ex: "0000")
        [Key]
        [MaxLength(255)]
        public string FornecedorCodigo { get; set; } = string.Empty;

        // Nome do fornecedor
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; } = string.Empty;

        // A morada é opcional (Nullable)
        [MaxLength(255)]
        public string? Morada { get; set; }

        // Um fornecedor pode ter várias classificações fiscais ao longo dos anos
        public ICollection<FornecedorClassificacao> Classificacoes { get; set; } = new List<FornecedorClassificacao>();
    }
}
