using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Representa a tabela "familia" na base de dados
    public class Familia
    {
        // Chave Primária (PK)
        [Key]
        public int Id { get; set; }

        // Código único da família (Ex: "ACE")
        // O UNIQUE será definido no AppDbContext
        [Required]
        [MaxLength(255)]
        public string Codigo { get; set; } = string.Empty;

        // Descrição da família (Ex: "03-Acessórios")
        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; } = string.Empty;

        // Parâmetros de inspeção base (opcional)
        [MaxLength(255)]
        public string? ParametrosInspecao { get; set; }

        // Uma família pode ter vários itens "diversos" associados
        public ICollection<Diversos> DiversosLista { get; set; } = new List<Diversos>();
    }
}
