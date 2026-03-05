using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "Catalogo_Defeito" na base de dados
    public class CatalogoDefeito
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Código do defeito (O UNIQUE será configurado no AppDbContext)
        [Required]
        [MaxLength(255)]
        public string Codigo { get; set; } = string.Empty;

        // Descrição do defeito (Ex: "Risco profundo na peça")
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;
    }
}
