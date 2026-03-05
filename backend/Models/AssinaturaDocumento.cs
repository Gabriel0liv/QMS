using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    // Representa a tabela "Assinatura_documento" na base de dados
    public class AssinaturaDocumento
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Departamento onde a assinatura foi realizada (Ex: "Engenharia", "Qualidade")
        [Required]
        [MaxLength(255)]
        public string DepartamentoAssinatura { get; set; } = string.Empty;

        // Hash único que atesta a validade digital da assinatura
        // O UNIQUE será definido no AppDbContext para garantir que não há carimbos repetidos
        [Required]
        [MaxLength(255)]
        public string AssinaturaHash { get; set; } = string.Empty;

        // Data em que o documento foi assinado
        [Required]
        public DateTime DataAssinatura { get; set; }

        // Chave Estrangeira (FK) para o Documento_tecnico que foi assinado
        [Required]
        public int DocumentoId { get; set; }

        // Propriedade de Navegação para aceder aos dados do documento assinado
        [ForeignKey("DocumentoId")]
        public DocumentoTecnico? Documento { get; set; }

        // Chave Estrangeira (FK) para o Utilizador que realizou a assinatura
        [Required]
        [MaxLength(255)]
        public string UtilizadorCodigo { get; set; } = string.Empty;

        // Propriedade de Navegação para aceder aos dados de quem assinou
        [ForeignKey("UtilizadorCodigo")]
        public Utilizador? Utilizador { get; set; }
    }
}
